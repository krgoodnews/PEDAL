#!/bin/bash

# pedal-sync.sh: Synchronizes PEDAL shared state and local runtime state.
# Version: 1.1 (Fixed Race Conditions and Lock Ownership)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/pedal-common.sh"

RUNTIME_DIR=$(get_runtime_dir)
RUNTIME_FILE="${RUNTIME_DIR}/runtime.json"
LOCK_DIR="${RUNTIME_DIR}/runtime.lock"
SHARED_FILE=$(get_shared_state_path)

# Initialize runtime environment
mkdir -p "${RUNTIME_DIR}"

# 1. Advisory Lock Implementation (Atomic via mkdir)
acquire_lock() {
  local max_retries=30
  local retry_count=0
  local wait_time=0.5
  local my_pid=$$

  while [ ${retry_count} -lt ${max_retries} ]; do
    if mkdir "${LOCK_DIR}" 2>/dev/null; then
      echo "${my_pid}" > "${LOCK_DIR}/pid"
      return 0
    fi

    # Check for stale lock
    if [ -d "${LOCK_DIR}" ]; then
      local lock_time
      # Use stat with fallback for macOS/Linux
      lock_time=$(stat -f %m "${LOCK_DIR}" 2>/dev/null || stat -c %Y "${LOCK_DIR}" 2>/dev/null)
      
      if [ -n "${lock_time}" ]; then
        local current_time
        current_time=$(date +%s)
        # Timeout: 60 seconds
        if [ $((current_time - lock_time)) -gt 60 ]; then
          echo "Stale lock detected (Owner PID: $(cat "${LOCK_DIR}/pid" 2>/dev/null)). Force releasing..." >&2
          rm -rf "${LOCK_DIR}"
          continue # Try again immediately after force release
        fi
      fi
    fi

    sleep ${wait_time}
    ((retry_count++))
  done

  echo "Error: Failed to acquire lock after ${max_retries} attempts. Lock owner PID: $(cat "${LOCK_DIR}/pid" 2>/dev/null)" >&2
  exit 1
}

release_lock() {
  local my_pid=$$
  if [ -d "${LOCK_DIR}" ]; then
    local lock_owner
    lock_owner=$(cat "${LOCK_DIR}/pid" 2>/dev/null)
    if [ "${lock_owner}" == "${my_pid}" ]; then
      rm -rf "${LOCK_DIR}"
    else
      # Do not delete if we don't own it, unless it's a force release (handled in acquire)
      : 
    fi
  fi
}

# 2. JSON Merge Logic (Deep Merge using jq)
merge_shared_state() {
  local new_data="$1"
  local old_data
  local my_pid=$$
  local tmp_file="${SHARED_FILE}.${my_pid}.tmp"
  
  # Try to sync with default branch (Optional but recommended to prevent split-brain)
  local default_branch
  default_branch=$(get_default_branch)
  local remote_data
  remote_data=$(git show "origin/${default_branch}:${SHARED_FILE##*/}" 2>/dev/null)
  
  if [ -f "${SHARED_FILE}" ]; then
    old_data=$(cat "${SHARED_FILE}")
  else
    old_data='{"version":"2.0","lastUpdated":"","features":{},"history":[]}'
  fi

  # If remote data exists, merge it first (highest priority for source of truth)
  if [ -n "${remote_data}" ]; then
     old_data=$(echo "${old_data}" | jq --argjson remote "${remote_data}" '
       .features = ($remote.features * .features) |
       .history = ((.history + $remote.history) | unique_by(.timestamp, .feature, .action) | sort_by(.timestamp))
     ')
  fi

  # Deep merge features and append history with unique check and sort
  echo "${old_data}" | jq --argjson new "$new_data" '
    .version = "2.0" |
    .lastUpdated = $new.lastUpdated |
    .features = (.features * ($new.features // {})) |
    .history = ((.history + ($new.history // [])) | 
                unique_by(.timestamp, .feature, .action, .details) | 
                sort_by(.timestamp))
  ' > "${tmp_file}" && mv -f "${tmp_file}" "${SHARED_FILE}"
}

update_runtime_state() {
  local feature="$1"
  local phase="$2"
  local my_pid=$$
  local tmp_file="${RUNTIME_FILE}.${my_pid}.tmp"
  local repo_root
  repo_root=$(git rev-parse --show-toplevel 2>/dev/null)
  local worktree_path=$(pwd)
  local current_time
  current_time=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

  local runtime_data
  if [ -f "${RUNTIME_FILE}" ]; then
    runtime_data=$(cat "${RUNTIME_FILE}")
  else
    runtime_data='{"repoRoot":"","activeWorktrees":{},"agentLocks":{},"lastActivity":""}'
  fi

  echo "${runtime_data}" | jq \
    --arg root "${repo_root}" \
    --arg feature "${feature}" \
    --arg path "${worktree_path}" \
    --arg pid "${my_pid}" \
    --arg time "${current_time}" \
    '
    .repoRoot = $root |
    .activeWorktrees[$feature] = $path |
    .agentLocks[$feature] = {"pid": ($pid | tonumber), "startTime": $time} |
    .lastActivity = $time
    ' > "${tmp_file}" && mv -f "${tmp_file}" "${RUNTIME_FILE}"
}

# 3. Public Commands
case "$1" in
  update)
    shift
    FEATURE=""
    PHASE=""
    DESC=""
    while [[ $# -gt 0 ]]; do
      case $1 in
        --feature) FEATURE="$2"; shift ;;
        --phase) PHASE="$2"; shift ;;
        --desc) DESC="$2"; shift ;;
      esac
      shift
    done

    if [ -z "${FEATURE}" ] || [ -z "${PHASE}" ]; then
      echo "Usage: pedal-sync update --feature {id} --phase {p} [--desc {d}]"
      exit 1
    fi

    acquire_lock
    trap release_lock EXIT

    CURRENT_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    NEW_SHARED_DATA=$(jq -n \
      --arg feature "${FEATURE}" \
      --arg phase "${PHASE}" \
      --arg time "${CURRENT_TIME}" \
      --arg desc "${DESC}" \
      '{
        "lastUpdated": $time,
        "features": { ($feature): { "phase": $phase, "status": "in_progress", "updatedAt": $time, "description": $desc } },
        "history": [{ "timestamp": $time, "action": "phase_progression", "feature": $feature, "details": ("Moved to " + $phase + ": " + $desc) }]
      }')

    merge_shared_state "${NEW_SHARED_DATA}"
    update_runtime_state "${FEATURE}" "${PHASE}"
    
    echo "Successfully updated state for ${FEATURE} to ${PHASE}."
    ;;

  init)
    echo "Initializing 2-tier state..."
    acquire_lock
    trap release_lock EXIT

    OLD_STATUS=".pedal-status.json"
    if [ -f "${OLD_STATUS}" ]; then
      echo "Migrating from ${OLD_STATUS}..."
      mv "${OLD_STATUS}" "${SHARED_FILE}"
      echo "Migration complete."
      update_runtime_state "migration" "init"
    else
      merge_shared_state '{"features":{},"history":[]}'
    fi
    ;;

  *)
    echo "Usage: pedal-sync {update|init} [options]"
    exit 1
    ;;
esac

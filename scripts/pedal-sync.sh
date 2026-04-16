#!/bin/bash

# pedal-sync.sh: Synchronizes PEDAL shared state and local runtime state.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/pedal-common.sh"

RUNTIME_DIR=$(get_runtime_dir)
RUNTIME_FILE="${RUNTIME_DIR}/runtime.json"
LOCK_DIR="${RUNTIME_DIR}/runtime.lock"
SHARED_FILE=$(get_shared_state_path)

# Initialize runtime environment
mkdir -p "${RUNTIME_DIR}"

# 1. Advisory Lock Implementation
acquire_lock() {
  local max_retries=20
  local retry_count=0
  local wait_time=0.5

  while [ ${retry_count} -lt ${max_retries} ]; do
    if mkdir "${LOCK_DIR}" 2>/dev/null; then
      echo $$ > "${LOCK_DIR}/pid"
      return 0
    fi

    # Check for stale lock (timeout 1 min)
    if [ -f "${LOCK_DIR}/pid" ]; then
      local lock_time
      lock_time=$(stat -c %Y "${LOCK_DIR}" 2>/dev/null || stat -f %m "${LOCK_DIR}" 2>/dev/null)
      local current_time
      current_time=$(date +%s)
      if [ $((current_time - lock_time)) -gt 60 ]; then
        echo "Stale lock detected. Releasing..."
        release_lock
        continue
      fi
    fi

    sleep ${wait_time}
    ((retry_count++))
  done

  echo "Error: Failed to acquire lock after ${max_retries} attempts." >&2
  exit 1
}

release_lock() {
  rm -rf "${LOCK_DIR}"
}

# 2. JSON Merge Logic (Deep Merge using jq)
merge_shared_state() {
  local new_data="$1"
  local old_data
  
  if [ -f "${SHARED_FILE}" ]; then
    old_data=$(cat "${SHARED_FILE}")
  else
    old_data='{"version":"2.0","lastUpdated":"","features":{},"history":[]}'
  fi

  # Deep merge features and append history with unique check and sort
  echo "${old_data}" | jq --argjson new "$new_data" '
    .version = "2.0" |
    .lastUpdated = $new.lastUpdated |
    .features = (.features * ($new.features // {})) |
    .history = ((.history + ($new.history // [])) | 
                unique_by(.timestamp, .feature, .action) | 
                sort_by(.timestamp))
  ' > "${SHARED_FILE}.tmp" && mv "${SHARED_FILE}.tmp" "${SHARED_FILE}"
}

update_runtime_state() {
  local feature="$1"
  local phase="$2"
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
    --arg pid "$$" \
    --arg time "${current_time}" \
    '
    .repoRoot = $root |
    .activeWorktrees[$feature] = $path |
    .agentLocks[$feature] = {"pid": ($pid | tonumber), "startTime": $time} |
    .lastActivity = $time
    ' > "${RUNTIME_FILE}.tmp" && mv "${RUNTIME_FILE}.tmp" "${RUNTIME_FILE}"
}

# 3. Public Commands
case "$1" in
  update)
    shift
    # Parse args (basic version)
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

    # Migration logic
    OLD_STATUS=".pedal-status.json"
    if [ -f "${OLD_STATUS}" ]; then
      echo "Migrating from ${OLD_STATUS}..."
      mv "${OLD_STATUS}" "${SHARED_FILE}"
      echo "Migration complete. Old file moved to ${SHARED_FILE}."
      # Initialize runtime with current state
      update_runtime_state "migration" "init"
    else
      echo "No old status found. Creating new shared state."
      merge_shared_state '{"features":{},"history":[]}'
    fi
    ;;

  *)
    echo "Usage: pedal-sync {update|init} [options]"
    exit 1
    ;;
esac

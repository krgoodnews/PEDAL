#!/bin/bash

# pedal-common.sh: Shared utilities for PEDAL state management.

# 1. Repository ID Generation (SHA-256 hash of absolute path)
get_repo_id() {
  local repo_root
  repo_root=$(git rev-parse --show-toplevel 2>/dev/null)
  if [ -z "${repo_root}" ]; then
    echo "Error: Not a git repository." >&2
    exit 1
  fi
  printf "%s" "${repo_root}" | shasum -a 256 | cut -c1-8
}

# 2. Runtime Path Calculation
get_runtime_dir() {
  local repo_id
  repo_id=$(get_repo_id)
  echo "${HOME}/.pedal/${repo_id}"
}

# 3. Default Branch Detection
get_default_branch() {
  local branch
  # Try origin/HEAD first
  branch=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@')
  
  if [ -z "${branch}" ]; then
    # Fallback: check main or master
    if git rev-parse --verify main >/dev/null 2>&1; then
      branch="main"
    elif git rev-parse --verify master >/dev/null 2>&1; then
      branch="master"
    else
      branch="master" # Last resort
    fi
  fi
  echo "${branch}"
}

# 4. Shared State Path
get_shared_state_path() {
  local repo_root
  repo_root=$(git rev-parse --show-toplevel 2>/dev/null)
  echo "${repo_root}/.pedal-status.shared.json"
}

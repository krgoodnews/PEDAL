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

# 3. Default Branch Detection (Prioritize 'develop' for active feature integration)
get_default_branch() {
  local branch
  
  # 1. Check if 'develop' exists locally or remotely
  if git rev-parse --verify develop >/dev/null 2>&1 || git rev-parse --verify origin/develop >/dev/null 2>&1; then
    branch="develop"
  # 2. Try origin/HEAD
  elif branch=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@'); then
    : # branch is already set
  # 3. Fallback to main or master
  elif git rev-parse --verify main >/dev/null 2>&1; then
    branch="main"
  else
    branch="master"
  fi
  echo "${branch}"
}

# 4. Shared State Path
get_shared_state_path() {
  local repo_root
  repo_root=$(git rev-parse --show-toplevel 2>/dev/null)
  echo "${repo_root}/.pedal-status.shared.json"
}

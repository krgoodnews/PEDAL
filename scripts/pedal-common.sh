#!/bin/bash

# pedal-common.sh: Shared utilities for PEDAL state management.

# 0. Internal: Unified Repo Root Detection
_get_main_repo_root() {
  local common_dir
  common_dir=$(git rev-parse --path-format=absolute --git-common-dir 2>/dev/null)
  if [ -z "${common_dir}" ]; then
    echo "Error: Not a git repository." >&2
    exit 1
  fi
  # If it's a worktree, common_dir points to the main .git folder.
  # We want the parent of that folder as the stable root.
  if [[ "${common_dir}" == *"/.git" ]]; then
    dirname "${common_dir}"
  else
    # In some cases (like bare repos or specific git versions), it might just be the dir.
    echo "${common_dir}"
  fi
}

# 1. Repository ID Generation (SHA-256 hash of absolute main repo path)
get_repo_id() {
  local repo_root
  repo_root=$(_get_main_repo_root)
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
  # ... (existing logic)
  if git rev-parse --verify develop >/dev/null 2>&1 || git rev-parse --verify origin/develop >/dev/null 2>&1; then
    branch="develop"
  elif branch=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@'); then
    : 
  elif git rev-parse --verify main >/dev/null 2>&1; then
    branch="main"
  else
    branch="master"
  fi
  echo "${branch}"
}

# 4. Workspace & Repo Context (Stable across worktrees)
get_workspace_root() {
  local repo_root
  repo_root=$(_get_main_repo_root)
  dirname "${repo_root}"
}

get_repo_name() {
  local repo_root
  repo_root=$(_get_main_repo_root)
  basename "${repo_root}"
}

# 5. Shared State Path (Always points to the main repo's shared file)
get_shared_state_path() {
  local repo_root
  repo_root=$(_get_main_repo_root)
  echo "${repo_root}/.pedal-status.shared.json"
}

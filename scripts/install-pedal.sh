#!/bin/sh

set -eu

DEFAULT_REPO="krgoodnews/PEDAL"
DEFAULT_REF="master"

REPO="${PEDAL_REPO:-$DEFAULT_REPO}"
REF="${PEDAL_REF:-$DEFAULT_REF}"
TARGET_DIR="$(pwd)"
FORCE=0
INSTALL_AGENT_FILES=1

usage() {
  cat <<'USAGE'
Install PEDAL workflow files into a workspace.

Usage:
  install-pedal.sh [options]

Options:
  --dir PATH          Install into PATH instead of the current directory.
  --repo OWNER/REPO   GitHub repository to download from. Defaults to krgoodnews/PEDAL.
  --ref REF           Git ref to download. Defaults to master.
  --force             Replace existing PEDAL files if they already exist.
  --no-agent-files    Install only .pedal/ and scripts/, not agent adapter files.
  -h, --help          Show this help.

Remote usage:
  curl -fsSL https://raw.githubusercontent.com/krgoodnews/PEDAL/master/scripts/install-pedal.sh | sh
  curl -fsSL https://raw.githubusercontent.com/krgoodnews/PEDAL/master/scripts/install-pedal.sh | sh -s -- --dir ./my-workspace
USAGE
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --dir)
      [ "$#" -ge 2 ] || {
        echo "Error: --dir requires a path." >&2
        exit 2
      }
      TARGET_DIR=$2
      shift 2
      ;;
    --repo)
      [ "$#" -ge 2 ] || {
        echo "Error: --repo requires OWNER/REPO." >&2
        exit 2
      }
      REPO=$2
      shift 2
      ;;
    --ref)
      [ "$#" -ge 2 ] || {
        echo "Error: --ref requires a git ref." >&2
        exit 2
      }
      REF=$2
      shift 2
      ;;
    --force)
      FORCE=1
      shift
      ;;
    --no-agent-files)
      INSTALL_AGENT_FILES=0
      shift
      ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      echo "Error: Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

need_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: '$1' is required." >&2
    exit 1
  fi
}

download_file() {
  url=$1
  output=$2

  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$url" -o "$output"
  elif command -v wget >/dev/null 2>&1; then
    wget -qO "$output" "$url"
  else
    echo "Error: either 'curl' or 'wget' is required." >&2
    exit 1
  fi
}

install_path() {
  source_path=$1
  relative_path=$2
  destination_path=$TARGET_DIR/$relative_path
  destination_parent=$(dirname "$destination_path")

  check_installable "$source_path" "$relative_path"

  if [ -e "$destination_path" ]; then
    rm -rf "$destination_path"
  fi

  mkdir -p "$destination_parent"
  cp -R "$source_path" "$destination_path"
}

check_installable() {
  source_path=$1
  relative_path=$2
  destination_path=$TARGET_DIR/$relative_path

  if [ ! -e "$source_path" ]; then
    echo "Error: expected source path is missing: $relative_path" >&2
    exit 1
  fi

  if [ "$FORCE" -ne 1 ] && [ -e "$destination_path" ]; then
    echo "Error: $relative_path already exists. Re-run with --force to replace it." >&2
    exit 1
  fi
}

need_command tar
need_command mktemp

mkdir -p "$TARGET_DIR"
TARGET_DIR=$(cd "$TARGET_DIR" && pwd)

TMP_DIR=$(mktemp -d)
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT INT TERM

ARCHIVE=$TMP_DIR/pedal.tar.gz
ARCHIVE_URL=${PEDAL_ARCHIVE_URL:-"https://github.com/$REPO/archive/$REF.tar.gz"}

echo "Downloading PEDAL from $REPO@$REF..."
download_file "$ARCHIVE_URL" "$ARCHIVE"

TOP_DIR=$(tar -tzf "$ARCHIVE" | sed -n '1s#/.*##p')
if [ -z "$TOP_DIR" ]; then
  echo "Error: could not inspect downloaded archive." >&2
  exit 1
fi

tar -xzf "$ARCHIVE" -C "$TMP_DIR"
SOURCE_ROOT=$TMP_DIR/$TOP_DIR

check_installable "$SOURCE_ROOT/.pedal" ".pedal"
check_installable "$SOURCE_ROOT/scripts/pedal-common.sh" "scripts/pedal-common.sh"
check_installable "$SOURCE_ROOT/scripts/install-pedal.sh" "scripts/install-pedal.sh"
check_installable "$SOURCE_ROOT/scripts/pedal-notification.sh" "scripts/pedal-notification.sh"

if [ "$INSTALL_AGENT_FILES" -eq 1 ]; then
  check_installable "$SOURCE_ROOT/AGENTS.md" "AGENTS.md"
  check_installable "$SOURCE_ROOT/GEMINI.md" "GEMINI.md"
  check_installable "$SOURCE_ROOT/.github/copilot-instructions.md" ".github/copilot-instructions.md"
  check_installable "$SOURCE_ROOT/.cursor/rules/pedal.mdc" ".cursor/rules/pedal.mdc"
fi

install_path "$SOURCE_ROOT/.pedal" ".pedal"
install_path "$SOURCE_ROOT/scripts/pedal-common.sh" "scripts/pedal-common.sh"
install_path "$SOURCE_ROOT/scripts/install-pedal.sh" "scripts/install-pedal.sh"
install_path "$SOURCE_ROOT/scripts/pedal-notification.sh" "scripts/pedal-notification.sh"

if [ "$INSTALL_AGENT_FILES" -eq 1 ]; then
  install_path "$SOURCE_ROOT/AGENTS.md" "AGENTS.md"
  install_path "$SOURCE_ROOT/GEMINI.md" "GEMINI.md"
  install_path "$SOURCE_ROOT/.github/copilot-instructions.md" ".github/copilot-instructions.md"
  install_path "$SOURCE_ROOT/.cursor/rules/pedal.mdc" ".cursor/rules/pedal.mdc"
fi

chmod +x "$TARGET_DIR/scripts/pedal-common.sh" \
  "$TARGET_DIR/scripts/install-pedal.sh" \
  "$TARGET_DIR/scripts/pedal-notification.sh"

echo "PEDAL installed into $TARGET_DIR"
echo "Next: create or clone project repositories under this workspace, then run PEDAL from the workspace root."

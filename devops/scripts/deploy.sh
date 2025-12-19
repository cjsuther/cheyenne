#!/bin/bash

show_help() {
cat << EOF
██████╗ ███████╗██████╗ ██╗      ██████╗ ██╗   ██╗
██╔══██╗██╔════╝██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝
██║  ██║█████╗  ██████╔╝██║     ██║   ██║ ╚████╔╝
██║  ██║██╔══╝  ██╔═══╝ ██║     ██║   ██║  ╚██╔╝
██████╔╝███████╗██║     ███████╗╚██████╔╝   ██║
╚═════╝ ╚══════╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝

Usage: deploy.sh [OPTIONS]

Options:
  -p, --project-name     Project name (required)
  -c, --clean            Run docker image prune -f after
  -q, --quiet            Do not log anything
  -d, --dry-run          Dry run, do not run any commands but log them
  --develop-branch       Name of the develop branch (default: develope)
  --release-branch       Name of the release branch (default: test)
  -h, --help             Show this help message

Examples:
  ./deploy.sh -p laramie-seguridad-web
  ./deploy.sh -p laramie-seguridad-web -c

/!\\=================================================/!\\
|                                                     |
|  IMPORTANT: This script must be run as root.        |
|  Please ensure you have the necessary permissions.  |
|                                                     |
/!\\=================================================/!\\
EOF
}

log() {
    if [ "$QUIET" = false ]; then
        echo "$1"
    fi
}

run_command() {
    if [ "$DRY_RUN" = false ]; then
        log "Running: $1"
        eval "$1"
    else
        log "Dry-run: $1"
    fi
}

# Check if the user is root
if [[ "$EUID" -ne 0 ]]; then
   echo "This script must be run as root"
   exit 1
fi

PROJECT_NAME=""
CLEAN=false
QUIET=false
DRY_RUN=false
DEVELOP_BRANCH="develop"
RELEASE_BRANCH="test"

while [[ "$1" != "" ]]; do
    case $1 in
        -p | --project-name ) shift
                              PROJECT_NAME=$1
                              ;;
        -c | --clean )        CLEAN=true
                              ;;
        -q | --quiet )        QUIET=true
                              ;;
        -d | --dry-run )      DRY_RUN=true
                              ;;
        --develop-branch )    shift
                              DEVELOP_BRANCH=$1
                              ;;
        --release-branch )    shift
                              RELEASE_BRANCH=$1
                              ;;
        -h | --help )         show_help
                              exit 0
                              ;;
        * )                   show_help
                              exit 1
    esac
    shift
done

if [ -z "$PROJECT_NAME" ]; then
    show_help
    exit 1
fi

# Extract the first section of the project name for Docker compose project name
DOCKER_PROJECT_NAME=$(echo "$PROJECT_NAME" | rev | cut -d'-' -f2- | rev)
CONTAINER_NAME="${DOCKER_PROJECT_NAME}-${PROJECT_NAME}-1"

log "Starting deployment for project: $PROJECT_NAME"

run_command "cd $PROJECT_NAME"

run_command "git checkout $RELEASE_BRANCH"
run_command "git pull origin $RELEASE_BRANCH"

run_command "git checkout $DEVELOP_BRANCH"
run_command "git pull origin $DEVELOP_BRANCH"

run_command "git checkout $RELEASE_BRANCH"
MERGE_OUTPUT=$(git merge origin $DEVELOP_BRANCH -m "merge $DEVELOP_BRANCH")
log "$MERGE_OUTPUT"

if [[ "$MERGE_OUTPUT" != *"Already up to date."* ]]; then
    log "Continue with deployment"
    run_command "git push origin $RELEASE_BRANCH"
    run_command "docker stop $CONTAINER_NAME"
    run_command "docker rm $CONTAINER_NAME"
    run_command "docker compose -p $DOCKER_PROJECT_NAME build"
    run_command "docker compose -p $DOCKER_PROJECT_NAME create"
    run_command "docker compose -p $DOCKER_PROJECT_NAME start"

    if [ "$CLEAN" = true ]; then
        run_command "docker image prune -f"
    fi
else
    log "Already up to date. No further action required."
fi

log "Deployment complete for project: $PROJECT_NAME"


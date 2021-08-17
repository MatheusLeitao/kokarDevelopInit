#!/bin/bash
clear

GIT_CREDENTIAL="matheus"
PACKAGES=("git" "docker" "docker-compose" "python3" "node" "npm")
NPM_PACKAGES=()
PACKAGES_INSTALLED=()
PACKAGES_UNINSTALLED=()
LOCAL_ROOT=./
FILE=~/.git-credentials
WORK_DIR=./kokarDevelopInit/

# @VER variable used to turn off docker instalation. A more complete installation.
VER=false


# Function to check/parse arguments initated with
function check() {
    local OPTIND opt i
    while getopts -- ":uap:-:" opt; do
        case ${opt} in
        -)
            case "${OPTARG}" in
                url)
                    URL="${!OPTIND}"; OPTIND=$(( $OPTIND + 1 ))
                    # echo "Parsing option: '--${OPTARG}', value: '${URL}'" >&2;
                    echo "Pull url is set to: '${URL}'" >&2;
                    ;;
                help)
                    __help_message true
                    process_kill
                    ;;
                *)
                    if [ "$OPTERR" = 1 ] && [ "${optspec:0:1}" != ":" ]; then
                        echo "Unknown option --${OPTARG}" >&2
                    fi
                    ;;
            esac
            ;;
        u)
            printf "UPGRADING APT-GET ... \r"
            apt-get upgrade -y
            printf "UPGRADING APT-GET \t ✅"
            sleep 3
            clear
            echo
            ;;
        a)
            echo "SETTED TO ISNTALL ALL PACKAGES"
            VER=true
            ;;
        p)
            echo "PORT DEFINED TO ${OPTARG}"
            WORK_PORT=${OPTARG}
            ;;
        ?)
            echo "Option not recognized by the system."
            echo "Expected [-a], [-u] or [--url] got: [-${opt}]"
            __help_message false
            process_kill
            ;;
        esac
    done
    shift $((OPTIND - 1))
}

YELLOW='\u001b[38;5;227m'
RED='\033[0;31m'
GREEN='\033[0;32m'
GRAY='\033[1;30m'
BOLD='\033[1m'
NOTBOLD='\033[0m'
NC='\033[0m'
CL='\033[K'
BOLDRED='\033[1m\033[0;31m'
BOLDGREEN='\033[1m\033[0;32m'

# as the name sugest, it display an help message.
function __help_message() {
    # the help_message must be called "__help_message false" so it doesn't display all of its content.
    if $1;then
        echo "            _               ___               _              _____       _ _   "
        echo "  /\ /\___ | | ____ _ _ __ /   \_____   _____| | ___  _ __   \_   \_ __ (_) |_ "
        echo " / //_/ _ \| |/ / _\` | '__/ /\ / _ \ \ / / _ \ |/ _ \| '_ \   / /\/ '_ \| | __|"
        echo "/ __ \ (_) |   < (_| | | / /_//  __/\ V /  __/ | (_) | |_) /\/ /_ | | | | | |_ "
        echo "\/  \/\___/|_|\_\__,_|_|/___,' \___| \_/ \___|_|\___/| .__/\____/ |_| |_|_|\__|"
        echo "                                                     |_|                       "
        echo
        echo "Script made so it will automatically run a webserver which starts up a listener to Github's webhook payload. All options below are made intuitively"
        echo
    fi
    echo "Usage: bash kokarDevelopInit.sh [OPTIONS] or ./kokarDevelopInit.sh [OPTIONS]"
    echo -e "Example: bash kokarDevelopInit.sh -ua -p --url \"https://github.com/MatheusLeitao/kokarDevelopInit.git\""
    echo -e "\t\t\t\t  -u if the machine is completely new, its recommended to runs"
    echo -e "\t\t\t\t  -a since the application runs on docker, it must install all dependencies.\n"
    echo "Please, note:"
    echo "-a        -all, it will download all dependencies needed '${PACKAGES[*]}'"
    echo '-u        -upgrade, if it is a whole new system, it may need to apt-upgrade altogether'
    echo -e "\t  it only runs sudo apt-get upgrade, ${BOLDGREEN}recommended.${NC}\n"
    echo '--url*¹   --url, url which the webhook server will listen to in order to build automatically'
    echo -e "\t  This url will be used to clone it's repository and to config/start server.js\n"
    echo
    echo
    echo -e "${BOLDRED}*¹This argument is OBLIGATORY, it MUST be set!\n${NC}"

    if $1;then
        echo 'Script made by: Matheus Leitão'
        echo 'Socials: '
        echo -e "\tInstagram: @matheusleitao\n\tGithub: @matheusleitao\n"
    fi
}

# Both are called within "check_packages" method. They're for display message at the terminal and push packages to the
# package array wich will be called at "install_packages"
function message_installed() {
    echo -e "$1 installed \t✅"
    PACKAGES_INSTALLED+=" $1"
}

function message_uninstalled() {
    echo -e "$1 ins't installed \t❌"
    PACKAGES_UNINSTALLED+=" $1"
}

# Repo which is being pulled is the source code, so it starts server.js the listener.
function pull_repo() {
    clear
    git clone https://github.com/MatheusLeitao/kokarDevelopInit.git
    chmod 777 -R kokarDevelopInit/
    return 13
}

# An 'Fail-over' function, simply putting, if tries to pull repository, but it doesn't work, it will try to intall git in the machine
# ! not working anymore since all packages are garanted to be installed before needed.
# function install_git() {
#     apt-get install git -y ; pull_repo
# }

# Before running the code, it must check if all needed packages are installed and ready to use.
function check_packages() {
    echo "Verificando todas as dependências necessitadas ... ✅"
    echo

    for PACK in ${PACKAGES[@]}; do
        $PACK --version > /dev/null 2>&1
        [ "$?" == 0 ] && message_installed $PACK || message_uninstalled $PACK
    done
}

# If there are any package needed which isn't installed, here it will be installed.
function install_packages() {
    clear
    echo "INSTALING PACKAGES $@"
    IFS=' ' read -ra PKGS <<< "$@"

    for PKG in ${PKGS[@]}; do
        ! [[ "$PKG" =~ "docker" ]] && apt-get install $PKG -y
        [[ "$PKG" =~ "node" ]] && apt-get install nodejs -y

        if $VER ;then
            if [[ "$PKG" =~ "docker" ]] && ! [[ "$PKG" =~ "compose" ]];then
                apt-get remove docker docker-engine docker.io containerd runc -y
                apt-get install apt-transport-https ca-certificates curl gnupg lsb-release -y
                curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
                echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
                apt-get update -y
                apt-get install docker-ce docker-ce-cli containerd.io -y
            fi
            if [[ "$PKG" =~ "compose" ]];then
                curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
                chmod +x /usr/local/bin/docker-compose
            fi
        fi

    done

    clear
    check_packages
}

# Check if the machine already has any git credential stored, if there are, it checks if fits its crieteria, those, if is from kokardeveloper or develop kokar.
function check_git_credentials () {
    if test -f "$FILE"; then
        if ! [[ "$(cat $FILE)" =~ "$GIT_CREDENTIAL" ]]; then
            echo ".git-credentials already exists, changing it to fit its criteria."
            echo "https://matheusleitao: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@github.com" > ~/.git-credentials
            echo "File changed."
        fi
    else
        echo "https://matheusleitao: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@github.com" > ~/.git-credentials
    fi
}

# Function to interrupt the code when needed.
function process_kill() {
    [[ $PS1 ]] && return || exit;
}

# Pulls the repository to this directory. Why? Simple, since the server.js, webhook listener, will ONLY work on pull requests, it WON'T CLONE
# hence, it needs to be cloned here.
function __pull_requested_repository() {
    git clone $URL

    # Attempt to set a repo workdir which would be called in handleServices.sh
    # as, the workdir is sent by the server.js, needn't to sent through here.
    # IFS='/'
    # read -a strarr <<< "$URL"
    # WORK_REPO_DIR=${strarr[4]/".git"/""}
    # echo $WORK_REPO_DIR > .git-workdir

}


function init_server () {
    __pull_requested_repository
    cd $WORK_DIR
    npm install
    node server.js $URL $WORK_PORT
}

function init_development(){
    # Cheking if all required packages are installed.
    check_packages

    # Check if there's .git-credentials stored into your system
    # if there is none, it will create one.
    check_git_credentials

    # If there any package left to be installed
    sleep 2

    [[ ${#PACKAGES_UNINSTALLED[@]} -gt 0 ]] && install_packages ${PACKAGES_UNINSTALLED[@]}


    # If git is installed, it will pull the script needed
    if [[ " ${PACKAGES_INSTALLED[@]} " =~ "git" ]];then pull_repo; fi
}

function setup_development() {
    [[ -f "$WORK_DIR/server.js" ]] && init_server || echo "Error: Couldn't find server module"
}


# * Check if user sent the right params, as for --url, it is a must!
# * In order to listen any payload sent by the Github,so we can filter
# ! if the payload is sent by the requested repository.
check $@

# if URL isn't set, the code won't/can't run. As mentioned above, we must
# have the $URL so we can set throughout the whole code and, it will clone it's
# repo
if [ -z ${URL+x} ]; then
    echo -e "ERROR: ${BOLDRED}Expected --url param.${NC}"
    echo
    __help_message false
    process_kill
fi


# Starts all its process to build an development environment
init_development

#setup development to its use
setup_development

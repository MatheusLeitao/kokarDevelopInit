#!/bin/bash

echo "Initializing building process."

function process_kill() {
    [[ $PS1 ]] && return || exit;
}

export WORK_DIR=$1
export BRANCH=$2

cd $WORK_DIR


# ! LOCAL ONDE SERÁ FEITO A AUTOMATIZAÇÃO PERSONALIZADA POR ENQUANTO!
# ! AQUI, SERÁ POSTO A ROTINA QUE É NECESSÁRIA PARA PODER COLOCAR O
# ! SEU CÓDIGO RODANDO.

#####

git checkout $BRANCH
git pull

docker container stop $(docker container ls -aq)
docker-compose up -d --build

####

echo "Work dir will be: $WORK_DIR"
echo "Branch which will be displayed >> $1"
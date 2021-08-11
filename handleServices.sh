#!/bin/bash

export BRANCH=develop

git branch $BRANCH
git pull

docker container stop $(git container ls -aq)
docker-compose up --build

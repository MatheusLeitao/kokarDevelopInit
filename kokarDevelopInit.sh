#!/bin/bash
echo "Verificando todas as dependências necessitadas ... ✅"
git --version > /dev/null 2>&1
echo $?
docker-compose --version > /dev/null 2>&1
echo $?
python3 --version > /dev/null 2>&1
echo $?
node --version > /dev/null 2>&1
echo $?
npm --version > /dev/null 2>&1
echo $?

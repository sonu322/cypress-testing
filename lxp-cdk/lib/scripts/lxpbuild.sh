#!/bin/bash


#!/bin/bash

function lxpbuilds() {
    buildDirectory=$(realpath "../../builds")
    # read env.json file
    envfile=$(cat "../resource/env.json")
    if [ "$ENV" == "dev" ]; then
        echo "dev env"
        envjson=$(echo "$envfile" | jq -c '.dev')
        echo "$envjson"
        # store hostname to a variable
        descriptor=$(echo "$envjson" | jq -r '.descriptor_url')
        git_branch=$(echo "$envjson" | jq -r '.branch')
        echo "$descriptor"
    elif [ "$ENV" == "prod" ]; then
        echo "prod env"
        envjson=$(echo "$envfile" | jq -c '.prod')
        echo "$envjson"
        # store hostname to a variable
        descriptor=$(echo "$envjson" | jq -r '.descriptor_url')
        git_branch=$(echo "$envjson" | jq -r '.branch')
        echo "$descriptor"
    else
        echo "env not found"
    fi


    if [ ! -d "$buildDirectory" ]; then
        echo "buildDirectory does not exist. Creating..."
        mkdir -p "$buildDirectory"
    elif [ -d "$buildDirectory" ]; then
        echo "buildDirectory exists. Deleting..."
        rm -rf "$buildDirectory"
        echo "buildDirectory deleted. Creating..."
        mkdir -p "$buildDirectory"
    fi
    cd "$buildDirectory"
    echo "buildDirectory created"
    git clone https://github.com/Optimizory/lxp-cloud.git
    echo "cloned"
    cd "lxp-cloud"
    echo "changed directory"
    git checkout $git_branch
    npm install && npm run update-descriptor $descriptor && npm run build
   # npm install && npm run build

    echo "build done"
    cd dist
    echo "changed directory"

    rm -rf original-atlassian-connect.json
    echo "deleted file"
    echo "--------- new file ---------"
}

lxpbuilds

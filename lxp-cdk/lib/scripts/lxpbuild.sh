#!/bin/bash


#!/bin/bash

function lxpbuilds() {
    versionfile=$(cat "../resource/version.json")
    echo "$versionfile"
    versionjson=$(echo "$versionfile" | jq -c '.')
    buildDirectory=$(realpath "../builds")

    if [ ! -d "$buildDirectory" ]; then
        echo "buildDirectory does not exist. Creating..."
        mkdir -p "$buildDirectory"
    fi

    for ver in $(echo "$versionjson" | jq -c '.[]'); do
        cd "$buildDirectory"

        verhostname=$(echo "$ver" | jq -r '.hostname')
        echo "$verhostname"

        verdirectory=$(realpath "$buildDirectory/$verhostname")
        echo "$verdirectory"
        mkdir -p "$verdirectory"
        echo "directory created"

        cd "$verdirectory"
        git clone https://github.com/Optimizory/lxp-cloud.git
        echo "cloned"

        cd "lxp-cloud"
        echo "changed directory"
        git checkout $(echo "$ver" | jq -r '.git_tag_name')

        npm install && npm run build
        echo "build done"

        cd dist
        echo "changed directory"

        rm -rf original-atlassian-connect.json
        echo "deleted file"
        echo "--------- new file ---------"
    done

    echo "$buildDirectory"
}

lxpbuilds

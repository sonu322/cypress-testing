#!/bin/bash


#!/bin/bash

function lxpbuilds() {
    versionfile=$(cat "../resource/version.json")
    echo "$versionfile"
    versionjson=$(echo "$versionfile" | jq -c '.')
    buildDirectory=$(realpath "../../builds")

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
        # if directory exists overwrite with empty directory
        if [ -d "$verdirectory" ]; then
            echo "version directory exists. overwriting..."
            rm -rf "$verdirectory"
        fi
        mkdir -p "$verdirectory"
        echo "directory created"

        cd "$verdirectory"
        git clone https://github.com/Optimizory/lxp-cloud.git
        echo "cloned"

        cd "lxp-cloud"
        echo "changed directory"
        git checkout $(echo "$ver" | jq -r '.git_tag_name')

        # TODO: Make this descriptor URL parameterized
        npm install && npm run update-descriptor https://connect.dev.lxp.optimizoryapps.com && npm run build-prod
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
#!/bin/bash
BASE_URL=${1:-https://lxp.optimizoryapps.com}

echo "Removing old build directory and cache"
rm -rf ./dist;
rm -rf ./.cache;
echo "Setting baseUrl to Amazon Cloudfront url $BASE_URL"
# jq '.baseUrl = "https://lxp.optimizoryapps.com" | .links.self = "https://lxp.optimizoryapps.com/atlassian-connect.json"' assets/original-atlassian-connect.json > assets/atlassian-connect.json

node descriptorUpdater.js "$BASE_URL"
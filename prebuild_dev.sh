#!/bin/bash

echo "Removing old build directory and cache"
rm -rf ./dist;
rm -rf ./.cache;
echo "Setting baseUrl to Amazon Cloudfront url https://lxp-dev.optimizoryapps.com"
# jq '.baseUrl = "https://lxp-dev.optimizoryapps.com" | .links.self = "https://lxp-dev.optimizoryapps.com/atlassian-connect.json"' assets/original-atlassian-connect.json > assets/atlassian-connect.json

node descriptorUpdater.js https://lxp-dev.optimizoryapps.com

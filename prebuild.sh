#!/bin/bash

echo "Removing old build directory and cache"
rm -rf ./dist;
rm -rf ./.cache;
echo "Setting baseUrl to Amazon Cloudfront url https://lxp.optimizoryapps.com"
jq '.baseUrl = "https://lxp.optimizoryapps.com"' assets/original-atlassian-connect.json > assets/atlassian-connect.json

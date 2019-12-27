#!/bin/bash

echo "Removing old build directory and cache"
rm -rf ./dist;
rm -rf ./.cache;
echo "Setting baseUrl to Amazon Cloudfront url https://d1lo9kuasdt7aw.cloudfront.net"
jq '.baseUrl = "https://d1lo9kuasdt7aw.cloudfront.net"' assets/original-atlassian-connect.json > atlassian-connect.json

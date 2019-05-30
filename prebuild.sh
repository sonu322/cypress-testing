#!/bin/bash

echo "Removing old build directory"
rm -rf dist
echo "Setting baseUrl to Amazon Cloudfront url https://d1lo9kuasdt7aw.cloudfront.net"
jq '.baseUrl = "https://d1lo9kuasdt7aw.cloudfront.net"' assets/atlassian-connect.json > temporary-atlassian-connect.json
mv temporary-atlassian-connect.json assets/atlassian-connect.json

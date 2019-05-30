#!/bin/bash

echo "Removing old build directory"
rm -rf dist
jq '.baseUrl = "https://d1lo9kuasdt7aw.cloudfront.net"' assets/atlassian-connect.json > temporary-atlassian-connect.json
mv temporary-atlassian-connect.json assets/atlassian-connect.json

#set temp (mktemp); and jq '.baseUrl = "https://d1lo9kuasdt7aw.cloudfront.net"' assets/atlassian-connect.json > "$temp"; and mv "$temp" assets/atlassian-connect.json

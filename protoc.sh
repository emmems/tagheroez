#!/bin/bash

# Check if protoc is installed
if ! command -v protoc &> /dev/null
then
    echo "protoc could not be found"
    exit
fi

# Check if protoc-gen-es is installed
if ! command -v protoc-gen-es &> /dev/null
then
    echo "protoc-gen-es could not be found"
    exit
fi

# Remove old generated files
rm -rf ./src/api/gen
mkdir -p ./src/api/gen

# Generate protobuf files
protoc -I . --proto_path=./proto --es_out ./src/api/gen --es_opt target=ts --es_opt ts_nocheck=true --connect-query_out ./src/api/gen --connect-query_opt target=ts --connect-query_opt ts_nocheck=true ./proto/dashboard/v1/*.proto


# Remove unnecessary proto directory.
mv ./src/api/gen/**/* ./src/api/gen
rm -rf ./src/api/gen/proto

#!/bin/bash
set -x #echo on
docker build --tag rest-api . &&
docker image prune --filter label=stage=rest-api-stage1-docker-builder --force &&
docker image prune --filter label=stage=rest-api-stage2-docker-builder --force &&
docker image rm mhart/alpine-node:12 --force &&
docker image rm mhart/alpine-node:slim-12 --force

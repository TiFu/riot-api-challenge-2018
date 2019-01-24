# Development

## Prerequisites

1. Node and NPM installation

## Setup 

1. Run `scripts/install.sh` from the root directory
2. Run `scripts/build.sh` from the root directory. 

# Folder Structure

## client/client

This folder contains the electron client and all tools needed to build a Windows
executable. 

- `npm run watch` to run TypeScript in watch mode. 
- `npm run start` to start the electron client in development mode.
- `npm run package` to build a windows binary.

## client/lcu-aip

OpenAPI-Codegen generated `ts-node` API for the LCU. Just don't modify it.

## client/util

Contains utility scripts to rebuild the champ to skin map json file, which has to 
be copied to `client/client/src/assets/`


## common/

This directory contains packages which are used on both the server and the client.


## common/achievement-models

This package contains the definition of all achievements and additional functions
for calculating if the requirements of achievements were fulfilled.

## common/achievement-sio

This package contains the definition of our communication interface between
the frontend client and our backend. This interface is based on `Socket.io`
and uses a TypeScript npm package to provide complete type definitions for the
API.

## scripts/

This folder contains some useful scripts for setting up this project.

## server/achievement-config

This folder contains all basic server settings. Check out the `index.ts` file
to see which environment variables can be set to modify the server settings.

## server/achievement-db

This is the npm library which connects to our database and offers some convenience 
methods for doing so.

## server/achievement-redis

Same as achievement-db just for our redis backend.

## server/frontend

This contains the server which communicates with our frontend. 

## server/helper_scripts

This directory contains some small TypeScript scripts which populate the database
with sample values. 

## server/processing-server

This node server is responsible for processing games and calculating which achievements
were obtained by a player.

# Deployment

1. Point `./scripts/deploy.sh` to your server. 
2. Run `./scripts/deploy.sh`
3. `ssh` onto your server.
4. Modify `server/docker-compose.yml` (e.g. set the environment variables, API Keys) 
5. Run `docker-compose -f ./server/docker-compose.yml up -d`
# docker-registry-query

A read-only SQL-like interface for docker v2 registry

## Why

SQL-like query interfaces is still one of the easiest to understand and most used interface to query databases. We are still missing something like that for docker v2 registries. 

## How to use

There are two main interfaces: 

1. REST API. A simple endpoint called query that receives a SQL statement and returns a record set. 
2. Mysql Proxy. A proxy interface that uses the API endpoint from above to expose a mysql endpoint. Standard tools available for mysql can work with that endpoint seamelessly. 

## Install and setup

todo

## Technology

Few things we can say about the project:

1. Available as open source under the MIT license. 
2. Built with Node.JS, TypeScript, and OpenAPI.
3. Packaged as a container image and can ge deployed easily in a kubernetes or other docker envrionments. 

## Authentication to the Registry

The credentials to authenticate to the docker registry can be taken from either an env virable or config json file. If both are setup then the env variable wins. 

1. First option: Env variable called: "DOCKER_REGISTRY_CONFIG" contains json document with the configuration. 
1. Second option: Env variable called: "DOCKER_REGISTRY_CONFIG_FILE" points to the location of the configuration file. Default location is assumed "./docker-registry-config.json".
3. The implementation should support any docker regitry compliant with docekr registry api v2. 

## Config file for Docker Hub

The following example access docker hub.

~~~
{
    "type": "dockerV2",
    "endpoint": "https://hub.docker.com/v2",
    "username": {username},
    "password": {password}
}
~~~

## Sample SQL statements

~~~
SELECT * FROM namespaces
SELECT * FROM repos WHERE namespace = {namespace}
SELECT * FROM tags WHERE namespace = {namespace} AND repo = {repo}
~~~

# dockerQL

A read-only SQL-like interface for docker registries.

## Why

SQL-like query interfaces is still one of the easiest to understand and most used interface to query databases. We are still missing something like that for docker registries. 
In addition, each docker implementation is a bit different in terms of its authentication, scoping, and to some degreee its features. dockerQL provides a unified yet extendable way to access multiple types of registries. 

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

1. First option: Env variable called: "DOCKER_REGISTRIES" contains json document with the configuration. 
1. Second option: Env variable called: "DOCKER_REGISTRIES_FILE" points to the location of the configuration file. Default location is assumed "./registries.json".
3. The implementation should support any docker regitry compliant with docekr registry api v2. 

## Config file for Docker Hub

The following example access docker hub.

~~~
{
  "Registries": [
    {
      "name": {displayname},
      "type": "dockerhub",
      "namespace": {organization},
      "username": {username},
      "password": {password}
    }
  ]
}
~~~

## GCP

{
  "Registries": [
    {
      "name": {displayname},
      "type": "gcr",
      "host": {host},
      "jsonkey": {jsonkey}
    }
  ]
}
~~~
where {hostname} is gcr.io, us.gcr.io, eu.gcr.io, or asia.gcr.io.
and   {jsonkey} is a gcp service account with permissions Project Browser, Storage Object Viewer on the GCS bucket for the container registry (bucket name: artifacts.<your-project>.appspot.com).

## Available SQL statements

~~~
SELECT * FROM namespaces
SELECT * FROM repos WHERE namespace = {namespace}
SELECT * FROM tags WHERE namespace = {namespace} AND repo = {repo}
SELECT * FROM whoami
~~~

# dockerQL

A read-only SQL-like interface for docker registries.

## Why

SQL-like query interfaces is still one of the easiest to understand and most used interface to query databases. We are still missing something like that for docker registries. 
In addition, each docker implementation is a bit different in terms of its authentication, scoping, and to some degreee its features. dockerQL provides a unified yet extendable way to access multiple types of registries. 

## Supported SQL statements

~~~
SELECT * FROM registries
SELECT * FROM repos WHERE registry = {registry}
SELECT * FROM tags WHERE registry = {registry} AND repo = {repo}
~~~

## Other docs 

* [API Docs](https://github.com/simplyCoders/dockerQL/blob/main/openapi.html)
* [Table schema](https://github.com/simplyCoders/dockerQL/blob/main/schema.html)

## How to use

There are two main interfaces: 

1. REST API. A simple endpoint called query that receives a SQL statement and returns a record set. 
2. Mysql Proxy. A proxy interface that uses the API endpoint from above to expose a mysql endpoint. Standard tools available for mysql can work with that endpoint seamelessly. 

## Install and setup

todo

## Technology

Few things we can say about the project:

1. Available as open source under the MIT license. 
2. Built with Node.JS, TypeScript, OpenAPI, and multiple OSS packages that makes development life better.
3. Packaged as a container image and can ge deployed easily in a kubernetes or other docker envrionments. 

## Authentication to dockerQL

dockerQL is a read-only service that is open for annonymous user. There is no native support for authentication to the service. 
The assumption is that the dockerQL is started in a "safe" place, security is handled by your choice of tools before readhing the service.  

## Authentication to Registires

dockerQL leverage behind the scenes various apis to connect and interact with docker registries. The credentials to authenticate to these docker registries are defined either in an env virable or in a config json file. If both are setup then the env variable wins. 

1. First option: Env variable called: "DOCKER_REGISTRIES" contains json document with the configuration. 
1. Second option: Env variable called: "DOCKER_REGISTRIES_FILE" points to the location of the configuration file. Default location is assumed "./registries.json".

## Config file for Docker Hub

The following example access docker hub.

~~~
{
  "Registries": [
    {
      "name": {displayname},
      "type": "dockerhub",
      "namespace": {namespace},
      "username": {username},
      "password": {password}
    }
  ]
}
~~~

### Paranmeters:

{name} is an arbitrary name you choose to represent the registry. The name must be unique in the config file. 
{namespcae} is sometime called "organization", either the user name, or a name of one of the organizations in dockerhub the user is a memeber of. 

## Config file for Google Container Registry (GCR)

~~~
{
  "Registries": [
    {
      "name": {name},
      "type": "gcr",
      "namespace": {namespace},
      "jsonkey": {jsonkey}
    }
  ]
}
~~~

### Paranmeters:

{name} is an arbitrary name you choose to represent the registry. The name must be unique in the config file. 
{namespcae} is sometimes called "hostname" by the GCR docs. It must be one of gcr.io, us.gcr.io, eu.gcr.io, or asia.gcr.io.
{jsonkey} is a gcp service account with permissions Project Browser, Storage Object Viewer on the GCS bucket for the container registry (bucket name: artifacts.<your-project>.appspot.com).

## Sketchbook

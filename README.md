# dockerql

A read-only SQL-like interface for docker registries.
Currently this project is under development and is ready for experienmentation usage only.

## Why

SQL-like query interfaces is still one of the easiest to understand and most used interface to query databases. We are still missing something like that for docker registries. 
In addition, each docker implementation is a bit different in terms of its authentication, scoping, and to some degreee its features. dockerql provides a unified yet extendable way to access multiple types of registries. 

## Supported SQL statements

~~~
SELECT * FROM registries
SELECT * FROM repos WHERE registry = {registry}
SELECT * FROM tags WHERE registry = {registry} AND repo = {repo}
~~~

# Set up

## Define your .registry.json file
The list of registries is defined in a .registry.json file. 

### Config file for Docker Hub

The following example access docker hub.

~~~
{
  "default-registry": {registryName},
  "registries": [
    {
      "name": {displayname},
      "type": "dockerhub",
      "default-namespace": {namespace},
      "username": {username},
      "password": {password}
    }
  ]
}
~~~

* Paranmeters:

{name} is an arbitrary name you choose to represent the registry. The name must be unique in the config file. 
{namespcae} is sometime called "organization", either the user name, or a name of one of the organizations in dockerhub the user is a memeber of. 

### Config file for Google Container Registry (GCR)

~~~
{
  "default-registry": {registryName},
  "registries": [
    {
      "name": {name},
      "type": "gcr",
      "default-namespace": {namespace},
      "jsonkey": {jsonkey}
    }
  ]
}
~~~

* Paranmeters:

{name} is an arbitrary name you choose to represent the registry. The name must be unique in the config file. 
{namespcae} is sometimes called "hostname" by the GCR docs. It must be one of gcr.io, us.gcr.io, eu.gcr.io, or asia.gcr.io.
{jsonkey} is a gcp service account with permissions Project Browser, Storage Object Viewer on the GCS bucket for the container registry (bucket name: artifacts.<your-project>.appspot.com).

## Running inside Kubernetes

1. Define a secret with the registry credentials
~~~
kubectl create secret dockerdl-registry "$(cat ~/.registry.json)" 
~~~

2. Define a kub pod for dockerql


## Technology

Few things we can say about the project:

1. Available as open source under the MIT license. 
2. Built with Node.JS, TypeScript, OpenAPI, and multiple OSS packages that makes development life better.
3. Packaged as a container image and can ge deployed easily in a kubernetes or other docker envrionments. 

## Authentication to dockerql

dockerql is a read-only service that is open for annonymous user. There is no native support for authentication to the service. 
The assumption is that the dockerql is started in a "safe" place, security is handled by your choice of tools before readhing the service.  

## Authentication to Registires

dockerql leverage behind the scenes various apis to connect and interact with docker registries. The credentials to authenticate to these docker registries are defined either in an env virable or in a config json file. If both are setup then the env variable wins. 

1. First option: Env variable called: "DOCKER_REGISTRIES" contains json document with the configuration. 
1. Second option: Env variable called: "DOCKER_REGISTRIES_FILE" points to the location of the configuration file. Default location is assumed "./.registries.json".
1. If none provided then a default list of registries will be used, providing annonymous access to dockerhub to the docker organization.

## Sketchbook

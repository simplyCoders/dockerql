# dockerql

> :warning: **The project is under active development**: Be careful how you use it at this time.  

A read-only SQL-like interface for docker registries.

## Why

SQL-like query interfaces is still one of the easiest to understand interface to query databases. We are still missing something like that for docker registries. 
In addition, each docker implementation is a bit different in terms of its authentication, scoping, and features. dockerql provides a unified yet extendable way to access multiple types of registries. 

## Getting started

The simplest way to get started with a test dockerql is via npm. Follow these steps:
1. Create a new folder and cd to it.

~~~bash
mkdir dockerql-test; cd dockerql-test
~~~

2. Get the package from npm.

~~~bash
npm i dockerql
~~~

3. Run the service locally.

~~~bash
cd ./node_modules/dockerql/;npm install;npm start
~~~~

4. The service should be running and you should be able to see the following.

![terminal](https://raw.githubusercontent.com/simplyCoders/dockerql/main/terminal.png)

5. Click on the link below to run your first query in the browser.
[http://localhost:8080/v1/query?query=select * from repos where namespace="alpine"](http://localhost:8080/v1/query?query=select * from repos where namespace="alpine")


6. Congrats! Assuming all went well then you have a running instance of dockerql.
![browser](https://raw.githubusercontent.com/simplyCoders/dockerql/main/browser.png)

## Supported registry types

Currently supported: 
1. Dockerhub
1. Google Container Registry (GCR)

## Supported SQL statements

Example SQL supported queries:

~~~sql
SELECT * FROM registries
SELECT * FROM namespaces WHERE registry = {registry}
SELECT * FROM repos WHERE registry = {registry} 
SELECT * FROM images WHERE registry = {registry} AND repo = {repo}
~~~

## Access to public repos/images

dockerql supports access to public repos for both dockerhub and gcr. We do that by providing namespace value in the WHERE clause. 

Here are simple examples:

* Find the repos under alpine in dockerhub
~~~sql
SELECT * FROM repos WHERE registry = "my-dockerhub" AND namespace = "alpine"
~~~

* Find the repos under distroless in gcr
~~~sql
SELECT * FROM repos WHERE registry = "my-gcr" AND namespace = "distroless"
~~~

## Authentication to dockerql

dockerql is a read-only service that is open for any user with access to the service. There is no native support for authentication to the service. 
The assumption is that the dockerql is started in a "safe" place, security is handled by your choice of tools before reaching the docekrql service.  

## Getting started for real
Few steps to get dockerql up and running: 

1. Configure access to your registries.  
1. Select a method to run dockerql as a local server from npmjs, as a standalone docker container, or as kubernetes pod. Still under development. 
1. Try the query api.

## Configure access to your registries

Credentials are configured in JSON format and passed to dockerql via an environment variable or via a config file. If both are setup then the environment variable wins. 

1. Env variable called: "DOCKER_REGISTRIES" contains json document with the configuration. 
1. if not set then using env variable called: "DOCKER_REGISTRIES_FILE" that points to the location of the configuration file. 
1. If not set then try a default location for the configuration file at "./.registries.json".
1. If file not found then used a built in default that set up access to dockerhub with no credentials.

## The JSON format is as follows: 
~~~json
{
    "default-registry": {{default}},
    "registries": []
}
~~~

* {{default}} - a default registry to be used if WHERE clause does not include a registry name.
* The registries area includes the access definition for each registry and it is dependent on the registry type.

## Configure access to Docker Hub

The following example access docker hub.

~~~json
{
  "default-registry": {registryName},
  "registries": [
    {
      "name": {registryName},
      "type": "dockerhub",
      "namespace": {namespace},
      "username": {username},
      "password": {password}
    }
  ]
}
~~~

* {registryName} is an arbitrary name you choose to represent the registry. The name must be unique in the config file. 
* {namespace} optional parameter. Mapped to dockerhub "organization". 

## Configure access to Google Container Registry (GCR)

~~~json
{
  "default-registry": {registryName},
  "registries": [
    {
      "name": {registryName},
      "type": "gcr",
      "namespace": {namespace},
      "username": "_json_key",
      "password": {jsonkey}
    }
  ]
}
~~~

* {registryName} is an arbitrary name you choose to represent the registry. The name must be unique in the config file. 
* {namespace} optional parameter. Mapped to gcr project-id.
* {jsonkey} is a gcp service account with permissions Project Browser, Storage Object Viewer on the GCS bucket for the container registry (bucket name: artifacts.<your-project>.appspot.com).

## Technology

Few things we can say about the project:

1. Available as open source under the MIT license. 
2. Built with Node.JS, TypeScript, OpenAPI, and multiple OSS packages that makes development life better.
3. Packaged in multiple form factors, including a docker image. 

## Parking area
~~~
    "build:docs": "./node_modules/redoc-cli/index.js bundle ./openapi.json -o ./openapi.html;./node_modules/redoc-cli/index.js bundle ./schema.json -o ./schema.html",
~~~

4. Running inside Kubernetes (TODO)

1. Define a secret with the registry credentials
~~~
kubectl create secret dockerdl-registry "$(cat ~/.registry.json)" 
~~~

2. Define a kube pod for dockerql

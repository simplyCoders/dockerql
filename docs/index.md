A read-only SQL-like interface for docker registries.

**The project is under active development**: Be careful how you use it at this time.

## Why

SQL-like query interfaces is still one of the easiest to understand interface to query databases. We are still missing something like that for docker registries. 
In addition, each docker implementation is a bit different in terms of its authentication, scoping, and features. dockerql provides a unified yet extendable way to access multiple types of registries. 

## Getting started

Getting started is easy and should take seconds. 

Choose your way to get started:

1. Run dockerql as a [docker container](./run-dockerql-as-container).
2. Run dockerql as a [local service](./run-dockerql-as-local-server).
3. Set up [access to your registries](./set-up-access-to-registries).

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
SELECT * FROM repos WHERE namespace = "alpine" AND registry = "my-dockerhub"
~~~

* Find the images under simplycoders/dockerql in dockerhub

~~~sql
SELECT * FROM repos WHERE repo="dockerql" AND namespace="simplycoders" AND registry = "my-dockerhub"
~~~

* Find the repos under distroless in gcr

~~~sql
SELECT * FROM repos WHERE namespace = "distroless" AND registry = "my-gcr"
~~~

## Authentication to dockerql

dockerql is a read-only service that is open for any user with access to the service. There is no native support for authentication to the service. 
The assumption is that the dockerql is started in a "safe" place, security is handled by your choice of tools before reaching the docekrql service.  

## Technology

Few things we can say about the project:

1. Available as open source under the MIT license. 
2. Built with Node.JS, TypeScript, OpenAPI, and multiple OSS packages that makes development life better.
3. Packaged in multiple form factors, including a docker image. 

## Next steps

* Visit the dockerql [project page](https://github.com/simplyCoders/dockerql).


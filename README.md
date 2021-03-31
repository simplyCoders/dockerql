# dockerql [![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![npm version](https://img.shields.io/npm/v/dockerql.svg?style=flat)](https://www.npmjs.com/package/dockerql) [![Run example](https://img.shields.io/static/v1?label=repl.it&message=run%20example&color=blue)](https://replit.com/join/fdsekomb-ezborgy)

A SQL-like interface for docker registries.

> **Early stage project**

## Why

SQL-like query interface is still one of the easiest to understand methods to query any collection of data. Dockerql brings this familiar interface to the docker registry world. 

## What

Dockerql provides a read-only SQL query interface to docker registries. 

Ket features:

* Supports DockerHub, Amazon Container Registry, and Google Container Registry. 
* Handle in a uniform way the various authentication flow for each docker registry implementation. 
* Developed in JavaScript. 
* NPM Package: Available for use within any node application. 
* Local Service: Clone from gihub and run as a local service.
* DockerHub: Available from DockerHub as a prepackaged docker image. 


## Getting started - Node.js

* Install dockerql:
~~~
npm install -i dockerql --save
~~~

* Use dockerql:
~~~typescript
import * as dockerql from 'dockerql'
...

    try {
        // setup the dockerql option, for now this means loglevel
        dockerql.init()

        // connect to a registry, in this case dockerhub with anonymous access
        await dockerql.connect({ name: "dockerhub", type: "dockerhub" })

        // select the list of repos
        const rsp = await dockerql.query(`SELECT repo, stars, pulls FROM repos`)
        
        // catch errors
        if (rsp.code !== 200) {
            console.error(rsp.message)
            return
        }

        ...
    } catch (err) {
        console.log("Error ", err)
    }
    ...
~~~

See the full [simple example](https://github.com/simplyCoders/dockerql/tree/main/examples/simple),
or try it in [replit](https://replit.com/@ezborgy/dockerql-example#index.js).

## Getting started - Service

dockerql can be run as a standalone service exposing a query endpoint as well as an npm package. 

Here are few different ways to quickly get started with running dockerql as a service. 

1. Run as a [docker container](https://simplycoders.github.io/dockerql/run-dockerql-as-container).
1. Run as a [local service](https://simplycoders.github.io/dockerql/run-dockerql-as-local-server).
1. Set up the service [access to your registries](https://simplycoders.github.io/dockerql/set-up-access-to-registries).

## Supported registry types

Currently supported: 

1. Set up access to [Dockerhub](https://simplycoders.github.io/dockerql/set-up-dockerhub)
1. Set up access to [Amazon Elastic Container Registry](https://simplycoders.github.io/dockerql/set-up-ecr) (ECR)
1. Set up access to [Google Container Registry](https://simplycoders.github.io/dockerql/set-up-gcr) (GCR)

## Documentation 

* docekrql [docs](https://simplycoders.github.io/dockerql/).

## Folder structure

```
dockerQL
|
└─ examples
|  └─ simple
| 
└─ lib # packaging of dockerQL as an npm package
| 
└─ server # api server servicing dockerql via REST api  
```
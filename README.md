# dockerql

A read-only SQL-like interface for docker registries.

> **Early stage project**

## Why

SQL-like query interfaces is still one of the easiest to understand interface to query databases. We are still missing something like that for docker registries. 
In addition, each docker registry implementation is a bit different in terms of its authentication, scoping, and custom fields. dockerql provides a unified yet extendable way to access multiple types of registries. 

## Getting started with dockerql as a package

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

See the full [simple example](https://github.com/simplyCoders/dockerql/examples/simple),
or try it in [replit](https://replit.com/@ezborgy/dockerql-example#index.js).

## Getting started with prepackage dockerql as a service

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

dockerQL
|
└─ examples
|  └─ simple
| 
└─ lib # packaging of dockerQL as an npm package
| 
└─ server # api server servicing dockerql via REST api  
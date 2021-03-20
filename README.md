# dockerql

A read-only SQL-like interface for docker registries.

> **Early stage project**

## Why

SQL-like query interfaces is still one of the easiest to understand interface to query databases. We are still missing something like that for docker registries. 
In addition, each docker implementation is a bit different in terms of its authentication, scoping, and features. dockerql provides a unified yet extendable way to access multiple types of registries. 

## Getting started

Getting started is easy and should take seconds. 

Choose your way to get started:

1. Getting started with [docker container](https://simplycoders.github.io/dockerql/run-dockerql-as-container).
1. Getting started with [local service](https://simplycoders.github.io/dockerql/run-dockerql-as-local-server).
1. Set up [access to your registries](https://simplycoders.github.io/dockerql/set-up-access-to-registries).

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
└─ server # api server servicing dockerQL via REST api  
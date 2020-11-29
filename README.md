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

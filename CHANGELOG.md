# CHANGELOG

## 0.1.3 (March-28-2021)
* Stabilization release. 

## 0.1.0 (March-15-2021)
* A complete refactor of the package organization. Creating a new lib and server separate projects. 
* Change default conf file to `/var/dockerql/config.json`.
* Change optional env variable from "DOCKER_REGISTRIES" to "DOCKERQL_CONF".
* Change optional env variable from "DOCKER_REGISTRIES_FILE" to "DOCKERQL_FILE".
* Updated error handling. 
* Updated unit test framwork.

## 0.0.13 (Feb-4-2021)
* Package dockerql as a library and move the server file to a sub folder. 

## 0.0.12 (Jan-24-2021)
* Change tag field to tags. In ECR and GCR return the array of tags, in Dockerhub, return an array of a single entry. 
* Add registry specific columns:
1. Dockerhub: repos added stars and pulls.
1. Dockerhub: images added architecture and os.
1. ECR: repos added arn, uri, scanOnPush, imageImmutability, and created.

## 0.0.11 (Jan-16-2021)
* Update base image to node-15.5.1-slim. 
* Build a first set of tests
* Change query parameter to be sql (was previousely query)

## 0.0.10 (Jan-10-2021)
* Verify support for public repos in dockerhub and gcr. 
* Update documentation to highlight specific SQL statement to access public repos. 

## 0.0.7 (Jan-2-2021)

* Happy New Year!
* Add support for ECR.

## 0.0.6 (Dec-26-2020)

* Better project organization with RegistryType as a class. 
* Handling of more complex SELECT statements by using alasql to process the resultset post initial query.


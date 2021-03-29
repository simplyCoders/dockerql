# Set up access to your docker registries

Access to your registries is configured via a JSON document that is passed to dockerql via an environment variable or via a config file. If both are setup then the environment variable wins. 

1. Env variable called: ```DOCKERQL_CONF``` contains json document with the configuration. 
2. If not set then using env variable called: ```DOCKERQL_FILE``` that points to the location of the configuration file. 
3. If not set then try a default location for the configuration file at ```./.dockerql.json```.
4. If file not found then used a built in default that set up access to dockerhub with no credentials.

## The JSON format is as follows
~~~json
{
    "registries": []
}
~~~

* {default} - a default registry to be used if WHERE clause does not include a registry name.
* The registries area includes the access definition for each registry and it is dependent on the registry type.

## Supported registry types

Currently supported: 

* Set up access to [Dockerhub](./set-up-dockerhub)
* Set up access to [Amazon Elastic Container Registry](./set-up-ecr) (ECR)
* Set up access to [Google Container Registry](./set-up-gcr) (GCR)

## Next steps

* Visit the dockerql [docs](./).
* Visit the dockerql [project page](https://github.com/simplyCoders/dockerql).


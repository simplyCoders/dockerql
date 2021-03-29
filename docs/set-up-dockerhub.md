# Set up access to Dockerhub

1. Set env variable to point to config file (default `/var/dockerql/config.json`)

2. Edit your [`/var/dockerql/config.json`](./set-up-access-to-registries) file and add an entry for an instance of dockerhub: 

~~~json
{
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

## Examples

For simplicity let's assume `{registryName}` is set to `my-registry`.

#### Find repos in my organization

To get the list of repos under one of my organizations called `my-org` we will use the following.

~~~sql
SELECT * FROM repos WHERE namespace = "my-org" AND registry="my-registry"
~~~

#### Find repos in public organization

These days, many vendors and OSS projects distribute their software as container images under their organization. We can easily use dockerql to find the list of repos under these organizations.  
For example, if we wanted to get a list of all the repos under the [elastic](https://hub.docker.com/u/elastic) organization, we would use the following. 

~~~sql
SELECT * FROM repos WHERE namespace = "elastic" AND registry="my-registry"
~~~

#### Find repos in the list of "Official Images"

Dockerhub maintains a list of [Official Images](https://docs.docker.com/docker-hub/official_images/). These are popular base images such as common linux distros. 
Behind the scenes these images are listed under a special organization called "library". 

To get the list of repos under the list of "Official Images" let's use the following. 

~~~sql
SELECT * FROM repos WHERE namespace = "library" AND registry="my-registry"
~~~

## Next steps

* Set up access to [Amazon Elastic Container Registry](./set-up-ecr) (ECR)
* Set up access to [Google Container Registry](./set-up-gcr) (GCR)
* Visit the dockerql [docs](./).
* Visit the dockerql [project page](https://github.com/simplyCoders/dockerql).

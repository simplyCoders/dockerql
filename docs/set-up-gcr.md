# Set up access to Google Container Registry (GCR)

1. Set env variable to point to config file (default `/var/dockerql/config.json`)

2. Edit your [`/var/dockerql/config.json`](./set-up-access-to-registries) file and add an entry for an instance of dockerhub: 

~~~json
{
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

## Examples

For simplicity let's assume `{registryName}` is set to `my-registry`.

#### Find repos in my project-id

To get the list of repos under one of my projects named `my-project-id` we will use the following.

~~~sql
SELECT * FROM repos WHERE namespace = "my-project-id" AND registry="my-registry"
~~~

#### Find repos in a google's list of public-containers

Google maintaines a list of [public containers](https://console.cloud.google.com/gcr/images/google-containers) for many OSS projects, these images can be used as base images in many projects. We can easily use dockerql to find the list of repos available in that list.

~~~sql
SELECT * FROM repos WHERE namespace = "google-containers" AND registry="my-registry"
~~~

#### Find repos in a google's list of distroless

Google also maintaines a list of [distroless](https://console.cloud.google.com/gcr/images/distroless) images, these images can also be used as base images in many projects. We can easily use dockerql to find the list of repos available in that list.

~~~sql
SELECT * FROM repos WHERE namespace = "distroless" AND registry="my-registry"
~~~

## Next steps

* Set up access to [Dockerhub](./set-up-dockerhub)
* Set up access to [Amazon Elastic Container Registry](./set-up-ecr) (ECR)
* Visit the dockerql [docs](./).
* Visit the dockerql [project page](https://github.com/simplyCoders/dockerql).

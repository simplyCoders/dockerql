# Set up access to Google Container Registry (GCR)

Edit your [```.registry.json```](./set-up-access-to-registries) file and add an entry for an instance of GCR: 

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

## Next steps

* Visit the dockerql [docs](./).
* Visit the dockerql [project page](https://github.com/simplyCoders/dockerql).

# Set up access to Amazon Elastic Container Registry (ECR)

Edit your [```.registry.json```](./set-up-access-to-registries) file and add an entry for an instance of ECR: 

~~~json
{
  "default-registry": {registryName},
  "registries": [
    {
      "name": {registryName},
      "type": "ecr",
      "namespace": {namespace},
      "username": {apikKey},
      "password": {apiSecret}
    }
  ]
}
~~~

* {registryName} is an arbitrary name you choose to represent the registry. The name must be unique in the config file. 
* {namespace} optional parameter. Mapped to ecr region. Default value is set of us-east-1.
* {apiKey} is a AWS api key to be used for authentication. The api key should be only given read permissions to the registry. 
* {apiSecret} is the AWS api secret assigned to this user.

## Examples

For simplicity let's assume that the default registry in the ```.registry.json``` file is ecr. If this is not the case, for all of the examples below the WHERE clause will need to include a condition like  ```AND registry="my-ecr-registry```.  

#### Find repos in a specific region

To get the list of repos in ```us-east-1``` we will use the following.

~~~sql
SELECT * FROM repos WHERE namespace = "us-east-1"
~~~

## Next steps

* Set up access to [Dockerhub](./set-up-dockerhub)
* Set up access to [Google Container Registry](./set-up-gcr) (GCR)
* Visit the dockerql [docs](./).
* Visit the dockerql [project page](https://github.com/simplyCoders/dockerql).

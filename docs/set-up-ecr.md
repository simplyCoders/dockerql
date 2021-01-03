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

## Next steps

* Visit the dockerql [docs](./).
* Visit the dockerql [project page](https://github.com/simplyCoders/dockerql).

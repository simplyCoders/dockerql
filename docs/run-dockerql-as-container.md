# Running dockerql as a docker container

A simple way to get started is using a docker container running dockerql. 

Follow these steps.

1. Get the image.

~~~bash
docker pull simplycoders/dockerql
~~~

2. Start the container.

~~~bash
docker run -p 8080:8080 simplycoders/dockerql
~~~

![terminal](./terminal.png)

3. Test that it works by running your first query from the browser.

* List of repos under the alpine organization 
~~~
http://localhost:8080/v1/query?query=SELECT * FROM repos WHERE namespace="alpine"
~~~

* List of images under the simplycoders/dockerql repo:
~~~
http://localhost:8080/v1/query?query=SELECT * FROM images WHERE namespace="simplycoders" AND repo="dockerql"
~~~

4. Congrats! Assuming all went well then you have a running instance of dockerql.

## Next steps

* Read how to [Configure access to your registries](./configure-access-to-registries).
* Visit the [dockerql](https://github.com/simplyCoders/dockerql) github project and start to experiment.

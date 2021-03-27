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
http://localhost:8080/v1/query?sql=SELECT * FROM repos WHERE namespace="alpine"
~~~

* List of images under the simplycoders/dockerql repo:
~~~
http://localhost:8080/v1/query?sql=SELECT * FROM images WHERE namespace="simplycoders" AND repo="dockerql"
~~~

4. Congrats! Assuming all went well then you have a running instance of dockerql.

## Optionally

If you have defined a configuration file under the host os at `~/.dockerql/config.json`
The to run dockerql with that configuration use the following:

~~~
docker run -p 8080:8080 -v ~/.dockerql:/usr/server/.dockerql -d simplycoders/dockerql
~~~

## Next steps

* How-to [set up access to your registries](./set-up-access-to-registries).
* Visit the dockerql [docs](./).
* Visit the dockerql [project page](https://github.com/simplyCoders/dockerql).


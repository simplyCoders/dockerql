# Running dockerql as a local server

A simple way to get started is using a docker container running dockerql. 

Follow these steps.

1. cd to a location where you want to deploy dockerql. 

2. Clone from github.

~~~bash
git clone https://github.com/simplyCoders/dockerql.git
~~~

3. Build lib locally.

~~~bash
cd dockerql/lib/&&npm run build:clean
~~~

4. Build the service locally.

~~~bash
cd ../server/&&npm run build:clean
~~~

5. Run the service.

~~~bash
npm start
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

## Next steps

* How-to [set up access to your registries](./set-up-access-to-registries).
* Visit the dockerql [docs](./).
* Visit the dockerql [project page](https://github.com/simplyCoders/dockerql).

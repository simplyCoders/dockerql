# Running dockerql as a local server

A simple way to get started is using a docker container running dockerql. 

Follow these steps.

1. Create a new folder and cd to it.

~~~bash
mkdir dockerql-test;cd dockerql-test
~~~

2. Clone from github.

~~~bash
git clone https://github.com/simplyCoders/dockerql.git
~~~

3. Run the service locally.

~~~bash
cd ./server/&&npm install&&npm run build&&npm run start:anonymous
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

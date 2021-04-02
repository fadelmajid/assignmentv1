Assignment API Framework
==============

Setup
------------
1. make sure you've install docker
2. in this directory, type command: `docker-compose up` or `docker-compose up -d` to initiate Database
3. in this directory, you can open new terminal and type `npm start`
4. hit http://localhost:3000

POSTMAN Collection and Environment
------------
available on folder postman, you can import all the file to postman. (examples of inputs and outputs are available)

LOGS
------------
containing information of application and cron (when cron activated)

Error Code and Definition
------------
available on folder app/lang in file en.json

DOCUMENTATION
------------
available on file Assigment API.odt

TESTING
-----------
available automation testing with mochajs & chaijs just for the library. if you already run "npm start", you can run
the test by "npm test" on folder test in different terminal
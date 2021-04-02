Assignment API Framework
==============

Setup
------------
1. cp .env.example .env
2. cp config/config.example.json config/config.json
3. update file according to your local configuration
4. please use node v10.9.0 or above
5. npm install
6. npm install -g sequelize-cli
7. npm install -g eslint
8. sequelize db:migrate (before migrate, please make sure there is a scheme with the same name in postgres. in this example the assignment schema)
9. sequelize db:seed:all to seed some data
9. npm start
10. hit http://localhost:3000

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
available automation testing with mochajs & chaijs just for the library. if you already run "node index.js", you can run
the test by "npm test" on folder test in different terminal
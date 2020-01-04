Assignment API Framework
==============

Setup
------------
1. cp .env.example .env
2. cp config/config.example.json config/config.json
3. update file according to your local configuration
4. please use node v10.9.0
5. npm install
6. npm install -g sequelize-cli
7. npm install -g eslint
8. sequelize db:migrate (before migrate, please make sure there is a scheme with the same name in postgres. in this example the assignment schema)
9. npm start
10. hit http://localhost:8585

PM2 Setup
------------
1. npm install -g pm2
2. pm2 install pm2-intercom
3. pm2 start ecosystem.config.js

POSTMAN Collection and Environment
------------
available on folder postman, you can import all the file to postman. (examples of inputs and outputs are available)

CRON - (to delete user data that has changed status, is deleted = true for 3 days)
------------
1. cd cronjob
2. node cron_delete.js / pm2 cron_delete.js

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
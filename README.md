# Northcoders News API

To run this project locally, you must undergo the following steps:
npm install
npm install pg
npm install dotenv

As the database names are hidden, you must create your own databases and link them to the seed file by using .env file(s) - one for the test data and one for the development data. In the .env file, you will need to include PGDATABASE="NAME_OF_DATABASE".
The names for each test and development database can be found in be-nc-news/db/setup.sql
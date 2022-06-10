# SmartU teacher's dashboard - Master thesis

## Requirements:

Node/Docker

## Running developer environment:

### 1. Without dockerized frontend/rest-api

_Starting database_:

```
cd database
docker-compose up
```

_Starting REST-API_:

```
cd server
npm install
npm start
```

_Starting React client_:

```
cd client
npm install
npm start
```

### 2. With Docker

```
docker-compose up
```

For both variations, the database needs to be initialized on first time start-up: go to [phpMyAdmin](localhost:8081) (localhost:8081). Use default credentials for login, username: root, password: password.
First run the `create_tables.sql` script, then run `insert_data.sql`.

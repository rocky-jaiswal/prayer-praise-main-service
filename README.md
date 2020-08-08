# prayer-praise-main-service

HapiJS + ReactJS app for Berlin Church to share prayers and praise cards with the whole church

## Local setup requirements

- NodeJS (12 LTS)
- Yarn (node package manager)
- docker
- docker-compose
- Make sure PostgreSQL is not running locally otherwise there may be a port conflict with the DB started by the docker setup

## To run locally

1. Checkout the [https://github.com/rocky-jaiswal/prayer-praise-main-service](https://github.com/rocky-jaiswal/prayer-praise-main-service) and [https://github.com/rocky-jaiswal/prayer-praise-web](https://github.com/rocky-jaiswal/prayer-praise-web) projects since they are deployed individually.
2. Run `yarn install` inside web and api projects to make sure you have npm and yarn setup correctly (_techinally optional, just docker-compose should be enough to get this project running)._
3. **For the first time setup do - `docker-compose up --build` after that you do not need the '--build' flag**
4. DB migrations can be done with - `docker-compose exec main-api npm run migrate-latest`
5. DB can be seeded with some data using - `docker-compose exec main-api npm run seed-data`
6. Run `yarn start` in web project to start it separately
7. Run tests with `docker-compose exec main-api yarn test`, since the test DB also runs inside docker / docker-compose, please run _docker-compose up_ command before running the tests.

## Notes

- The application runs as a ReactJS (+ TypeScript) web application, with a NodeJS (HapiJS) REST API backend. The data is persisted in PostgreSQL / SQLite RDBMS.
- The React web application is written in TypeScript for some type safety and the backend is pure NodeJS 12.x.x (for native async await support).

## Important

- The application uses Auth0 for user login, the Auth0 token is not checked into the git repo, please create your own Auth0 client for testing / local installation (it's very simple)
- Copy and change the .env.sample file to `.env` and update the values for Auth0 there

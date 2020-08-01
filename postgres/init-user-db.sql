CREATE ROLE postgresdev WITH LOGIN PASSWORD 'postgresdev';

CREATE DATABASE prayer_praise_app_dev;
CREATE DATABASE prayer_praise_app_test;

GRANT ALL PRIVILEGES ON DATABASE prayer_praise_app_dev TO postgresdev;
GRANT ALL PRIVILEGES ON DATABASE prayer_praise_app_test TO postgresdev;
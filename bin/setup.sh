set -e

cp .env.example .env

docker-compose down

echo setting up kafka

docker compose up -d zookeeper kafka

echo setting up client databases

docker compose up -d client-database

sleep 5

docker exec -t client-database createdb -U client client_unittest

echo setting up client service

docker compose up -d --build client-service

echo setting up transaction databases

docker compose up -d transaction-database

sleep 5

docker exec -t transaction-database createdb -U transaction transaction_unittest

echo setting up transaction service

docker compose up -d --build transaction-service

echo waiting for kafka to be ready...

sleep 7

echo done!
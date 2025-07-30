set -e

cd ..

cp .env.example .env

docker-compose down

docker compose up -d zookeeper kafka

docker compose up -d transaction-database

sleep 5

docker exec -t transaction-database createdb -U transaction transaction_unittest

docker compose up -d --build transaction-service

echo waiting for kafka to be ready...

sleep 7

echo done!
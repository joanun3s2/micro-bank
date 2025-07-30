set -e

cd ..

cp .env.example .env

docker compose up -d zookeeper kafka

docker compose up -d client-database

sleep 5

docker exec -t client-database createdb -U client client_unittest

docker compose up -d --build client-service

echo waiting for kafka to be ready...

sleep 7

echo done!
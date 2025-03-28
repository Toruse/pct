docker-up: memory
	docker-compose up -d

docker-down:
	docker-compose down

docker-build: memory
	docker-compose up --build -d

node-install:
	docker-compose exec node npm install

node-build:
	docker-compose exec node npm run build

node-dev:
	docker-compose exec node npm run dev

node-watch:
	docker-compose exec node npm run preview
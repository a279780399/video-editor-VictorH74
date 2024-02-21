run:
	docker-compose up -d --build
	wslview http://localhost:3000/
	docker-compose logs -f


restart: 
	docker compose -f "docker-compose.yml" down
	docker compose -f "docker-compose.yml" up -d --build
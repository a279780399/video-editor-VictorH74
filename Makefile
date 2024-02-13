run:
	docker-compose up -d --build
	wslview http://localhost:3000/
	docker-compose logs -f

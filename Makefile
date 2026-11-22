.PHONY: dev up down logs restart test clean

dev: up
	cd apps/desktop && ([ -d node_modules ] || npm install) && npm run dev

up:
	docker compose up -d --build --wait

down:
	docker compose down

logs:
	docker compose logs -f backend analyzer

restart:
	docker compose restart backend analyzer

test:
	cd apps/backend && ./mvnw -q clean verify
	cd apps/analyzer && ./mvnw -q clean verify

clean:
	docker compose down -v

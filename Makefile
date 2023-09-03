# Makefile for managing Docker and DB migrations

# Default action is to start the Docker Compose services
default: up

# Start Docker Compose services
up:
	docker compose up -d

# Stop Docker Compose services
down:
	docker compose down

# Restart Docker Compose services
restart: down up

# Build Docker Compose services
build:
	docker compose build

# Migrate the database
migrate-db:
	docker compose exec nextjs npx sequelize-cli db:migrate

# Run test in docker
test:
	docker compose exec nextjs npm run test

# Restart and Build Docker Compose services
fresh: down build up migrate-db

# Undo migration
migrate-db-undo:
	docker compose exec nextjs npx sequelize-cli db:migrate:undo

# Simplified command to restart, rebuild, and migrate
all: rebuild migrate-db

build-ios:
	@echo "Building Next.js app..."
	npm run export
	npx cap sync
	@echo "Opening Xcode for iOS build..."
	npx cap open ios

.PHONY: up down restart build rebuild migrate-db all


DEV_HOST ?= 0.0.0.0

.PHONY: help
help:
	@echo "Worknoon chat frontend commands"
	@echo ""
	@echo "  make install    Install dependencies"
	@echo "  make dev        Start Next.js dev server on $(DEV_HOST)"
	@echo "  make dev-local  Start Next.js dev server on localhost"
	@echo "  make lint       Run ESLint"
	@echo "  make typecheck  Run TypeScript typecheck"
	@echo "  make build      Build production Next.js app"

.PHONY: install
install:
	npm install

.PHONY: dev
dev:
	npm run dev -- --hostname $(DEV_HOST)

.PHONY: dev-local
dev-local:
	npm run dev

.PHONY: lint
lint:
	npm run lint

.PHONY: typecheck
typecheck:
	npm run typecheck

.PHONY: build
build:
	npm run build

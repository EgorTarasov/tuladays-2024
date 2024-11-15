POSTGRES_USER ?= pg-user
POSTGRES_PASSWORD ?= pg-password
POSTGRES_DB ?= tula-dev
POSTGRES_HOST ?= localhost
POSTGRES_PORT ?= 5432
POSTGRES_SETUP_TEST := user=${POSTGRES_USER} password=${POSTGRES_PASSWORD} dbname=${POSTGRES_DB} host=${POSTGRES_HOST} port=${POSTGRES_PORT} sslmode=disable
# PG_DSN:=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}

MIGRATION_FOLDER:=data/sql/migrations

CLICKHOUSE_USER ?= default
CLICKHOUSE_PASSWORD ?= 
CLICKHOUSE_DB ?= default
CLICKHOUSE_HOST ?= 127.0.0.1
CLICKHOUSE_PORT ?= 9000
CLICKHOUSE_SETUP_TEST := clickhouse://${CLICKHOUSE_USER}:${CLICKHOUSE_PASSWORD}@${CLICKHOUSE_HOST}:${CLICKHOUSE_PORT}/${CLICKHOUSE_DB}

CLICKHOUSE_MIGRATION_FOLDER := data/click/migrations



.PHONY: migration-create
migration-create:
	goose -dir "$(MIGRATION_FOLDER)" create "$(name)" sql

.PHONY: migration-up
migration-up:
	goose -dir "$(MIGRATION_FOLDER)" postgres "$(POSTGRES_SETUP_TEST)" up

.PHONY: migration-down
migration-down:
	goose -dir "$(MIGRATION_FOLDER)" postgres "$(POSTGRES_SETUP_TEST)" down



.PHONY: click-migration-create
click-migration-create:
	goose -dir "$(CLICKHOUSE_MIGRATION_FOLDER)" create "$(name)" sql

.PHONY: click-migration-up
click-migration-up:
	goose -dir "$(CLICKHOUSE_MIGRATION_FOLDER)" clickhouse "$(CLICKHOUSE_SETUP_TEST)" up

.PHONY: click-migration-down
click-migration-down:
	goose -dir "$(CLICKHOUSE_MIGRATION_FOLDER)" clickhouse "$(CLICKHOUSE_SETUP_TEST)" down
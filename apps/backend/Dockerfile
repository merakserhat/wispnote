# syntax=docker/dockerfile:1.3

ARG PG_VER=17-alpine

FROM postgres:${PG_VER} AS database

# Defaults used by the local profile (see application-local.properties).
# Override at build/run time if needed.
ENV POSTGRES_DB=wispnote \
    POSTGRES_USER=wispnote \
    POSTGRES_PASSWORD=wispnote \
    LANG=en_US.utf8

# Scripts here run once, on first initialisation of an empty data directory.
COPY ./.platform/postgres/init /docker-entrypoint-initdb.d

EXPOSE 5432

HEALTHCHECK --interval=5s --timeout=5s --start-period=10s --retries=10 \
    CMD pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" || exit 1

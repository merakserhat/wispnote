# WispNote

Monorepo for WispNote: a macOS app that saves a highlight together with where it came from.

| Path | What | Stack |
| --- | --- | --- |
| `apps/desktop` | Capture UI and sync client | Electron, React, Vite, Python engine |
| `apps/backend` | REST API, source of truth for members, notes, sources, automations | Spring Boot 4, Java 21, PostgreSQL 17, Flyway, RabbitMQ |
| `apps/analyzer` | Event-driven pipelines that enrich notes after they are saved | Spring Boot 4, Java 21, RabbitMQ |
| `contracts` | Message and API contracts shared between apps | |

Each app keeps its own build and README. This root holds what ties them together: one compose file, one Makefile.

## Run everything

```bash
make dev
```

Builds and starts Postgres, RabbitMQ, backend and analyzer in Docker, waits until they are healthy, then starts the desktop app on the host. Ctrl+C stops the desktop; `make down` stops the containers.

| Command | What |
| --- | --- |
| `make up` | Containers only, detached |
| `make logs` | Follow backend and analyzer logs |
| `make restart` | Restart backend and analyzer after a code change |
| `make test` | Maven verify for backend and analyzer |
| `make clean` | Stop containers and drop the Postgres and Maven volumes |

| Service | URL |
| --- | --- |
| Backend | http://localhost:8090 |
| Analyzer | http://localhost:8096 |
| RabbitMQ UI | http://localhost:15672 (guest / guest) |
| Postgres | localhost:5432, db / user / password `wispnote` |

Backend and analyzer run from source with Maven inside the container; `apps/<name>` is bind-mounted, so no image rebuild is needed after a code change, only `make restart`.

## History

Imported from `wispnote-backend`, `wispnote-desktop` and `wispnote-analyzer` with paths rewritten, so `git log apps/backend` shows that repo's full history.

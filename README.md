# WispNote

Monorepo for WispNote: a macOS app that saves a highlight together with where it came from.

| Path | What | Stack |
| --- | --- | --- |
| `apps/desktop` | Capture UI and sync client | Electron, React, Vite, Python engine |
| `apps/backend` | REST API, source of truth for members, notes, sources, automations | Spring Boot 4, Java 21, PostgreSQL 17, Flyway, RabbitMQ |
| `apps/analyzer` | Event-driven pipelines that enrich notes after they are saved | Spring Boot 4, Java 21, RabbitMQ |
| `contracts` | Message and API contracts shared between apps | |

Each app keeps its own build and README. This root holds what ties them together: one compose file, one Makefile.

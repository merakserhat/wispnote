# WispNote Backend

The API behind [WispNote](https://github.com/merakserhat/wispnote-desktop), a macOS app that
saves a highlight together with where it came from. This service is the source of truth for
members, notes, sources and automations.

Spring Boot 4, Java 21, PostgreSQL 17, Flyway, RabbitMQ. Hexagonal architecture across three
Maven modules, enforced by ArchUnit tests.

## The WispNote project

| Repository | Role |
| --- | --- |
| **wispnote-desktop** | The macOS app: capture UI, Python engine, sync with this API |
| **wispnote-backend** (this repo) | REST API and database. Source of truth for notes and sources |
| **wispnote-analyzer** | Event-driven pipelines that enrich notes after they are saved |

## What it does

- **Accounts.** Register, log in, refresh. Passwords are stored as bcrypt hashes.
- **Stateless auth.** RSA-signed JWTs. A short-lived access token (15 min) travels as a
  `Bearer` header on every request. A long-lived refresh token (24 h), signed with a separate
  key pair, is accepted only by the refresh endpoint and re-checks the member in the database.
- **Notes.** A highlight with its selected text, the user's note, the surrounding paragraph,
  section, page number, and the raw capture the desktop app sent.
- **Sources.** Where a note came from: a web page, a PDF, another file, a mail, or an app. Sources are
  deduplicated per member by a stable key, so many notes on one article share one source.
- **Automations.** Plain-language rules a member writes ("summarise every PDF highlight").
  This service stores them, with a toggle and a soft delete. The analyzer runs them.
- **Suggestions.** A seeded list of starter rules. A member only sees the ones they have not
  used yet.
- **Events.** Every saved or deleted note is announced on RabbitMQ after the database commit,
  so the analyzer can pick it up. See [Events](#events).

Everything a member owns is scoped by `member_id`. Deletes are soft: rows are flagged, never
removed.

## API

All routes live under `/v1`. Responses are wrapped in `{ "result": … }`; errors return
`{ "errorCode", "errorMessage" }` with a 4xx status.

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/v1/register` | – | Create a member |
| `POST` | `/v1/login` | – | Returns access + refresh tokens |
| `POST` | `/v1/refresh` | – | Trade a refresh token for a new pair |
| `GET` | `/v1/members/me` | Bearer | The signed-in member |
| `POST` | `/v1/notes` | Bearer | Save a capture. Creates or reuses the source |
| `GET` | `/v1/notes` | Bearer | Paged list, newest first, filterable |
| `GET` | `/v1/notes/{id}` | Bearer | One note |
| `DELETE` | `/v1/notes/{id}` | Bearer | Soft delete |
| `GET` | `/v1/sources` | Bearer | Paged list of sources with note counts |
| `POST` | `/v1/automations` | Bearer | Create a rule, optionally from a suggestion |
| `GET` | `/v1/automations` | Bearer | Paged list with the active count |
| `GET` | `/v1/automations/suggestions` | Bearer | Starter rules the member has not used |
| `GET` | `/v1/automations/{id}` | Bearer | One rule |
| `PUT` | `/v1/automations/{id}` | Bearer | Replace the rule text |
| `PATCH` | `/v1/automations/{id}` | Bearer | Toggle enabled |
| `DELETE` | `/v1/automations/{id}` | Bearer | Soft delete |

`/actuator/health` is public for liveness checks.

## Events

After a note is committed, the backend publishes a JSON message to the topic exchange
`wispnote.notes`. The routing key is the event type. One durable queue,
`wispnote.notes.analyzer`, is bound to both keys; the backend declares all three on its first
connection.

| Routing key | When |
| --- | --- |
| `note.created` | `POST /v1/notes` succeeded |
| `note.deleted` | `DELETE /v1/notes/{id}` succeeded |

```json
{
  "eventId": "876a4ca9-93ae-4413-842f-7db5fa72c342",
  "eventType": "note.created",
  "occurredAt": "2026-09-08T10:00:00Z",
  "noteId": "f44927b0-aedf-4443-af24-37cd287c113b",
  "memberId": "159a9489-65b2-4516-a0b6-ed0dfc8c903b",
  "sourceId": "65a25d6b-c0be-4cdb-97f4-2bd7fa14ef39"
}
```

The payload carries identifiers only. A consumer fetches the current note by ID, and on
`note.deleted` drops any pending work for it. Messages are persistent, `message_id` equals
`eventId`, and the publisher logs any unconfirmed, rejected or unroutable message.

Publishing happens in a transactional event listener after the commit, so a rolled-back
request never produces a message. It is not yet at-least-once: a crash between commit and
publish loses the event. A transactional outbox is the planned fix.

## Architecture

Three Maven modules, one direction of dependency. ArchUnit fails the build if a module
reaches the wrong way.

```
infrastructure  ──►  adapter  ──►  application
  Spring Boot main     REST controllers      facades, domain models,
  security, JWT,       JPA entities and      ports (interfaces),
  Flyway, config       repositories          business exceptions
```

- **application** knows nothing about Spring Web, JPA or HTTP. It defines ports such as
  `NotePort` and `AccessTokenPort` and the facades that use them.
- **adapter** implements those ports: JPA adapters against Postgres, JWT adapters for
  tokens, the RabbitMQ publisher (or its mock), and the REST controllers that translate
  requests into facade calls.
- **infrastructure** wires it all together: the Spring Boot entry point, security filter
  chains, key loading, migrations, and the ArchUnit tests.

Naming inside a module follows one pattern per layer: `XController`, `XFacade`, `XPort`,
`XJpaAdapter`, `XEntity`, `XRepository`, `XSpecification`.

## Getting started

### Requirements

- Java 21 or newer
- Docker, for the local Postgres and RabbitMQ

### 1. Start the database

The root `Dockerfile` builds a Postgres 17 image with the extensions the schema needs.

```bash
docker build -t wispnote-postgres .
docker run -d --name wispnote-postgres -p 5432:5432 wispnote-postgres
```

Database, user and password all default to `wispnote`. Flyway creates the schema when the app first
starts, and the state is recorded in `flyway_schema_history`.

### 2. Start the broker

```bash
docker run -d --name wispnote-rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4-management
```

The management UI is at `http://localhost:15672` (`guest` / `guest`). The exchange, queue and
bindings appear there after the backend's first publish. To run without a broker, set
`MESSAGE_PUBLISHER_PROVIDER=mock`: events are logged instead of sent. Add
`management.health.rabbit.enabled=false` in that case, or the health endpoint reports `DOWN`.

### 3. Run

```bash
./mvnw install -DskipTests
./mvnw -pl infrastructure spring-boot:run -Dspring-boot.run.profiles=local
```

The first command builds the `application` and `adapter` modules the runnable module depends
on. Repeat it after changing them. The API listens on `http://localhost:8090`. The desktop app points there by default.

### Signing keys

`infrastructure/src/main/resources/keys/` holds two RSA key pairs that sign access and refresh
tokens. **They are development keys, checked in on purpose so a clone runs without setup.**
Only the `local` profile references them. Any other environment must supply its own pair
through the `rsa.*` properties in `application-local.properties`, since the default profile
defines none and will not start without them. To rotate the local pair:

```bash
cd infrastructure/src/main/resources/keys
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out access-token.pem
openssl pkey -in access-token.pem -pubout -out access-token.pub
```

## Development

| Command | What it does |
| --- | --- |
| `./mvnw clean verify` | Build all modules and run the tests, including ArchUnit |
| `./mvnw install -DskipTests` | Build and install all modules without tests |
| `./mvnw -pl infrastructure spring-boot:run -Dspring-boot.run.profiles=local` | Run against the local Postgres and RabbitMQ |
| `./mvnw -pl infrastructure package` | Produce `infrastructure/target/wispnote-backend.jar` |

Migrations live in `infrastructure/src/main/resources/db/migration/` as `V{n}__{name}.sql`.
Add a new file, never edit an applied one.

## Status

- ✅ Register, login, refresh with rotating RSA-signed tokens
- ✅ Notes and sources with per-member ownership and soft delete
- ✅ Automations and suggestions
- ✅ `note.created` and `note.deleted` events on RabbitMQ, published after commit
- ⬜ Transactional outbox, so a crash between commit and publish cannot lose an event
- ⬜ Internal API for the analyzer to read notes and rules
- ⬜ Deployment configuration beyond the local profile

## License

[MIT](LICENSE)

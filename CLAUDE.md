# WispNote monorepo

macOS app that saves a highlight together with where it came from. Three apps, one compose file.

| Path | What | Stack |
| --- | --- | --- |
| `apps/desktop` | Capture UI and sync client | Electron, React, styled-components, antd, TanStack Query |
| `apps/backend` | REST API, source of truth, issues member and service tokens | Spring Boot 4, Java 21, Postgres 17, Flyway, RabbitMQ |
| `apps/analyzer` | Consumes note and automation events, interprets automations with an LLM, acts through the backend internal API | Spring Boot 4, Java 21, RabbitMQ |

Each app has its own `CLAUDE.md` or README with conventions. Read the app's file before editing it.

## Running

`make up` starts Postgres, RabbitMQ, backend and analyzer in Docker. Backend and analyzer run from
the bind-mounted source with Maven, so after a Java change run `make restart` (or
`docker compose restart backend|analyzer`), not a rebuild. `make dev` also starts the desktop app.
`make test` runs Maven verify for both Java apps, including ArchUnit rules.

| Service | URL |
| --- | --- |
| Backend | http://localhost:8090 |
| Analyzer | http://localhost:8096 |
| RabbitMQ UI | http://localhost:15672 (guest / guest) |
| Postgres | localhost:5432, db / user / password `wispnote` |

## Docs and working notes

Design docs, curl references and other notes live in `apps/<app>/.ai/docs/`. That folder is
gitignored on purpose; `.ai/` itself and the `CLAUDE.md` files are tracked. Never create a
markdown file anywhere else unless asked, and never create one at all unless asked.

- `apps/analyzer/.ai/docs/structure.md` – analyzer design: responsibilities, matching pipeline, internal API, auth
- `apps/analyzer/.ai/docs/automation-validation.md` – async automation validation design
- `apps/analyzer/.ai/docs/wamo-llm-integration.md` – the LLM port/adapter pattern to follow
- `apps/backend/.ai/docs/curl.md` – ready-to-paste curls for tokens and internal endpoints

## Architecture rules that bite

- Java apps are hexagonal: `application` (ports, facades, models) never depends on `adapter` or
  `infrastructure`. ArchUnit enforces it, plus: no class named `*Service*` may depend on a
  `*Facade*`, so do not name controllers or helpers with "Service".
- Backend auth: member tokens come from the backend's own `/v1/login` and `/v1/refresh`
  controllers; service tokens come from Spring Authorization Server at `/oauth2/token`
  (client credentials, client `analyzer`, scope `SERVICE`). Both are signed with the access
  token key and validated by the same decoder. Authorization is by scope per filter chain:
  `/internal/**` requires `SCOPE_SERVICE`, everything else `SCOPE_USER`. The converter does
  not reject tokens; the chains do.
- The analyzer gets its token through Spring Security's OAuth2 client (properties only, no
  token code) and calls the backend through an `@HttpExchange` interface behind a port, with a
  mock adapter switched by `backend.provider=mock`.
- Successful backend responses are wrapped in `{ "result": … }` by a `ResponseBodyAdvice`;
  errors are not. The analyzer unwraps with `InternalResponse<T>`.
- Contracts between apps are plain records duplicated on each side, kept in sync by hand. There
  is no shared contracts module.
- Reference patterns come from the Wamo repos under `~/Documents/Wamo` (auth-api,
  pos-api, rivo-payment-worker). When in doubt, match them.

## Desktop conventions that were corrected in review

- Layout with core components (`Box`, `Text`, `Button`), not new styled-components. A
  `*.styles.ts` file only when Box props cannot express it. Forms are a plain `<form>` around a `Box`.
- Optional JSX renders with `cond && (...)`, never a ternary ending in `: null`.
- No comments in `src/renderer/`.

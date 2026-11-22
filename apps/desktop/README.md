# WispNote Desktop

A macOS menu-bar app that saves a highlight **and where it came from** with one keypress.

Select text in any app, tap `Fn`, and WispNote captures the selection together with its
source: the URL, the file path, the PDF page and chapter, the surrounding paragraph. You
never switch apps, and the note lands in your library with enough context to find it again.

<!-- Demo video: drop a short screen recording here once it is ready.
     GitHub renders .mp4/.mov files dragged into the README editor.
[![WispNote demo](docs/demo-thumbnail.png)](docs/demo.mp4)
-->

## The WispNote project

WispNote is split into three repositories:

| Repository | Role |
| --- | --- |
| **wispnote-desktop** (this repo) | The macOS app: UI, capture engine, sync with the backend |
| **wispnote-backend** | The API and database. Source of truth for notes and sources |
| **wispnote-analyzer** | Event-driven pipelines that enrich notes after they are saved |

## Features

- **One-key capture.** Tap `Fn` to open the capture panel over whatever you are reading.
- **Quick highlight.** Double-tap `Fn` to save the selection silently and get a small toast.
- **Quick note.** `Fn+1` opens the panel straight into the note field.
- **PDF sync.** `Fn+2` imports a PDF's own annotations as notes, with page and section.
- **Source context.** Every note keeps its URL or file path, PDF page and chapter, and the
  paragraph around the selection.
- **Notes window.** Browse notes and sources, open a note's detail, manage automations, and
  pick a colour palette and light/dark scheme in Settings.
- **Stays out of the way.** Floats over full-screen apps and never steals focus from the app
  you are reading in.

Default shortcuts (configurable):

| Gesture | Action |
| --- | --- |
| `Fn` | Show the capture panel |
| `Fn` `Fn` (double tap) | Quick highlight |
| `Fn+1` | Quick note |
| `Fn+2` | Sync PDF annotations |
| `Fn+3` | Open the notes window |

## How it works

The desktop app is two processes that ship together. Behind them sit the two other
WispNote services.

```
┌─ Swift engine ─────┐   stdio    ┌─ Electron main ─────────┐   HTTPS   ┌─ wispnote-backend ──┐
│  Fn event tap      │ ─────────► │  supervises the engine  │ ────────► │  REST API           │
│  Accessibility API │            │  API client + tokens    │           │  Postgres           │
│  PDFKit            │ ◄───────── │  IPC to the windows     │ ◄──────── │  publishes events   │
└────────────────────┘            └───────────┬─────────────┘           └──────────┬──────────┘
                                              │ IPC                                │ Pub/Sub
                                  ┌───────────┴─────────────┐           ┌──────────┴──────────┐
                                  │  Electron renderer      │           │  wispnote-analyzer  │
                                  │  panel · HUD · notes    │           │  enrichment         │
                                  └─────────────────────────┘           │  pipelines          │
                                                                        └─────────────────────┘
```

- **The Swift engine** (`engine/`) does only what macOS exposes to native code: the `Fn`
  key event tap, reading another app's selection through the Accessibility API, and PDF
  extraction with PDFKit. It is stateless: no disk, no network.
- **Electron** (`src/`) owns every window, talks to the backend, and supervises the engine.
  TypeScript, React 18, styled-components, antd, TanStack Query, built with electron-vite.
- **wispnote-backend** is the source of truth. It stores notes and sources, serves the REST
  API the desktop app calls, and publishes an event such as `note.created` to Pub/Sub for
  every change.
- **wispnote-analyzer** consumes those events and runs the enrichment pipelines: fetching
  the surrounding paragraphs of a web page, and whatever automations the user has set up.
  Results flow back through the backend, so the desktop app only ever talks HTTPS and
  never touches the message broker.

Inside the desktop app, the engine and Electron talk over line-delimited JSON on
stdin/stdout. Capture always happens in the engine *before* any window appears, so the note
describes the article and not WispNote.

## Requirements

- macOS (Apple Silicon or Intel)
- Node.js 20 and npm
- Xcode or the Swift toolchain, Swift 6
- A running `wispnote-backend` (defaults to `http://localhost:8090`)
- Accessibility permission for the app binary (see below)

## Getting started

```bash
git clone https://github.com/merakserhat/wispnote-desktop.git
cd wispnote-desktop
npm install
npm run dev
```

`npm run dev` builds the Swift engine, starts Electron with hot reload **and** spawns the
engine itself. Do not run `wispnote-engine serve` alongside it, or two `Fn` event taps will fight over
the same key. `Ctrl+C` quits both processes.

### Accessibility permission

Without it, captures come back empty and the `Fn` tap cannot start. In development the
permission belongs to the Electron binary, not to the repo:

**System Settings → Privacy & Security → Accessibility** → add
`node_modules/electron/dist/Electron.app`, then restart the app.

Reinstalling `node_modules` or upgrading Electron gives macOS a new binary, so you will need
to grant it again.

### Environment variables

Every variable has a default, so a fresh clone runs without any setup. To change the backend
address or the Google client id, create an untracked `apps/desktop/.env`:

```bash
WISPNOTE_API_URL=https://api.example.com
WISPNOTE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

These two values are written into the build, so a packaged app keeps them. A shell variable
wins over the file: `WISPNOTE_API_URL=https://api.example.com npm run dev`. The other variables
are read from the shell only.

| Variable | Purpose | Default |
| --- | --- | --- |
| `WISPNOTE_API_URL` | Backend base URL | `http://localhost:8090` |
| `WISPNOTE_GOOGLE_CLIENT_ID` | OAuth client id for "Continue with Google"; empty disables the button | empty |
| `WISPNOTE_NO_TAP=1` | Skip the `Fn` event tap (no Accessibility permission needed) | off |
| `WISPNOTE_VERBOSE=1` | Log engine heartbeats | off |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Build the engine, start main, preload and renderer with HMR, and spawn the engine |
| `npm run engine:build` | Build the Swift engine alone |
| `npm run engine:test` | Run the engine's gesture tests |
| `npm run dev:notap` | Same, without the event tap |
| `npm run dev:verbose` | Same, with heartbeats in the log |
| `npm run build` | Typecheck, then build everything into `out/` |
| `npm run typecheck` | `tsc -b` across the project references |
| `npm run lint` / `lint:fix` | ESLint (airbnb + typescript + prettier), zero warnings allowed |
| `npm run format` / `format:check` | Prettier over `src/**` |
| `npm run storybook` | Storybook for the core components on port 6006 |

The engine's tests cover the gesture state machine only. Smoke-test the rest with:

```bash
engine/.build/release/wispnote-engine serve --no-tap
{"id":1,"cmd":"ping"}
```

Format it with `swift format -i -r engine/Sources engine/Tests`.

## Project structure

```
src/
├── shared/      the contract between processes: bridge frame types, IPC channels, API types
├── main/        Electron main: engine supervisor, windows, tray, API client, actions
├── preload/     contextBridge only, exposes window.wisp to the renderer
└── renderer/    React app, one HTML entry per window
    └── src/
        ├── screens/     Panel · Hud · Main · SignIn · Home · Notes · Sources · Automations · Settings
        ├── components/  core components (antd underneath, our props on top) and NavBar
        ├── api/         TanStack Query hooks over IPC
        ├── context/     theme, appearance, navigation, query client providers
        └── theme/       palettes and design tokens
engine/          Swift package, builds the `wispnote-engine` binary (`serve`, `capture`, `doctor`)
└── Sources/EngineCore/   bridge, gesture detector, Accessibility capture, PDF tools
```

## Status

Early development, not yet packaged for distribution.

- ✅ Capture panel, HUD toast, tray, engine supervisor and bridge protocol v2
- ✅ Sign-in, notes window with notes, sources, note detail, automations and settings
- ✅ Saves go to the backend through the main process
- ⬜ Analysis dashboard, showing what the analyzer found across your notes and sources
- ⬜ Widget view, a compact always-visible surface for recent notes
- ⬜ Offline outbox, so captures survive without network or sign-in
- ⬜ Packaging and signing (`.app` with the engine bundled as a helper)

## Contributing

Husky runs Prettier and ESLint on staged files before every commit. Code style follows
strict TypeScript, `T`-prefixed types, function-declaration components, and
styled-components with theme tokens only. See `CLAUDE.md` for the full set of conventions.

## License

[MIT](LICENSE)

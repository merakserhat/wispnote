# WispNote Desktop

## What this is

macOS menu-bar app that captures a highlight **and where it came from** — the URL,
file path, page number, chapter, surrounding paragraph — on one keypress, without
switching apps.

Two processes:

| Process | Owns |
| --- | --- |
| **Electron** (this repo) | All UI. Supervises the engine. Eventually: SQLite, messaging, cloud API |
| **Python engine** (`engine/`) | Only what nothing else can do: the Fn event tap, the Accessibility API, PyMuPDF. Stateless: no disk, no network |

The guiding rule: **Python keeps only what is impossible elsewhere.** Everything
else moves here over time.

## Status

TypeScript throughout, built with electron-vite. The panel and HUD are
implemented; the notes and settings screens are not.

- ✅ Panel (capture + actions + note field), HUD, tray, supervisor, bridge
- ✅ Engine rewritten in `engine/` (protocol v2); saves go main → backend via `src/main/actions/`
- ⬜ Next: notes window, settings, then packaging
- ⬜ Later: move SQLite + messaging here, leaving Python stateless

Run `npm run dev`. It spawns the engine itself — never run `python main.py serve`
too, or two Fn event taps fight over the same key.

## Documentation

| File | When to read |
| --- | --- |
| `.claude/tech-design/architecture.md` | What every file and folder is for, the invariants, and where to add a command / action / window / screen |
| `.claude/tech-design/backend-architecture.md` | Moving off local storage onto a backend: engine scope, API client in main, auth, outbox, TanStack Query over IPC |
| `.claude/tech-design/engine-migration.md` | The Python engine in `engine/`: what was carried from `../wispnote-app`, protocol v2, the traps the code used to explain in comments, Python conventions |
| `.claude/tech-design/implementation-status.md` | What is actually built, decisions taken while building, next steps |

## Architecture invariants

Break these and the app breaks in ways that are hard to trace.

1. **Capture happens in the engine, before Electron draws anything.**
   `context_capture` reads the *frontmost* app. If a window appears first, the
   capture describes WispNote instead of the article. Triggers therefore ship
   their `CaptureContext` inside the event, and the UI echoes that same context
   back with the action instead of re-capturing.
2. **Neither process outlives the other.** The host kills the engine on quit; the
   engine watches `getppid()` and exits when the host dies. A surviving engine
   holds the Fn event tap with no UI attached, breaking the key system-wide.
3. **Never block the engine's main thread.** The `CGEventTap` run loop lives
   there, and macOS disables a tap that blocks (`kCGEventTapDisabledByTimeout`).
   Slow work goes on a thread.
4. **Every user-visible outcome needs a window.** `quick_highlight` and
   `sync_source` save with no panel open; `src/main/actions/` must end every
   path in a HUD toast or a working save looks like a dead shortcut.

## Bridge protocol

Line-delimited JSON over stdin/stdout. stdout is taken away from Python's `print`
so diagnostics (stderr) cannot corrupt it.

Protocol v2. Every Fn gesture is a `trigger`; the engine never decides what an
action means. The host sends `configure` on every `ready`.

**Engine → host:** `ready` `heartbeat` `trigger` `result` `error`
**Host → engine:** `ping` `capture` `configure` `pdf_info` `pdf_locate`
`pdf_annotations` `shutdown`

Engine side: `engine/wispnote/bridge/`. Host side: `src/main/engine/`, with
`src/shared/types/engine.types.ts` as the contract. `ENGINE_PROTOCOL_VERSION`
must match `PROTOCOL_VERSION` in `bridge.py`; a mismatch quits the app.

## macOS + Electron facts (learned the hard way)

Do not re-derive these.

- **`type: 'panel'`** applies `NSWindowStyleMaskNonactivatingPanel` — floats over
  full-screen apps, appears on all Spaces.
- **`show()` vs `showInactive()` on a panel.** Electron special-cases panels:
  `show()` skips `activateIgnoringOtherApps:` and calls `makeKeyAndOrderFront:`,
  so the window takes the **keyboard** while the app behind stays frontmost.
  `showInactive()` never becomes key — a text field in such a window cannot be
  typed into no matter how much DOM `focus()` you call. Use `show()` when there
  is an input, `showInactive()` otherwise.
- **Blur needs a grace window (~400ms).** A blur right after `show()` is the
  window settling, not the user leaving; acting on it dismisses a field mid-type.
- **Vibrancy:** set `backgroundColor: '#00000000'`, not `transparent: true` —
  they fight. Pair with `setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })`.
- **HUD/toast windows:** `focusable: false`, `setIgnoreMouseEvents(true)`,
  `setAlwaysOnTop(true, 'status')`.
- **Create windows at startup, not on demand** — on-demand costs 100–300ms and a
  white flash, which ruins a capture HUD.
- **Fn is not an Electron accelerator.** `globalShortcut` cannot bind it, and
  double-tap/suppression need a `CGEventTap` anyway. The tap stays in Python
  permanently.
- **Accessibility permission attaches to the binary.** In dev that is
  `node_modules/electron/dist/Electron.app`; reinstalling `node_modules` or
  bumping Electron voids the grant.
- **`node:sqlite` is unavailable on Electron 33 (Node 20.18.3) — and no longer
  matters.** Local storage is gone; the backend is the source of truth. No
  `better-sqlite3`, no `@electron/rebuild`, no native-module signing. The only
  thing written to disk here is the offline outbox, as JSON.

## Supervision facts

- **pid liveness is not health.** A wedged PyObjC run loop stays alive and does
  nothing. The heartbeat carries `tap`; a dead tap means restart.
- **stdin EOF does not detect a dead parent.** Electron's helper processes
  inherit the stdin pipe, so it never closes. Use a `getppid()` watchdog.
- **Teardown must not log to a broken pipe.** A `BrokenPipeError` in the shutdown
  path once killed the thread doing the shutdown, orphaning the engine. Logging
  swallows errors; teardown always reaches `os._exit`.
- Restarts back off 0.5s → 10s, give up after 5 consecutive failures, and any run
  lasting 30s resets the counter.

## Decisions already made

- **Pipelines are a separate cloud service**, event-driven. Nothing local.
- **The backend is the source of truth.** SQLite and RabbitMQ leave the desktop
  app entirely — the engine extracts, main posts. This reverses the earlier
  "SQLite is the source of truth" decision.
- **The offline outbox is therefore mandatory**, not deferred. A capture with no
  network, no token, or no account must survive. JSON under `WISPNOTE_HOME`.
- **The API client lives in main, never the renderer.** `quick_highlight` saves
  with no window open, and a rotating refresh token cannot have two refreshers.
- **TanStack Query runs over IPC**, not HTTP: the queryFn calls
  `window.wisp.apiRequest`. Main-window only; the panel keeps `useBridgeAction`.
- See `.claude/tech-design/backend-architecture.md` for all of the above.
- **`../wispnote-app`'s PyObjC UI stays for now.** It is inert in `serve` mode
  (one lazy import in `cli.cmd_run`), it is the working fallback, and it is the
  spec for each screen. Delete it per-screen as an Electron replacement lands;
  `app_delegate.py` goes last.

## Conventions

Mirrors `~/Documents/Wamo/wamo-business-web-app-new`. Follow these in all new code.

- **TypeScript, strict.** `noUnusedLocals`, `noUnusedParameters`,
  `noFallthroughCasesInSwitch`. Absolute imports via `baseUrl` — no `../../` chains.
- **Types are `T`-prefixed:** `TCaptureContext`, `TEngineStatus`, `TPanelProps`.
- **File naming:** `Name.tsx`, `Name.types.ts`, `Name.hooks.ts`, `Name.helpers.ts`,
  `Name.styles.tsx`, `Name.constants.ts`, plus a barrel `index.ts` per module.
- **Import order:** React → 3rd party → *blank* → `components/` → `modals/` →
  *blank* → other internal (types, hooks, helpers, context, constants, enums) →
  *blank* → relative (`./` before `../`).
- **Always use curly braces** in `if`/`else`/`for`/`while`, even one-liners.
- **Components and hooks are `function` declarations**, default-exported at the
  bottom. No `const X = () => …`, no `React.FC`, no return-type annotation on
  components.
- **No inline functions in JSX.** Name the handler (`function handlePress()`), or
  extract a `views/` component when the callback needs a list item.
- **One folder per shared hook:** `hooks/useX/useX.ts` + `.types.ts` +
  `.constants.ts` + `index.ts`. Screen-local hooks stay in `Screen.hooks.ts` and
  are named exports.
- **No comments in `src/renderer/`.** Explanations belong here or in
  `.claude/tech-design/`.
- **Prettier:** single quotes, width 100, tab 2, `trailingComma: es5`,
  `bracketSameLine: true`.
- **Client state:** Context API only, no Redux.
- **Server state:** TanStack Query — here the "server" is the bridge, so wrap
  engine commands in query/mutation hooks named `use[Action][Domain]`
  (`useGetNotes`, `useSaveHighlight`).
- **Styling:** styled-components + styled-system, light/dark theme. Colors are
  **theme primitives** (`textPrimary`, `backgroundTertiary`, `buttonPrimary`…) from
  `theme/lightThemePrimitives.ts` / `darkThemePrimitives.ts`; components never see a hex.
  Spacing is the named `theme.space` scale (`xs` `s` `sm` `m` `ml` `l` `xl`…), text
  `theme.textVariants`. Border radius is a plain even pixel number (4 6 8 10 12 16 20), no
  scale. The palette is **Linen** (`theme/palette.ts`).
- **Core components** (`components/core/`): antd underneath, our props on top. Variant
  and size maps (`Button.constants.ts`) translate our props into **antd's own props**
  (`color`, `variant`, `size`); colors and metrics go through ConfigProvider tokens in
  `AntdProvider.helpers.ts`. Never repaint an antd component in CSS when a token exists. `Box` and `Text` take styled-system props directly (`p="m"`, `gap="s"`) and strip
  them with `shouldForwardProp`; everything else styled uses transient `$` props. Every
  core component ships a `Name.stories.tsx` (CSF3 objects, `title: 'Core/Name'`).
- **Forms:** react-hook-form + Yup.
- **Enums:** explicit values, default export, MAP + getter pattern.

## Tooling

Same setup as the Wamo app, adapted for Electron. Versions match.

| Command | What it does |
| --- | --- |
| `npm run dev` | electron-vite dev: main, preload and renderer with HMR |
| `npm run build` | typecheck, then build all three into `out/` |
| `npm run lint` | ESLint (airbnb + @typescript-eslint + prettier), zero warnings allowed |
| `npm run lint:fix` | The same, auto-fixing what it can |
| `npm run typecheck` | `tsc -b` across the project references |
| `npm run format` / `format:check` | Prettier over `src/**` |
| `npm run storybook` | Storybook 8 (react-vite) on :6006, stories from `src/renderer/src/**/*.stories.tsx` |

`tsconfig.json` holds project references only. `tsconfig.main.json` covers main
and preload (CommonJS via `Node16`, Node types, no DOM); `tsconfig.renderer.json`
covers the renderer (bundler mode, DOM, `react-jsx`); `tsconfig.node.json` covers
the Vite config. **Path aliases must be kept in step with
`vite.aliases.ts`** (used by `electron.vite.config.ts` and `.storybook/main.ts`) — TypeScript and Vite resolve them separately.

Two options Wamo uses are **removed in TypeScript 7** and are spelled
differently here — do not copy them back:

| Wamo | Here | Why |
| --- | --- | --- |
| `moduleResolution: "node"` | `module`/`moduleResolution: "Node16"` | `node` means node10, which TS 7 drops |
| `baseUrl: "src"` | `paths: { "*": ["./src/main/*"] }` | `baseUrl` no longer drives resolution; `paths` alone does, relative to the config file |

Reach for these rather than `ignoreDeprecations`, which only postpones the
break. Absolute imports still work exactly as at Wamo.

Three ESLint overrides differ from Wamo, each deliberate:

- `src/main/**` turns off `no-console` — the main process has no renderer, so
  its log *is* the product's output.
- `**/*.js` turns off `no-var-requires`, `strict` and `lint-around-directive`
  for the un-migrated spike files. Scoped to `.js`, so the rules apply again the
  moment a file becomes `.ts`.
- The `@tanstack/query` plugin is not extended yet; add it with the renderer.

Husky and lint-staged are active. `.husky/pre-commit` runs `npx lint-staged`,
which formats with Prettier and then runs `npm run lint` over staged files in
`src/`.

## Planned structure

```
src/
├── shared/        the contract: bridge frame types + IPC channel names
│   ├── types/        capture · engine · ipc · note
│   └── constants/    channels.ts
├── main/
│   ├── main.ts       wiring only — holds no state of its own
│   ├── engine/       Engine (mechanism) · createEngine (policy) · .types · .constants
│   ├── windows/      panelWindow · hudWindow · createPanelController · loadRenderer
│   ├── ipc/          registerIpcHandlers
│   ├── lifecycle/    registerShutdown
│   ├── tray/         createTray
│   └── helpers/      log · capture (snake_case → camelCase)
├── preload/       contextBridge only — no logic
└── renderer/
    ├── panel.html · hud.html      one entry per window
    └── src/
        ├── components/core/       Text · Button (antd behind our own props)
        ├── screens/Panel · Hud    .tsx · .types · .hooks · .helpers · .styles · views/
        ├── hooks/                 one folder per hook: useX/useX.ts · .types · index
        ├── context/               AllContextProvider nests ThemeProvider · AntdProvider
        ├── theme/                 tokens · theme.types · styled.d.ts
        └── types/                 common.ts · global.d.ts (window.wisp)
```

`src/shared/` is the contract between all three processes and mirrors
`bridge.py`. The wire is snake_case; `capture.helpers.ts` converts once, at the
main-process boundary, so Python field names never reach a component. Change
`models.py` and these types together.

Conventions in force: `T`-prefixed types, one `.types.ts` per module, logic in
`.hooks.ts` / `.helpers.ts` so components only describe what is on screen,
barrel `index.ts` everywhere, and **transient (`$`) props for anything styled**
— styled-components v6 forwards unknown props to the DOM and React warns.

Not yet mirrored from Wamo, and deliberately: no i18n (labels are literals), and
no TanStack Query — the panel fires one-shot commands with no server state to
cache. `useBridgeAction` is where Query goes when the notes screen needs it.

Once more screens exist, mirror Wamo's docs layout: `.claude/tech-design/*.md`
for structure, `.claude/tech-rules/*.md` for conventions, a `PostToolUse`
Prettier hook in `.claude/settings.json`, and reference them from a table here.

## Environment

- Engine path is `engine/` (`process.resourcesPath/engine` when packaged);
  override the interpreter with `WISPNOTE_PYTHON`. Install its dependencies with
  `pip install -r engine/requirements.txt`.
- `WISPNOTE_HOME` relocates the data directory — always set it when testing so
  real notes are untouched.
- `WISPNOTE_NO_TAP=1` skips the event tap (no Accessibility permission needed).
- `WISPNOTE_VERBOSE=1` prints heartbeats.
- The engine has no test suite by decision. Smoke-test it with
  `WISPNOTE_NO_TAP=1 python3 engine/main.py serve` and `{"id":1,"cmd":"ping"}`.

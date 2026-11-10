# WispNote Desktop

## What this is

macOS menu-bar app that captures a highlight **and where it came from** — the URL,
file path, page number, chapter, surrounding paragraph — on one keypress, without
switching apps.

Two processes:

| Process | Owns |
| --- | --- |
| **Electron** (this repo) | All UI. Supervises the engine. Eventually: SQLite, messaging, cloud API |
| **Python engine** (`engine/`) | Only what nothing else can do: the ⌃⇧ event tap, the Accessibility API, PyMuPDF. Stateless: no disk, no network |

The guiding rule: **Python keeps only what is impossible elsewhere.** Everything
else moves here over time.

## Status

TypeScript throughout, built with electron-vite. The capture HUD is
implemented; the notes and settings screens are not.

- ✅ Capture HUD (one morphing shape: Basic, Detailed, Result), tray, supervisor, bridge
- ✅ Engine rewritten in `engine/` (protocol v3); saves go main → backend via `src/main/actions/`
- ⬜ Next: notes window, settings, then packaging
- ⬜ Later: move SQLite + messaging here, leaving Python stateless

Run `npm run dev`. It spawns the engine itself — never run `python main.py serve`
too, or two event taps fire every gesture twice.

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
   holds the event tap with no UI attached, so every gesture fires into nothing.
3. **Never block the engine's main thread.** The `CGEventTap` run loop lives
   there, and macOS disables a tap that blocks (`kCGEventTapDisabledByTimeout`).
   Slow work goes on a thread.
4. **Every user-visible outcome needs a window.** `quick_highlight` and
   `sync_source` save with no card open; `src/main/actions/` must end every
   path in a Result pill (`hud.showResult` / `hud.reportResult`) or a working
   save looks like a dead shortcut.
5. **Main owns the capture HUD's state machine** (`src/main/hud/`). Triggers,
   engine keys, action results and the timers all arrive in main; the renderer
   animates the state it is sent and keeps only the draft text. The HUD window
   never moves or resizes while a state is up. esc closes whatever is up; a
   click away closes the card only when the note is empty, otherwise the card
   stays until esc or ↩.

## Bridge protocol

Line-delimited JSON over stdin/stdout. stdout is taken away from Python's `print`
so diagnostics (stderr) cannot corrupt it.

Protocol v3. Every ⌃⇧ gesture is a `trigger`; the engine never decides what an
action means. A `trigger` may carry `supersedes: { trigger, action }` when it upgrades
the gesture that fired just before it (tap → double tap); the host takes the earlier
action back if it was only a window, and ignores the upgrade if it was a save. The host
sends `configure` on every `ready`.

While the HUD is up the host says so with `hud` (`up: true`, no reply, re-sent on every
`ready`), and the tap reports two keys as `key` frames: `escape`, and `ctrl` for a lone ⌃
(down and up with nothing in between, in a mode entered after the HUD was already up, so
the release of the opening gesture's ⌃ never counts). The tap stays listen-only, so esc
also reaches the app that has the keyboard. The renderer does not handle esc or ⌃ itself.

**Engine → host:** `ready` `heartbeat` `trigger` `key` `result` `error`
**Host → engine:** `ping` `capture` `configure` `hud` `pdf_info` `pdf_locate`
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
  The capture HUD has no vibrancy (it cannot follow a shape that changes size), so it
  is `transparent: true` with `hasShadow: false` and draws its own surface and shadow.
- **Giving the keyboard back without hiding:** `blur()` on a key panel resigns key and
  keeps the window, but macOS fades the whole window out and back over ~270 ms (measured
  with `CGWindowListCopyWindowInfo`: alpha 1 → 0 → 1). `hide()` + `showInactive()` does the
  same. Never call either while the shape is morphing. `setFocusable(false)` does not make
  a key window resign. This is why the HUD takes the keyboard only 280 ms after a tap (once
  the double-tap window has passed), never blurs, and gives the keyboard back only by hiding:
  after ↩ the Result pill keeps the keyboard until it shrinks into the seed.
- **Click-through outside the shape:** `setIgnoreMouseEvents(true, { forward: true })`;
  the renderer still gets mouse moves, hit-tests `[data-hud-hit]` and asks main to stop
  ignoring while the pointer is over the shape. `acceptFirstMouse` lets a card left open by a click away be
  clicked while the window is not key.
- **Create windows at startup, not on demand** — on-demand costs 100–300ms and a
  white flash, which ruins a capture HUD.
- **Modifier-only gestures are not Electron accelerators.** `globalShortcut` cannot
  bind ⌃⇧ without a letter, let alone tell which key went down first, so the
  gestures need a `CGEventTap`. The tap stays in Python permanently.
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

- **Shortcuts are left ⌃/⇧ gestures, not Fn.** Fn belongs to Wispr Flow. The first key
  down is a mode key, like a layer; the other key is read inside it: tap (⌃ then ⇧) opens
  the capture HUD, double tap (⌃ then ⇧⇧) is a quick highlight, hold (⌃ then ⇧ held 400 ms) is
  free, and the mirror (⇧ then ⌃) opens the HUD too until it gets a job of its own. Every gesture fires on the release of
  the tapped key, never on the release of the mode key, and nothing waits: a single tap
  fires at once, and a second tap inside 250 ms fires the double-tap trigger with
  `supersedes` set so the host morphs the Basic card it just showed into the Result pill. The engine reuses the first
  tap's capture for the upgrade, since the HUD has the keyboard by then. A hold fires when the
  threshold passes. Release order does not matter. Any other key, click, non-momentum
  scroll or modifier cancels the current press but not the mode, so you can retry without
  lifting the mode key. The tap is listen-only; events are never swallowed or delayed.
- **Pipelines are a separate cloud service**, event-driven. Nothing local.
- **The backend is the source of truth.** SQLite and RabbitMQ leave the desktop
  app entirely — the engine extracts, main posts. This reverses the earlier
  "SQLite is the source of truth" decision.
- **The offline outbox is therefore mandatory**, not deferred. A capture with no
  network, no token, or no account must survive. JSON under `WISPNOTE_HOME`.
- **The API client lives in main, never the renderer.** `quick_highlight` saves
  with no window open, and a rotating refresh token cannot have two refreshers.
- **TanStack Query runs over IPC**, not HTTP: the queryFn calls
  `window.wisp.apiRequest`. Main-window only; the HUD talks to main over `hud:state` and
  `hud:intent`.
- **Navigation is TanStack Router, code-based, on memory history**, the same shape as
  the Wamo web app. Electron loads the renderer from a file URL, so there is no browser
  history to drive. `src/renderer/src/routes/` holds the root, the two pathless layouts
  (`main-layout` with the nav bar, `auth-layout` for sign-in) and the router; every screen
  folder ships a `Name.routes.ts` that `routeTree.ts` assembles. Screens read their input
  from the route (`getRouteApi('/main-layout/groups/$noteGroupId').useParams()`, typed
  `validateSearch` for `/verify-email`) and move with `navigate({ to, params, search })`.
  Auth gating is the layouts rendering `<Navigate>` from the member query, not a context.
  Never put "which thing to show" state in a context; it belongs in params or search.
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
- **Client state:** Context API only, no Redux. Navigation state is the router's, never a
  context: a screen's input is a path param or a typed search param.
- **Server state:** TanStack Query — here the "server" is the bridge, so wrap
  engine commands in query/mutation hooks named `use[Action][Domain]`
  (`useGetNotes`, `useSaveHighlight`).
- **Styling:** styled-components + styled-system, light/dark theme. Colors are
  **theme primitives** (`textPrimary`, `backgroundTertiary`, `buttonPrimary`…) from
  `theme/palettes.json` (one `light` + `dark` set per palette, typed by `TThemePrimitives`);
  components never see a hex. The user picks palette and scheme in Settings; main persists
  them and sets `nativeTheme.themeSource`, `AppearanceProvider` feeds them to styled + antd.
  Spacing is the named `theme.space` scale (`xs` `s` `sm` `m` `ml` `l` `xl`…), text
  `theme.textVariants`. Border radius is a plain even pixel number (4 6 8 10 12 16 20), no
  scale. The default palette is **Linen**, the first entry in `palettes.json`.
- **Core components** (`components/core/`): antd underneath, our props on top. Variant
  and size maps (`Button.constants.ts`) translate our props into **antd's own props**
  (`color`, `variant`, `size`); colors and metrics go through ConfigProvider tokens in
  `AntdProvider.helpers.ts`. Never repaint an antd component in CSS when a token exists. `Box` and `Text` take styled-system props directly (`p="m"`, `gap="s"`) and strip
  them with `shouldForwardProp`; everything else styled uses transient `$` props. Every
  core component ships a `Name.stories.tsx` (CSF3 objects, `title: 'Core/Name'`).
- **Core components before styled-components.** Build layout and chrome from `Box`, `Text`,
  `Card`, `Button`, `IconButton`, `ActivityIndicator`… with their props (`display`, `gap`,
  `px`, `borderWidth`, `borderStyle`, `borderColor`, `borderRadius`, `opacity`,
  `verticalAlign`). A `*.styles.ts` file exists only for what no core component can express:
  pseudo-elements and pseudo-classes (`::before`, `:focus-visible`), keyframe animations,
  native element resets (`styled.button`). When a styled component is unavoidable, extend
  `StyledBox` (see `Card.styles.ts`) so it still takes Box props, and keep only the CSS that
  Box cannot do. If a prop is missing from `Box` (as `opacity` was), add it to `Box` rather
  than writing a one-off styled component. Reason: a screen-local styled span is a fork of
  the design system; when the chip, card or spacing changes, every fork has to be found and
  changed by hand.
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
│   ├── windows/      captureHudWindow · mainWindow · loadRenderer
│   ├── hud/          createCaptureHud (the HUD state machine and its timers)
│   ├── ipc/          registerIpcHandlers
│   ├── lifecycle/    registerShutdown
│   ├── tray/         createTray
│   └── helpers/      log · capture (snake_case → camelCase)
├── preload/       contextBridge only — no logic
└── renderer/
    ├── hud.html · main.html       one entry per window
    └── src/
        ├── components/core/       Text · Button (antd behind our own props)
        ├── routes/                root · layouts · router (memory history) · routeTree
        ├── layouts/               RootLayout · MainLayout (nav bar) · AuthLayout
        ├── screens/CaptureHud …   .tsx · .types · .hooks · .helpers · .styles · .routes · views/
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
no TanStack Query in the HUD — it sends one-shot intents with no server state to
cache.

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

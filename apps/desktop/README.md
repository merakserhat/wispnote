# wispnote-desktop

Supervises the WispNote capture engine and narrates what it does.

The Python app keeps the parts only it can do — the Fn event tap, the
Accessibility API, capture, storage, enrichment — and runs headless as a child
process. This project starts it, watches it, restarts it, and prints every
event it emits.

Two windows, both non-activating macOS panels: the **panel** (what was captured
and what can be done with it) and the **HUD** (the "Highlight saved"
confirmation). React + TypeScript + styled-components, built with electron-vite.

The terminal log stays as a second interface — it is how the capture pipeline is
followed while the UI is still small.

```
Fn ─► python engine captures ─► {"type":"trigger", context:{…}} ─► logged
                                {"type":"toast",   …}           ─► logged
```

## Run it

```bash
npm install
npm run dev               # needs Accessibility permission (see below)
npm run dev:verbose       # also print heartbeats
npm run dev:notap         # no event tap, no permission needed
npm run build             # typecheck + build all three targets into out/
```

Ctrl+C quits, and takes the engine with it.

The engine is found at `../wispnote-app` and run with `python3` — override with
`WISPNOTE_PYTHON=/path/to/python3`. Point `WISPNOTE_HOME` at a scratch
directory to keep testing away from your real notes.

You do **not** need to start the Python app yourself. Running
`python main.py` as well would put a second Fn event tap on the same key;
`ps -ax | grep "main.py serve"` should show exactly one line.

## Reading the log

```
22:31:42  engine   ready · pid 43917 · python 3.13.2
22:31:42  engine   tap on · accessibility granted
22:31:42  shortcut double_fn → quick_highlight
22:31:43  trigger  double_fn → quick_highlight
22:31:43  capture  pdf · Effective Java  p. 39
22:31:43  capture  "// Enum singleton - the preferred approach"
22:31:43  db       note_saved · note 12
22:31:43  result   Highlight saved · Effective Java  ·  p. 39
22:31:43  python   saved note 12 · Highlight saved · Effective Java
```

| Channel | What it means |
|---|---|
| `host` | this process starting or stopping |
| `engine` | supervisor: spawn, status, restart, give up |
| `shortcut` | a trigger→action binding, listed at startup |
| `trigger` | an Fn gesture fired |
| `capture` | what the user was looking at when it fired |
| `db` | a row was written |
| `result` | the outcome of a gesture |
| `python` | anything the engine printed itself, including `publish` |
| `beat` | heartbeat (verbose only) |

`fn` opens the panel and `fn+1` opens it straight into the note field.
`double_fn` (quick highlight) and `fn+2` (sync PDF) finish inside the engine and
report through the HUD. `fn+3` (open notes) has no screen yet.

## Accessibility permission

Capture comes back empty and the event tap fails to start without it. In dev
the permission belongs to the *Electron* binary:

**System Settings → Privacy & Security → Accessibility** → add
`node_modules/electron/dist/Electron.app`, then restart. Reinstalling
`node_modules` or bumping Electron gives macOS a new binary, so the grant has
to be repeated.

## Layout

| Path | What it does |
|---|---|
| `src/shared/` | the contract: bridge frame types + IPC channel names |
| `src/main/main.ts` | lifecycle and engine wiring |
| `src/main/engine/` | spawn, health, restart, backoff, circuit breaker |
| `src/main/windows/` | the panel and HUD windows |
| `src/preload/` | contextBridge — the renderer's only way out |
| `src/renderer/` | the React app, one entry per window |
| `../wispnote-app/wispnote/bridge.py` | the engine side of the protocol |

## Protocol

Line-delimited JSON. Commands in on stdin, events out on stdout; stdout is
taken away from `print` so diagnostics cannot corrupt it (they go to stderr).

**Out:** `ready` · `heartbeat` · `trigger` · `toast` · `data` · `result` · `error`
**In:** `ping` · `capture` · `save_highlight` · `save_note` · `sync_source` ·
`list_notes` · `list_sources` · `stats` · `settings` · `shutdown`

Two invariants hold the design together:

- **Capture happens in the engine, before the host is involved.**
  `context_capture` reads the frontmost app, so anything that took focus first
  would make the capture about the wrong window. Triggers ship their
  `CaptureContext` with the event.
- **Neither process outlives the other.** The host kills the engine on quit;
  the engine watches `getppid()` and exits when the host dies without warning.
  A surviving engine would hold the Fn event tap with no host attached to it.

## Health model

`pid` liveness is not enough — a wedged PyObjC run loop stays alive and does
nothing. The heartbeat carries `tap`, so an engine whose event tap died is
restarted even though the process is fine. Three missed beats also counts as
dead. Restarts back off 0.5s → 10s and stop after 5 consecutive failures; any
run lasting 30s resets that counter.

## Verified

- engine starts, reports `ready` with `tap=true` / `accessibility=true`
- `ping`, `capture`, `stats`, unknown-command errors all round-trip
- a save logs `db` → `result` → `python` in order
- both windows mount, `window.wisp` is exposed, and each renders real content
- panel takes the keyboard in note mode without the app behind losing focus
- SIGKILL of the engine → restart in 500ms
- SIGKILL of the host → engine exits, no orphan
- Ctrl+C / SIGTERM → engine tears down its tap, then exits
- unspawnable interpreter → 5 attempts with backoff, then quit
- `wispnote-app` test suite: 185 passing

## Next

The UI is unbuilt. The open question is how much moves here from Python:
storage, messaging and the cloud call could all live in this process, leaving
Python responsible only for what nothing else can do — the event tap and
Accessibility extraction. `list_notes`, `list_sources`, `stats` and `settings`
already come over the bridge, so a UI can be built before that decision is made.

Packaging is untouched. Shipping means PyInstaller into a helper `.app` with
`LSUIElement`, `extraResources` in electron-builder, and signing every nested
`.so`/`.dylib` with hardened runtime.

# Architecture

Every file and folder in this project, and why it is there.

## Overview

| Detail | Value |
| --- | --- |
| Platform | macOS desktop (menu-bar accessory app) |
| Framework | Electron 33 |
| Language | TypeScript 5.9 |
| Build | electron-vite 2 (Vite 5) |
| UI | React 18 + styled-components 6 + styled-system |
| Package manager | npm |
| Companion process | Python 3.13 + PyObjC, at `../wispnote-app` |

## The two processes

WispNote captures a highlight **and where it came from** — URL, file path, page
number, chapter, surrounding paragraph — on one keypress, without switching apps.

That needs two things macOS only exposes to a native process: a `CGEventTap` for
the ⌃⇧ gestures, and the Accessibility API to read another app's selection. Neither is
reachable from Electron, so they live in Python.

```
┌─ Electron ──────────────────┐        ┌─ Python engine ─────────────┐
│  all UI                     │ stdin  │  ⌃⇧ event tap (CGEventTap)  │
│  supervises the engine      │ ──────►│  Accessibility capture      │
│  capture HUD · tray · log   │◄────── │  SQLite · enrichment        │
└─────────────────────────────┘ stdout └─────────────────────────────┘
                          line-delimited JSON
```

The guiding rule: **Python keeps only what is impossible elsewhere.** Storage and
messaging are expected to move to this side later, leaving Python stateless.

## Root files

| File | Why it exists |
| --- | --- |
| `package.json` | Scripts and dependencies. `main` points at `out/main/index.js` — the *built* output, not source, because electron-vite compiles before Electron runs. |
| `electron.vite.config.ts` | One config, three builds (main / preload / renderer). Also declares the path aliases. |
| `tsconfig.json` | References only, like Wamo's. Holds no compiler options itself. |
| `tsconfig.main.json` | Main **and** preload **and** shared. CommonJS via `Node16`, Node types, no DOM — this is the Electron process, not a browser. |
| `tsconfig.renderer.json` | Renderer and shared. Bundler mode, DOM libs, `react-jsx`. |
| `tsconfig.node.json` | Types `electron.vite.config.ts` itself, which belongs to neither of the above. |
| `.eslintrc` | Wamo's rules verbatim, plus three scoped overrides (see CLAUDE.md). |
| `.prettierrc` | Wamo's formatting, byte for byte. |
| `.lintstagedrc.json` | Pre-commit formatting/lint. Inert until this becomes a git repo. |
| `.eslintignore` / `.prettierignore` | Keep `out/` and `dist/` out of both. |
| `CLAUDE.md` | Always-loaded context: invariants, macOS facts, conventions. |
| `README.md` | How to run it and how to read the log. |

> **Path aliases are declared twice** — in `electron.vite.config.ts` and in the
> tsconfigs — and the two resolve independently. Add an alias to one and the
> other will disagree. This is the single most common way to break the build.

## `src/shared/` — the contract

Imported by all three processes. Everything here mirrors
`../wispnote-app/wispnote/models.py` and `bridge.py`; **change both sides
together.**

| File | Why it exists |
| --- | --- |
| `types/capture.types.ts` | `TCaptureContext` (camelCase, used everywhere) and `TRawCaptureContext` (snake_case, exactly what Python sends). Two types on purpose: the wire format is Python's business, and it stops at the main process. |
| `types/engine.types.ts` | Every frame the engine can send (`ready`, `heartbeat`, `trigger`, `key`, `result`, `error`) and every command it accepts. A discriminated union on `type`, so a `switch` is exhaustively checked. |
| `types/ipc.types.ts` | What crosses the Electron IPC boundary, and `TWispBridge` — the complete surface the preload exposes. |
| `types/captureHud.types.ts` | The capture HUD's contract: `TCaptureHudState` (main → renderer, the phase and what to draw) and `TCaptureHudIntent` (renderer → main: save, sync, open notes, whether a note is typed, whether the pointer is over the shape). |
| `types/note.types.ts` | Replies from `list_notes` / `list_sources`. The bridge already serves these; no screen renders them yet. |
| `constants/channels.ts` | Every IPC channel name, in one object, so main and preload cannot drift on a string literal. |

## `src/main/` — the Electron main process

| File | Why it exists |
| --- | --- |
| `main.ts` | Lifecycle and wiring: create windows, start the engine, translate its frames into log lines and window calls, shut everything down. The only file that knows about all the pieces at once. |
| `main.constants.ts` | Where the Python app lives, the heartbeat interval, the verbose flag. |

### `engine/` — the supervised child process

| File | Why it exists |
| --- | --- |
| `Engine.ts` | Spawn, health, restart, request/reply. **Liveness is not the pid**: a wedged PyObjC run loop stays alive and does nothing, so the heartbeat carries `tap` and an engine whose event tap died is restarted anyway. |
| `Engine.constants.ts` | Backoff ladder, missed-beat threshold, circuit-breaker limit. Separated so the policy is readable without the mechanism. |
| `Engine.types.ts` | Spawn options, pending-request bookkeeping, outbound message shape. |
| `index.ts` | Barrel. |

### `windows/` and `hud/` — the capture HUD

| File | Why it exists |
| --- | --- |
| `windows/captureHudWindow.ts` | The one transparent window every capture state is drawn in. `type: 'panel'` applies `NSWindowStyleMaskNonactivatingPanel`, which is what lets it appear over the article being read without activating the app — and so without invalidating the capture. Knows how to take the keyboard (`show()`), give it back without hiding (`blur()`), sit under the cursor and let clicks through outside the shape. Knows nothing about states. |
| `windows/captureHudWindow.constants.ts` | Size, seed position, cursor offset, screen margin, blur grace. |
| `hud/createCaptureHud.ts` | The HUD's state machine: Hidden, Basic, Detailed, Result. Triggers, engine keys (`escape`, lone `ctrl`), blur, action results and the hold timers all meet here; it sends each new state to the renderer and tells the engine when the HUD is up. |
| `hud/createCaptureHud.constants.ts` | The hold and morph durations from the design's timing table. They **must match the CSS transitions** in `screens/CaptureHud`. |
| `loadRenderer.ts` | Dev server URL while developing, built HTML file once packaged. One place, so neither window gets it wrong. |
| `index.ts` | Barrel. |

### `ipc/`, `tray/`, `helpers/`

| File | Why it exists |
| --- | --- |
| `ipc/registerIpcHandlers.ts` | Routes HUD intents to `actions/`, which echoes back the stored capture rather than taking a fresh one — see invariant 1. |
| `ipc/ipc.types.ts` | What the handlers need injected, so they are not reaching for module globals. |
| `tray/createTray.ts` | The menu-bar presence, and the **only** place a user can see that capture has stopped working — the glyph tracks engine status. |
| `helpers/log.helpers.ts` | The terminal log. One line per event, aligned columns, so a capture reads top to bottom. |
| `helpers/capture.helpers.ts` | snake_case → camelCase, **once**, at the process boundary. This is why Python field names never reach a React component. Also the location/source/preview formatters used by the log. |

## `src/preload/`

| File | Why it exists |
| --- | --- |
| `preload.ts` | The `contextBridge`. The renderer's only way out — no Node, no `ipcRenderer`, just `window.wisp`. Every subscriber returns its own unsubscribe so a React effect can clean up without wiping a sibling's handler. |

## `src/renderer/`

| File | Why it exists |
| --- | --- |
| `hud.html` / `main.html` | One HTML entry per window. Separate documents, not routes — they are separate native windows with different lifetimes. |
| `src/hud.tsx` / `src/main.tsx` | React roots. Thin by design. |
| `src/App.tsx` | Shared shell: `ThemeProvider` + `GlobalStyle`. Both windows use it. |
| `src/types/global.d.ts` | Declares `window.wisp` so the renderer sees the preload's contract. |

### `theme/`

| File | Why it exists |
| --- | --- |
| `theme.ts` | The design tokens. Every surface colour is **translucent** — both windows sit on a macOS vibrancy layer, and a solid background would cover the blur the window already paints. |
| `GlobalStyle.ts` | Transparent body, system font, no overflow. Same reason. |
| `theme.types.ts` | Types derived from the token object, so the tokens stay the single source. |
| `styled.d.ts` | Teaches styled-components what `theme` is, giving autocomplete inside every template literal. |

### `components/core/`

Small and generic, mirroring Wamo's `components/core`.

| Folder | Why it exists |
| --- | --- |
| `Text/` | Every piece of text. Uses **transient (`$`) props** — styled-components v6 forwards unknown props to the DOM and React warns about them. The public API stays plain; the `$` mapping is internal. |
| `Button/` | Panel actions. Sets `-webkit-app-region: no-drag`, because the panel header drags the window and controls must opt out. |

### `screens/`

| Folder | Why it exists |
| --- | --- |
| `CaptureHud/` | The morphing shape. `CaptureHud.helpers.ts` turns (phase, previous phase) into geometry and transition strings; `CaptureHud.constants.ts` holds the geometry and easings from the design; `CaptureHud.hooks.ts` keeps the draft, grows the note field, reports the pointer and sends intents. `views/` are the card, the source row, the pill, the satellites and the orbit. It never decides a phase. |

### `hooks/`

| File | Why it exists |
| --- | --- |

## Invariants

Break these and the app fails in ways that are hard to trace.

1. **Capture happens in the engine, before Electron draws anything.**
   `context_capture` reads the *frontmost* app. If a window appears first, the
   capture describes WispNote instead of the article. Triggers ship their
   `CaptureContext` inside the event; the HUD echoes that same context back
   with the action rather than re-capturing.
2. **Neither process outlives the other.** The host kills the engine on quit; the
   engine watches `getppid()` and exits when the host dies. A surviving engine
   holds the event tap with no UI attached, so every gesture fires into nothing.
3. **`show()` for input, `showInactive()` otherwise.** Electron special-cases
   panels: `show()` skips `activateIgnoringOtherApps:` and calls
   `makeKeyAndOrderFront:`, so the window takes the keyboard while the app
   behind stays frontmost. `showInactive()` never becomes key, and a text field
   inside such a window cannot be typed into however much DOM focus it gets.
4. **Every user-visible outcome needs a window.** `quick_highlight` and
   `sync_source` save with no card open. Every path in `actions/` ends in a
   Result pill, or a working save looks like a dead shortcut.

## Where to add things

| Task | Files to touch |
| --- | --- |
| New engine command | `shared/types/engine.types.ts` → `bridge.py` → the caller |
| New HUD action | `captureHud.types.ts` (a `TCaptureHudIntent`) → `CaptureHud.hooks.ts` (send it) → `createActions.ts` (`runIntent`) |
| New window | `windows/` (class + constants) → an HTML entry → `electron.vite.config.ts` input |
| New screen | `screens/Name/` with `.tsx` `.types` `.hooks` `.helpers` `.styles` `index.ts` |
| New shared type | `shared/types/` — and change `models.py` in the same commit |
| New path alias | `electron.vite.config.ts` **and** the matching tsconfig |

# Contracts

Shared between apps. Nothing here yet; the backend README documents the current `wispnote.notes` events.

| Contract | Producer | Consumer |
| --- | --- | --- |
| `wispnote.notes` exchange, `note.created` / `note.deleted` | backend | analyzer |
| REST `/v1` | backend | desktop |

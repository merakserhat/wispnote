from __future__ import annotations

import contextlib
import json
import os
import sys
import threading
from typing import Any


class Channel:
    def __init__(self) -> None:
        private_fd = os.dup(1)
        os.dup2(2, 1)
        self._out = os.fdopen(private_fd, "w", encoding="utf-8", buffering=1)
        sys.stdout = sys.stderr
        self._lock = threading.Lock()

    def send(self, kind: str, **payload: Any) -> None:
        frame = json.dumps({"type": kind, **payload}, default=str, ensure_ascii=False)
        with self._lock:
            try:
                self._out.write(frame + "\n")
                self._out.flush()
            except (BrokenPipeError, ValueError, OSError):
                pass

    @staticmethod
    def log(message: str) -> None:
        with contextlib.suppress(BrokenPipeError, ValueError, OSError):
            print(f"[wispnote] {message}", file=sys.stderr, flush=True)

from __future__ import annotations

import argparse
import json
import sys
import time

from . import __version__
from .bridge import serve
from .capture.ax_client import AX_AVAILABLE, is_trusted
from .capture.context_capture import ContextCapture
from .config import Settings
from .pdf.tools import PDF_AVAILABLE
from .shortcuts.fn_detector import QUARTZ_AVAILABLE

ACCESSIBILITY_REMEDY = (
    "System Settings → Privacy & Security → Accessibility: grant it to the app "
    "running the engine (Electron in dev), then restart it"
)


def cmd_serve(args: argparse.Namespace) -> int:
    return serve(tap=not args.no_tap, heartbeat=args.heartbeat)


def cmd_capture(args: argparse.Namespace) -> int:
    _countdown(args.delay)
    ctx = ContextCapture(Settings()).capture()
    print(json.dumps(ctx.to_dict(), indent=2, ensure_ascii=False, default=str))
    return 1 if ctx.errors else 0


def cmd_doctor(_args: argparse.Namespace) -> int:
    print(f"WispNote engine {__version__}  ·  Python {sys.version.split()[0]}\n")

    checks = [
        ("PyObjC frameworks", AX_AVAILABLE, "pip install -r requirements.txt", True),
        (
            "Quartz event taps (Fn shortcut)",
            QUARTZ_AVAILABLE,
            "pip install -r requirements.txt",
            True,
        ),
        ("Accessibility permission", is_trusted(prompt=False), ACCESSIBILITY_REMEDY, True),
        ("PDF tools (PyMuPDF)", PDF_AVAILABLE, "pip install pymupdf", False),
    ]

    ok = True
    for name, passed, remedy, required in checks:
        mark = "ok" if passed else ("!!" if required else "--")
        print(f"  [{mark}] {name}")
        if not passed:
            print(f"       → {remedy}")
            ok = ok and not required

    print(
        "\n" + ("Everything required is in place." if ok else "Fix the items above, then re-run.")
    )
    return 0 if ok else 1


def _countdown(delay: float) -> None:
    if delay <= 0:
        return
    print(f"Switch to the app you want to capture… ({delay:.0f}s)", file=sys.stderr)
    for remaining in range(int(delay), 0, -1):
        print(f"  {remaining}…", end="\r", file=sys.stderr, flush=True)
        time.sleep(1)
    print("  capturing", file=sys.stderr)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="wispnote-engine",
        description="WispNote engine - Fn event tap, Accessibility capture and PDF reading.",
    )
    parser.add_argument("--version", action="version", version=f"WispNote engine {__version__}")
    subparsers = parser.add_subparsers(dest="command")

    serve_parser = subparsers.add_parser("serve", help="run under a host, speaking JSON on stdio")
    serve_parser.add_argument("--heartbeat", type=float, default=2.0, help="seconds between beats")
    serve_parser.add_argument(
        "--no-tap", action="store_true", help="skip the Fn event tap (no Accessibility needed)"
    )
    serve_parser.set_defaults(func=cmd_serve)

    capture_parser = subparsers.add_parser("capture", help="capture the frontmost app as JSON")
    capture_parser.add_argument("--delay", type=float, default=3, help="seconds before capturing")
    capture_parser.set_defaults(func=cmd_capture)

    doctor_parser = subparsers.add_parser("doctor", help="check permissions and dependencies")
    doctor_parser.set_defaults(func=cmd_doctor)

    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    if getattr(args, "func", None) is None:
        parser.print_help()
        return 2
    return args.func(args)

from __future__ import annotations

import time
from collections.abc import Callable, Iterator
from typing import Any

try:
    from AppKit import NSWorkspace
    from ApplicationServices import (
        AXIsProcessTrustedWithOptions,
        AXUIElementCopyActionNames,
        AXUIElementCopyAttributeNames,
        AXUIElementCopyAttributeValue,
        AXUIElementCopyParameterizedAttributeNames,
        AXUIElementCopyParameterizedAttributeValue,
        AXUIElementCreateApplication,
        AXUIElementCreateSystemWide,
        AXValueGetType,
        AXValueGetValue,
        kAXErrorSuccess,
        kAXValueCFRangeType,
        kAXValueCGPointType,
        kAXValueCGRectType,
        kAXValueCGSizeType,
    )

    AX_AVAILABLE = True
except ImportError:
    AX_AVAILABLE = False


class AXUnavailable(RuntimeError):
    pass


def is_trusted(prompt: bool = False) -> bool:
    if not AX_AVAILABLE:
        return False
    return bool(AXIsProcessTrustedWithOptions({"AXTrustedCheckOptionPrompt": prompt}))


def is_ax_element(value: Any) -> bool:
    return value is not None and "AXUIElement" in str(type(value))


class AXClient:
    def __init__(self) -> None:
        if not AX_AVAILABLE:
            raise AXUnavailable(
                "PyObjC frameworks are unavailable - install pyobjc-framework-Cocoa "
                "and pyobjc-framework-ApplicationServices"
            )
        self.system_wide = AXUIElementCreateSystemWide()

    @staticmethod
    def frontmost_application() -> Any | None:
        return NSWorkspace.sharedWorkspace().frontmostApplication()

    @staticmethod
    def application_element(pid: int) -> Any:
        return AXUIElementCreateApplication(pid)

    def focused_element(self) -> Any | None:
        return self.attribute(self.system_wide, "AXFocusedUIElement")

    def focused_window(self, app_element: Any) -> Any | None:
        window = self.attribute(app_element, "AXFocusedWindow")
        if window is None:
            window = self.attribute(app_element, "AXMainWindow")
        return window

    def attribute(self, element: Any, name: str, default: Any = None) -> Any:
        if element is None:
            return default
        try:
            error, value = AXUIElementCopyAttributeValue(element, name, None)
        except Exception:
            return default
        if error != kAXErrorSuccess or value is None:
            return default
        return self.convert(value)

    def raw_attribute(self, element: Any, name: str) -> Any:
        if element is None:
            return None
        try:
            error, value = AXUIElementCopyAttributeValue(element, name, None)
        except Exception:
            return None
        return value if error == kAXErrorSuccess else None

    def attribute_names(self, element: Any) -> list[str]:
        if element is None:
            return []
        try:
            error, names = AXUIElementCopyAttributeNames(element, None)
        except Exception:
            return []
        if error != kAXErrorSuccess or names is None:
            return []
        return [str(name) for name in names]

    def action_names(self, element: Any) -> list[str]:
        if element is None:
            return []
        try:
            error, names = AXUIElementCopyActionNames(element, None)
        except Exception:
            return []
        if error != kAXErrorSuccess or names is None:
            return []
        return [str(name) for name in names]

    def has_attribute(self, element: Any, name: str) -> bool:
        return name in self.attribute_names(element)

    def parameterized(self, element: Any, name: str, parameter: Any) -> Any:
        if element is None or parameter is None:
            return None
        try:
            error, value = AXUIElementCopyParameterizedAttributeValue(
                element, name, parameter, None
            )
        except Exception:
            return None
        return value if error == kAXErrorSuccess else None

    def parameterized_names(self, element: Any) -> list[str]:
        if element is None:
            return []
        try:
            error, names = AXUIElementCopyParameterizedAttributeNames(element, None)
        except Exception:
            return []
        if error != kAXErrorSuccess or names is None:
            return []
        return [str(name) for name in names]

    def supports_parameterized(self, element: Any, name: str) -> bool:
        return name in self.parameterized_names(element)

    def string(self, element: Any, name: str) -> str | None:
        value = self.attribute(element, name)
        if value is None:
            return None
        if isinstance(value, (str, int, float)):
            text = str(value).strip()
            return text or None
        if isinstance(value, dict):
            return None
        return None

    def number(self, element: Any, name: str) -> int | None:
        value = self.attribute(element, name)
        try:
            if isinstance(value, bool):
                return int(value)
            if isinstance(value, (int, float)):
                return int(value)
            if isinstance(value, str) and value.strip().isdigit():
                return int(value.strip())
        except (TypeError, ValueError):
            return None
        return None

    def child_elements(self, element: Any, name: str = "AXChildren") -> list[Any]:
        try:
            error, value = AXUIElementCopyAttributeValue(element, name, None)
        except Exception:
            return []
        if error != kAXErrorSuccess or value is None:
            return []
        try:
            return [item for item in value if is_ax_element(item)]
        except TypeError:
            return [value] if is_ax_element(value) else []

    def element_attribute(self, element: Any, name: str) -> Any | None:
        try:
            error, value = AXUIElementCopyAttributeValue(element, name, None)
        except Exception:
            return None
        if error != kAXErrorSuccess:
            return None
        return value if is_ax_element(value) else None

    def convert(self, value: Any) -> Any:
        if value is None:
            return None
        if is_ax_element(value):
            return value

        type_name = type(value).__name__

        if type_name == "AXValueRef" or "AXValue" in str(type(value)):
            return self._convert_ax_value(value)

        if isinstance(value, bool):
            return value
        if isinstance(value, (int, float, str)):
            return value

        if type_name in ("NSURL", "__NSURL"):
            return str(value.absoluteString()) if hasattr(value, "absoluteString") else str(value)

        if type_name in ("__NSCFBoolean",):
            return bool(value)
        if type_name in ("NSNumber", "__NSCFNumber"):
            return self._convert_number(value)

        if isinstance(value, (list, tuple)) or type_name.startswith(
            ("NSArray", "__NSArray", "NSMutableArray")
        ):
            return [self.convert(item) for item in value]

        if isinstance(value, dict) or type_name.startswith(("NSDictionary", "__NSDictionary")):
            try:
                return {str(key): self.convert(value[key]) for key in value}
            except Exception:
                return {}

        try:
            return str(value)
        except Exception:
            return None

    @staticmethod
    def _convert_number(value: Any) -> Any:
        try:
            if hasattr(value, "objCType") and value.objCType() in (b"B", b"c"):
                return bool(value.boolValue())
            as_float = float(value)
            as_int = int(as_float)
            return as_int if as_int == as_float else as_float
        except Exception:
            return None

    @staticmethod
    def _unwrap(ax_value: Any, kind: Any) -> Any | None:
        try:
            result = AXValueGetValue(ax_value, kind, None)
        except Exception:
            return None
        if isinstance(result, tuple):
            if len(result) >= 2:
                return result[1] if result[0] else None
            return result[0] if result else None
        return result

    def _convert_ax_value(self, value: Any) -> dict[str, Any]:
        try:
            kind = AXValueGetType(value)
        except Exception:
            return {"_type": "AXValue"}

        try:
            if kind == kAXValueCGPointType:
                point = self._unwrap(value, kAXValueCGPointType)
                if point is not None:
                    return {"_type": "point", "x": float(point.x), "y": float(point.y)}
            elif kind == kAXValueCGSizeType:
                size = self._unwrap(value, kAXValueCGSizeType)
                if size is not None:
                    return {
                        "_type": "size",
                        "width": float(size.width),
                        "height": float(size.height),
                    }
            elif kind == kAXValueCGRectType:
                rect = self._unwrap(value, kAXValueCGRectType)
                if rect is not None:
                    return {
                        "_type": "rect",
                        "x": float(rect.origin.x),
                        "y": float(rect.origin.y),
                        "width": float(rect.size.width),
                        "height": float(rect.size.height),
                    }
            elif kind == kAXValueCFRangeType:
                cfrange = self._unwrap(value, kAXValueCFRangeType)
                if cfrange is not None:
                    return {
                        "_type": "range",
                        "location": int(cfrange.location),
                        "length": int(cfrange.length),
                    }
        except Exception:
            pass
        return {"_type": "AXValue"}

    def walk(
        self,
        root: Any,
        *,
        max_depth: int = 6,
        max_nodes: int = 400,
        time_budget: float = 0.6,
        prune: Callable[[Any], bool] | None = None,
    ) -> Iterator[tuple[Any, int]]:
        if root is None:
            return

        deadline = time.monotonic() + time_budget
        queue: list[tuple[Any, int]] = [(root, 0)]
        keepalive: list[Any] = [root]
        visited: set[int] = {id(root)}
        seen = 0

        while queue:
            element, depth = queue.pop(0)
            yield element, depth
            seen += 1

            if depth >= max_depth or seen >= max_nodes or time.monotonic() > deadline:
                continue
            if prune is not None:
                try:
                    if prune(element):
                        continue
                except Exception:
                    pass

            for child in self.child_elements(element):
                key = id(child)
                if key in visited:
                    continue
                visited.add(key)
                keepalive.append(child)
                queue.append((child, depth + 1))

    def find(
        self,
        root: Any,
        predicate: Callable[[Any], bool],
        *,
        max_depth: int = 6,
        max_nodes: int = 400,
        time_budget: float = 0.6,
        prune: Callable[[Any], bool] | None = None,
    ) -> Any | None:
        for element, _ in self.walk(
            root,
            max_depth=max_depth,
            max_nodes=max_nodes,
            time_budget=time_budget,
            prune=prune,
        ):
            try:
                if predicate(element):
                    return element
            except Exception:
                continue
        return None

    def summarize(self, element: Any, attributes: list[str] | None = None) -> dict[str, Any]:
        if element is None:
            return {}
        attributes = attributes or [
            "AXRole",
            "AXSubrole",
            "AXRoleDescription",
            "AXTitle",
            "AXDescription",
            "AXIdentifier",
            "AXURL",
            "AXDocument",
            "AXSelectedText",
            "AXHelp",
            "AXPlaceholderValue",
            "AXInsertionPointLineNumber",
            "AXNumberOfCharacters",
        ]
        available = set(self.attribute_names(element))
        summary: dict[str, Any] = {"_available_attributes": sorted(available)}
        for name in attributes:
            if name not in available:
                continue
            value = self.attribute(element, name)
            if is_ax_element(value):
                value = "<AXUIElement>"
            if value not in (None, ""):
                summary[name] = value
        return summary

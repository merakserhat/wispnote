import ApplicationServices

struct TextInputDetector {
  private static let fieldRoles: Set = [AXRole.textField, AXRole.comboBox, AXRole.searchField]
  private static let writableAttributes = [
    AXAttribute.value, AXAttribute.selectedText, AXAttribute.selectedTextRange,
  ]
  private static let parentHops = 40

  private static let terminalBundleIds: Set = [
    "com.apple.terminal",
    "com.googlecode.iterm2",
    "com.mitchellh.ghostty",
    "net.kovidgoyal.kitty",
    "org.alacritty",
    "com.github.wez.wezterm",
    "dev.warp.warp-stable",
    "co.zeit.hyper",
  ]
  private static let selfDrawnEditorPrefixes = ["com.sublimetext."]

  let ax: AXClient

  func detect(elements: ElementBundle, bundleId: String) -> JSONValue {
    let focused = elements.focused
    let role = ax.string(focused, AXAttribute.role) ?? ""
    let subrole = ax.string(focused, AXAttribute.subrole) ?? ""
    let isWritable = TextInputDetector.writableAttributes.contains { ax.isSettable(focused, $0) }

    let reason = editableReason(
      focused: focused, role: role, subrole: subrole, isWritable: isWritable,
      bundleId: bundleId.lowercased())
    let rejection = rejectionReason(
      focused: focused, role: role, subrole: subrole, isWritable: isWritable)

    return [
      "editable": .bool(reason != nil),
      "reason": .string(reason ?? rejection),
      "caret": focused.flatMap(caret) ?? .null,
    ]
  }

  private func editableReason(
    focused: AXUIElement?, role: String, subrole: String, isWritable: Bool, bundleId: String
  ) -> String? {
    if subrole == AXRole.secureTextField {
      return nil
    }
    if TextInputDetector.terminalBundleIds.contains(bundleId) {
      return "terminal"
    }
    if TextInputDetector.selfDrawnEditorPrefixes.contains(where: bundleId.hasPrefix) {
      return "self-drawn-editor"
    }
    guard let focused else {
      return nil
    }
    if TextInputDetector.fieldRoles.contains(role) || subrole == AXRole.searchField {
      return "field"
    }
    if role == AXRole.textArea && isWritable {
      return "writable-area"
    }
    if ax.element(focused, AXAttribute.editableAncestor) != nil {
      return "editable-ancestor"
    }
    return nil
  }

  private func rejectionReason(
    focused: AXUIElement?, role: String, subrole: String, isWritable: Bool
  ) -> String {
    if focused == nil {
      return "no-focused-element"
    }
    if subrole == AXRole.secureTextField {
      return "secure-field"
    }
    if role == AXRole.textArea && !isWritable {
      return "read-only-area"
    }
    return "not-a-text-role"
  }

  private func caret(_ focused: AXUIElement) -> JSONValue? {
    rangeCaret(focused) ?? markerCaret(focused)
  }

  private func rangeCaret(_ focused: AXUIElement) -> JSONValue? {
    let range = ax.rawAttribute(focused, AXAttribute.selectedTextRange)
    return rect(ax.convert(ax.parameterized(focused, AXAttribute.boundsForRange, range)))
  }

  private func markerCaret(_ focused: AXUIElement) -> JSONValue? {
    var current: AXUIElement? = focused

    for _ in 0..<TextInputDetector.parentHops {
      guard let element = current else {
        return nil
      }
      if let range = ax.rawAttribute(element, AXAttribute.selectedTextMarkerRange) {
        let bounds = ax.parameterized(element, AXAttribute.boundsForTextMarkerRange, range)
        return rect(ax.convert(bounds))
      }
      if ax.string(element, AXAttribute.role) == AXRole.webArea {
        return nil
      }
      current = ax.element(element, AXAttribute.parent)
    }
    return nil
  }

  private func rect(_ value: JSONValue?) -> JSONValue? {
    guard
      let value, value["_type"] == .string("rect"),
      let x = value["x"], let y = value["y"], let width = value["width"],
      let height = value["height"], (height.doubleValue ?? 0) > 0
    else {
      return nil
    }
    return ["x": x, "y": y, "width": width, "height": height]
  }
}

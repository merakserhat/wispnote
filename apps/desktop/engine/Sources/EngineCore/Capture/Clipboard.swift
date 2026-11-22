import AppKit

struct Clipboard {
  private static let copyKey: CGKeyCode = 8
  private static let pasteKey: CGKeyCode = 9
  private static let copyTimeout = 0.2
  private static let pasteRestoreDelay = 0.4
  private static let pollInterval = 0.01

  func copySelection() -> String? {
    let pasteboard = NSPasteboard.general
    let saved = snapshot(pasteboard)
    let before = pasteboard.changeCount

    postCommandKey(Clipboard.copyKey)

    let deadline = ProcessInfo.processInfo.systemUptime + Clipboard.copyTimeout
    while pasteboard.changeCount == before {
      if ProcessInfo.processInfo.systemUptime > deadline {
        return nil
      }
      Thread.sleep(forTimeInterval: Clipboard.pollInterval)
    }

    let text = pasteboard.string(forType: .string)
    restore(pasteboard, saved)

    guard let text, !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
      return nil
    }
    return text
  }

  func paste(_ text: String) -> Bool {
    let pasteboard = NSPasteboard.general
    let saved = snapshot(pasteboard)

    pasteboard.clearContents()
    guard pasteboard.setString(text, forType: .string) else {
      restore(pasteboard, saved)
      return false
    }
    let written = pasteboard.changeCount

    postCommandKey(Clipboard.pasteKey)

    DispatchQueue.global().asyncAfter(deadline: .now() + Clipboard.pasteRestoreDelay) {
      if pasteboard.changeCount == written {
        restore(pasteboard, saved)
      }
    }
    return true
  }

  private func postCommandKey(_ key: CGKeyCode) {
    let source = CGEventSource(stateID: .privateState)

    for keyDown in [true, false] {
      let event = CGEvent(keyboardEventSource: source, virtualKey: key, keyDown: keyDown)
      event?.flags = .maskCommand
      event?.setIntegerValueField(.eventSourceUserData, value: SyntheticEvent.tag)
      event?.post(tap: .cgAnnotatedSessionEventTap)
    }
  }

  private func snapshot(_ pasteboard: NSPasteboard) -> [[PasteboardEntry]] {
    (pasteboard.pasteboardItems ?? []).map { item in
      item.types.compactMap { type in
        item.data(forType: type).map { PasteboardEntry(type: type, data: $0) }
      }
    }
  }

  private func restore(_ pasteboard: NSPasteboard, _ saved: [[PasteboardEntry]]) {
    pasteboard.clearContents()

    let items = saved.map { entries -> NSPasteboardItem in
      let item = NSPasteboardItem()
      for entry in entries {
        item.setData(entry.data, forType: entry.type)
      }
      return item
    }
    if !items.isEmpty {
      pasteboard.writeObjects(items)
    }
  }
}

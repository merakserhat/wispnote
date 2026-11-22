import Foundation

final class Commands {
  private let shortcuts: ShortcutManager
  private let capture: ContextCapture
  private let clipboard: Clipboard
  private let pdf: PdfTools
  private let mainThread: MainThread
  private let uptime: Uptime
  var requestStop: (() -> Void)?

  init(
    shortcuts: ShortcutManager,
    capture: ContextCapture,
    clipboard: Clipboard,
    pdf: PdfTools,
    mainThread: MainThread,
    uptime: Uptime
  ) {
    self.shortcuts = shortcuts
    self.capture = capture
    self.clipboard = clipboard
    self.pdf = pdf
    self.mainThread = mainThread
    self.uptime = uptime
  }

  func handle(_ command: String, message: JSONValue) throws -> JSONValue {
    switch command {
    case "ping":
      return ping()
    case "configure":
      return try configure(message)
    case "hud":
      return try hud(message)
    case "shutdown":
      return shutdown()
    case "capture":
      return try captureContext()
    case "paste":
      return try paste(message)
    case "pdf_info":
      return pdf.documentInfo(path: try filePath(message, command: command))
    case "pdf_locate":
      return try locate(message)
    case "pdf_annotations":
      return ["annotations": pdf.annotations(path: try filePath(message, command: command))]
    default:
      throw CommandError.unknown(command)
    }
  }

  private func ping() -> JSONValue {
    ["pong": true, "uptime": .double(uptime.seconds), "tap": .bool(shortcuts.isRunning)]
  }

  private func captureContext() throws -> JSONValue {
    let capture = self.capture
    let context = try mainThread.run { capture.capture() }
    return ["context": try JSONValue(encoding: context), "can_sync": .bool(pdf.canSync(context))]
  }

  private func paste(_ message: JSONValue) throws -> JSONValue {
    guard let text = message["text"]?.stringValue, !text.isEmpty else {
      throw CommandError.missing(command: "paste", field: "text")
    }
    return ["pasted": .bool(clipboard.paste(text))]
  }

  private func locate(_ message: JSONValue) throws -> JSONValue {
    guard let text = message["text"]?.stringValue, !text.isEmpty else {
      throw CommandError.missing(command: "pdf_locate", field: "text")
    }
    return pdf.locate(
      path: try filePath(message, command: "pdf_locate"), text: text,
      pageHint: message["page_hint"]?.intValue)
  }

  private func filePath(_ message: JSONValue, command: String) throws -> String {
    guard let path = message["file_path"]?.stringValue, !path.isEmpty else {
      throw CommandError.missing(command: command, field: "file_path")
    }
    return path
  }

  private func configure(_ message: JSONValue) throws -> JSONValue {
    guard let raw = message["settings"]?.objectValue else {
      throw CommandError.missing(command: "configure", field: "settings")
    }

    let settings = EngineSettings(json: raw)
    let shortcuts = self.shortcuts
    let capture = self.capture
    try mainThread.run {
      capture.settings = settings
      shortcuts.reload(settings)
    }

    let triggers = settings.bindings.map { binding -> JSONValue in
      ["trigger": .string(binding.trigger.rawValue), "action": .string(binding.action.rawValue)]
    }
    return ["triggers": .array(triggers)]
  }

  private func hud(_ message: JSONValue) throws -> JSONValue {
    let up = message["up"]?.boolValue ?? false
    let shortcuts = self.shortcuts
    try mainThread.run { shortcuts.setHudUp(up) }
    return ["up": .bool(up)]
  }

  private func shutdown() -> JSONValue {
    requestStop?()
    return ["stopping": true]
  }
}

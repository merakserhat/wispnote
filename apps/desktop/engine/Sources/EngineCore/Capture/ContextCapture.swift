import AppKit

final class ContextCapture {
  var settings: EngineSettings

  private let ax: AXClient
  private let waker: AccessibilityWaker
  private let selectionReader: SelectionReader
  private let textInputDetector: TextInputDetector
  private let summarizer: AXElementSummarizer
  private let extractors = ExtractorRegistry()

  init(settings: EngineSettings, ax: AXClient, clipboard: Clipboard) {
    self.settings = settings
    self.ax = ax
    waker = AccessibilityWaker(ax: ax)
    selectionReader = SelectionReader(ax: ax, clipboard: clipboard)
    textInputDetector = TextInputDetector(ax: ax)
    summarizer = AXElementSummarizer(ax: ax)
  }

  func watchActivations() {
    waker.watchActivations()
  }

  func capture() -> CaptureContext {
    var context = CaptureContext()
    let started = ProcessInfo.processInfo.systemUptime

    guard AccessibilityPermission.isGranted() else {
      context.errors.append("accessibility permission not granted")
      return context
    }
    guard let application = NSWorkspace.shared.frontmostApplication else {
      context.errors.append("no frontmost application")
      return context
    }

    context.appName = application.localizedName ?? ""
    context.bundleId = application.bundleIdentifier ?? ""
    context.pid = application.processIdentifier

    if waker.wake(pid: context.pid) {
      context.extras["accessibility_woken"] = true
    }

    var elements = ElementBundle()
    elements.application = ax.applicationElement(pid: context.pid)
    elements.window = elements.application.flatMap(ax.focusedWindow)
    elements.focused =
      ax.focusedElement() ?? ax.element(elements.application, AXAttribute.focusedUIElement)

    context.windowTitle =
      ax.string(elements.window, AXAttribute.title)
      ?? ax.string(elements.application, AXAttribute.title) ?? ""
    context.elementRole = ax.string(elements.focused, AXAttribute.role) ?? ""
    context.elementSubrole = ax.string(elements.focused, AXAttribute.subrole) ?? ""

    if let document = ax.string(elements.window, AXAttribute.document) {
      context.extras["document_path"] = .string(document)
    }
    context.extras["text_input"] = textInputDetector.detect(
      elements: elements, bundleId: context.bundleId)

    let extractor = extractors.select(for: context)
    readSelection(into: &context, elements: elements, extractor: extractor)
    if context.hasSelection {
      readSurroundingText(into: &context, elements: elements, extractor: extractor)
    }

    extractor.extract(into: &context, ax: ax, elements: elements)
    context.extras["extractor"] = .string(extractor.name)

    if context.sourceKey.isEmpty {
      let identity = [context.bundleId, context.appName].first { !$0.isEmpty } ?? "unknown"
      context.sourceKey = "app:\(identity)"
    }
    if context.sourceTitle.isEmpty {
      let title = TextNormalizer.cleanWindowTitle(context.windowTitle, appName: context.appName)
      context.sourceTitle = title.isEmpty ? context.appName : title
    }

    context.extras["raw"] = [
      "focused_element": summarizer.summarize(elements.focused),
      "focused_window": summarizer.summarize(elements.window),
    ]
    let elapsed = ProcessInfo.processInfo.systemUptime - started
    context.extras["capture_ms"] = .int(Int(elapsed * 1000))
    return context
  }

  private func readSelection(
    into context: inout CaptureContext, elements: ElementBundle, extractor: SourceExtractor
  ) {
    let scope = extractor.selectionScope(context: context, ax: ax, elements: elements)
    guard let selection = selectionReader.read(elements: elements, settings: settings, scope: scope)
    else {
      return
    }
    context.extras["selection_source"] = .string(selection.source.rawValue)

    let scalars = selection.text.unicodeScalars
    let limit = settings.maxSelectionChars

    if limit > 0 && scalars.count > limit {
      context.selectionTruncated = true
      context.extras["selection_original_length"] = .int(scalars.count)
      context.selectedText = String(String.UnicodeScalarView(scalars.prefix(limit)))
    } else {
      context.selectedText = selection.text
    }
  }

  private func readSurroundingText(
    into context: inout CaptureContext, elements: ElementBundle, extractor: SourceExtractor
  ) {
    guard
      let surrounding = extractor.surroundingText(context: context, ax: ax, elements: elements)
    else {
      return
    }

    let limit = settings.maxContextChars
    if limit > 0 {
      context.contextBefore = String(
        String.UnicodeScalarView(surrounding.before.unicodeScalars.suffix(limit)))
      context.contextAfter = String(
        String.UnicodeScalarView(surrounding.after.unicodeScalars.prefix(limit)))
    } else {
      context.contextBefore = surrounding.before
      context.contextAfter = surrounding.after
    }
    context.extras["context_source"] = .string(extractor.name)
  }
}

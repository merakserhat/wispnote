import ApplicationServices

struct BrowserExtractor: SourceExtractor {
  private static let webAreaLimits = AXTreeLimits(maxDepth: 10, maxNodes: 400, timeBudget: 0.4)

  private static let matcher = SourceMatcher(
    bundleIds: [
      "com.google.chrome",
      "com.google.chrome.canary",
      "com.google.chrome.beta",
      "com.apple.safari",
      "com.apple.safaritechnologypreview",
      "com.brave.browser",
      "com.microsoft.edgemac",
      "com.vivaldi.vivaldi",
      "com.operasoftware.opera",
      "org.mozilla.firefox",
      "org.mozilla.firefoxdeveloperedition",
      "company.thebrowser.browser",
      "company.thebrowser.dia",
      "com.kagimacos.kagi",
      "app.zen-browser.zen",
    ],
    bundlePrefixes: ["com.google.chrome", "org.mozilla."],
    appNameHints: ["chrome", "safari", "firefox", "brave", "arc", "edge", "vivaldi", "opera"]
  )

  let name = "browser"

  func matches(_ context: CaptureContext) -> Bool {
    BrowserExtractor.matcher.matches(context)
  }

  func extract(into context: inout CaptureContext, ax: AXClient, elements: ElementBundle) {
    let url = findURL(ax: ax, elements: elements)
    let title = findTitle(context: context, ax: ax, elements: elements)

    if let url, url.hasPrefix("file://"), let path = FilePath.fromDocument(url),
      path.lowercased().hasSuffix(".pdf")
    {
      context.sourceKind = .pdf
      context.filePath = path
      context.sourceKey = "pdf:\(path)"
      context.sourceTitle = title ?? FilePath.lastComponent(path)
      context.extras["opened_in_browser"] = true
      return
    }

    context.url = url
    context.sourceKind = .web

    guard let url else {
      context.sourceKey = "app:\(context.bundleId.isEmpty ? context.appName : context.bundleId)"
      context.sourceTitle = title ?? context.appName
      context.errors.append("browser: could not read page URL")
      return
    }

    let host = WebURL.host(url)
    context.sourceKey = "web:\(WebURL.normalize(url))"
    context.sourceTitle = title ?? (host.isEmpty ? url : host)
    context.extras["host"] = .string(host)
  }

  func surroundingText(context: CaptureContext, ax: AXClient, elements: ElementBundle)
    -> SurroundingText?
  {
    guard
      let webArea = webArea(ax: ax, elements: elements),
      let page = TextMarkers(ax: ax).document(in: webArea),
      let slice = TextMarkers.slice(page, around: context.selectedText)
    else {
      return nil
    }
    return SurroundingText(
      before: TextMarkers.asProse(slice.before), after: TextMarkers.asProse(slice.after))
  }

  private func webArea(ax: AXClient, elements: ElementBundle) -> AXUIElement? {
    if ax.string(elements.focused, AXAttribute.role) == AXRole.webArea {
      return elements.focused
    }
    let walk = AXTreeWalk(ax: ax, root: elements.window, limits: BrowserExtractor.webAreaLimits)
    return walk.first { ax.string($0.element, AXAttribute.role) == AXRole.webArea }?.element
  }

  private func findURL(ax: AXClient, elements: ElementBundle) -> String? {
    if let url = ax.string(elements.focused, AXAttribute.url) {
      return url
    }
    if let document = ax.firstString(elements.window, [AXAttribute.document, AXAttribute.url]) {
      return document
    }
    return ax.string(webArea(ax: ax, elements: elements), AXAttribute.url)
  }

  private func findTitle(context: CaptureContext, ax: AXClient, elements: ElementBundle) -> String?
  {
    let title = ax.string(elements.focused, AXAttribute.title)
    let role = ax.string(elements.focused, AXAttribute.role) ?? ""
    if let title, role == AXRole.webArea || role == AXRole.document {
      return title
    }

    let windowTitle = ax.string(elements.window, AXAttribute.title) ?? context.windowTitle
    let cleaned = TextNormalizer.cleanWindowTitle(windowTitle, appName: context.appName)
    return cleaned.isEmpty ? title : cleaned
  }
}

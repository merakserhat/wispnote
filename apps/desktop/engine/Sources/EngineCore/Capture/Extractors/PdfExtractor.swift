import ApplicationServices
import Foundation

struct PdfExtractor: SourceExtractor {
  private static let pageLimits = AXTreeLimits(maxDepth: 8, maxNodes: 250, timeBudget: 0.3)

  private static let pageOfTotal = try! NSRegularExpression(
    pattern: "\\b(\\d{1,5})\\s*(?:of|/|de|von|sur)\\s*(\\d{1,5})\\b", options: .caseInsensitive)
  private static let pageWord = try! NSRegularExpression(
    pattern: "\\b(?:page|sayfa|seite|página)\\s*[:#]?\\s*(\\d{1,5})\\b", options: .caseInsensitive)
  private static let digitsOnly = try! NSRegularExpression(pattern: "^\\s*(\\d{1,5})\\s*$")

  private static let textualRoles: Set = [
    "AXStaticText", "AXTextField", "AXTextArea", "AXValueIndicator", "AXImage", "AXGroup",
  ]
  private static let labelAttributes = [
    AXAttribute.title, AXAttribute.description, AXAttribute.help, AXAttribute.placeholderValue,
    AXAttribute.roleDescription,
  ]

  private static let matcher = SourceMatcher(
    bundleIds: [
      "com.apple.preview",
      "net.sourceforge.skim-app.skim",
      "com.adobe.reader",
      "com.adobe.acrobat.pro",
      "com.readdle.pdfexpert-mac",
      "com.apple.ibooks",
      "com.apple.books",
      "com.kodeco.pdfviewer",
      "com.marginnote.marginnote3",
    ],
    appNameHints: ["preview", "skim", "acrobat", "adobe reader", "pdf expert", "pdf viewer"]
  )

  let name = "pdf"

  func matches(_ context: CaptureContext) -> Bool {
    if PdfExtractor.matcher.matches(context) {
      return true
    }
    let document = context.extras["document_path"]?.stringValue ?? ""
    return document.lowercased().hasSuffix(".pdf")
  }

  func extract(into context: inout CaptureContext, ax: AXClient, elements: ElementBundle) {
    let path = findPath(context: context, ax: ax, elements: elements)
    context.sourceKind = .pdf
    context.filePath = path

    if let path {
      let fileName = FilePath.lastComponent(path)
      context.sourceKey = "pdf:\(path)"
      context.sourceTitle = fileName.hasSuffix(".pdf") ? String(fileName.dropLast(4)) : fileName
    } else {
      let title = context.windowTitle.isEmpty ? context.appName : context.windowTitle
      context.sourceKey = "pdf-window:\(context.bundleId):\(title)"
      context.sourceTitle = title
      context.errors.append("pdf: could not read document path")
    }

    let guess = detectPage(ax: ax, elements: elements)
    if let page = guess.page, page != 0 {
      context.pageNumber = page
      context.extras["page_hint_source"] = .string(guess.source)
      if let total = guess.total, total != 0 {
        context.extras["total_pages"] = .int(total)
      }
    }
  }

  private func findPath(context: CaptureContext, ax: AXClient, elements: ElementBundle) -> String? {
    for element in [elements.window, elements.focused, elements.application] {
      let document = ax.firstString(element, [AXAttribute.document, AXAttribute.url])
      if let path = FilePath.fromDocument(document) {
        return path
      }
    }
    return FilePath.fromDocument(context.extras["document_path"]?.stringValue)
  }

  private func detectPage(ax: AXClient, elements: ElementBundle) -> PageGuess {
    var best = PageGuess()

    for node in AXTreeWalk(ax: ax, root: elements.window, limits: PdfExtractor.pageLimits) {
      let role = ax.string(node.element, AXAttribute.role) ?? ""
      if !PdfExtractor.textualRoles.contains(role) {
        continue
      }

      let value = ax.string(node.element, AXAttribute.value)
      let label = PdfExtractor.labelAttributes
        .compactMap { ax.string(node.element, $0) }
        .joined(separator: " ")
      let haystack = [value ?? "", label].filter { !$0.isEmpty }.joined(separator: " ")
      if haystack.isEmpty {
        continue
      }

      if let groups = groups(PdfExtractor.pageOfTotal, in: haystack) {
        best = PageGuess(
          confidence: 3, page: Int(groups[0]), total: Int(groups[1]), source: "page-of-total")
        break
      }
      if let groups = groups(PdfExtractor.pageWord, in: haystack) {
        if best.confidence < 2 {
          best = PageGuess(confidence: 2, page: Int(groups[0]), source: "page-label")
        }
        continue
      }
      if let value, !label.isEmpty, label.lowercased().contains("page"), best.confidence < 1,
        let groups = groups(PdfExtractor.digitsOnly, in: value)
      {
        best = PageGuess(confidence: 1, page: Int(groups[0]), source: "numeric-field")
      }
    }
    return best
  }

  private func groups(_ expression: NSRegularExpression, in text: String) -> [String]? {
    let range = NSRange(text.startIndex..., in: text)
    guard let match = expression.firstMatch(in: text, range: range) else {
      return nil
    }
    return (1..<match.numberOfRanges).map { index in
      Range(match.range(at: index), in: text).map { String(text[$0]) } ?? ""
    }
  }
}

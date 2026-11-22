import PDFKit

struct PdfLocator {
  private static let contextLimit = 600
  private static let minimumNeedle = 8
  private static let probeLength = 120
  private static let maxPages = 2000
  private static let hintRadius = 3

  func locate(in document: PDFDocument, text: String, pageHint: Int?) -> JSONValue {
    var result: [String: JSONValue] = ["located": false]

    let needle = Array(TextNormalizer.normalizeWhitespace(text).unicodeScalars)
    if needle.count < PdfLocator.minimumNeedle {
      return .object(result)
    }
    let probe = Array(needle.prefix(PdfLocator.probeLength))

    result["total_pages"] = .int(document.pageCount)
    let outline = PdfOutline(document: document)

    for pageIndex in pageOrder(pageCount: document.pageCount, hint: pageHint) {
      let pageText = Array(
        TextNormalizer.normalizeWhitespace(document.page(at: pageIndex)?.string).unicodeScalars)
      guard let position = firstIndex(of: probe, in: pageText) else {
        continue
      }

      var end = position + needle.count
      if end > pageText.count {
        end = position + probe.count
      }
      let before = pageText[max(0, position - PdfLocator.contextLimit)..<position]
      let after = pageText[end..<min(pageText.count, end + PdfLocator.contextLimit)]

      result["located"] = true
      result["page_number"] = .int(pageIndex + 1)
      result["context_before"] = .string(String(String.UnicodeScalarView(before)))
      result["context_after"] = .string(String(String.UnicodeScalarView(after)))
      result["section"] = .string(outline.section(forPage: pageIndex + 1))
      break
    }
    return .object(result)
  }

  private func pageOrder(pageCount: Int, hint: Int?) -> [Int] {
    let pages = Array(0..<min(pageCount, PdfLocator.maxPages))
    guard let hint, hint != 0, pageCount > 0 else {
      return pages
    }

    let centre = max(0, min(pageCount - 1, hint - 1))
    let nearby = ((centre - PdfLocator.hintRadius)...(centre + PdfLocator.hintRadius))
      .filter { $0 >= 0 && $0 < pageCount }
    return nearby + pages.filter { !nearby.contains($0) }
  }

  private func firstIndex(of probe: [Unicode.Scalar], in text: [Unicode.Scalar]) -> Int? {
    if probe.isEmpty || text.count < probe.count {
      return nil
    }
    return (0...(text.count - probe.count)).first { start in
      text[start] == probe[0] && text[start..<(start + probe.count)].elementsEqual(probe)
    }
  }
}

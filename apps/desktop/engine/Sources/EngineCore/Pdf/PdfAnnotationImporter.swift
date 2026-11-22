import PDFKit

struct PdfAnnotationImporter {
  private static let markupSubtypes: Set = ["Highlight", "Underline", "Squiggly", "StrikeOut"]
  private static let textSubtypes: Set = ["Text", "FreeText", "Note"]
  private static let ignoredSubtypes: Set = ["Link", "Widget", "Popup"]
  private static let hashedTextLength = 200

  func annotations(in document: PDFDocument) -> JSONValue {
    let outline = PdfOutline(document: document)
    var found: [JSONValue] = []

    for pageIndex in 0..<document.pageCount {
      guard let page = document.page(at: pageIndex) else {
        continue
      }
      let annotations = page.annotations.filter {
        !PdfAnnotationImporter.ignoredSubtypes.contains($0.type ?? "")
      }

      for (order, annotation) in annotations.enumerated() {
        let entry = describe(
          annotation, on: page, pageIndex: pageIndex, order: order, outline: outline)
        if let entry {
          found.append(entry)
        }
      }
    }
    return .array(found)
  }

  private func describe(
    _ annotation: PDFAnnotation, on page: PDFPage, pageIndex: Int, order: Int, outline: PdfOutline
  ) -> JSONValue? {
    let subtype = annotation.type ?? ""
    let comment = TextNormalizer.normalizeWhitespace(annotation.contents)
    var highlighted = ""

    if PdfAnnotationImporter.markupSubtypes.contains(subtype) {
      highlighted = markedText(annotation, on: page)
    } else if !PdfAnnotationImporter.textSubtypes.contains(subtype) {
      return nil
    }
    if highlighted.isEmpty && comment.isEmpty {
      return nil
    }

    let geometry = geometry(of: annotation, on: page)
    let geometryText = "[" + geometry.map { String($0) }.joined(separator: ", ") + "]"
    let hashedText = String(
      String.UnicodeScalarView(
        highlighted.unicodeScalars.prefix(PdfAnnotationImporter.hashedTextLength)))

    return [
      "page_number": .int(pageIndex + 1),
      "subtype": .string(subtype),
      "text": .string(highlighted),
      "comment": .string(comment),
      "author": .string(TextNormalizer.normalizeWhitespace(annotation.userName)),
      "modified": .string(annotation.modificationDate.map(PdfDate.string) ?? ""),
      "rect": .array(geometry.map(JSONValue.double)),
      "section": .string(outline.section(forPage: pageIndex + 1)),
      "external_id": .string(
        StableHash.of(String(pageIndex), subtype, String(order), geometryText, hashedText)),
    ]
  }

  private func markedText(_ annotation: PDFAnnotation, on page: PDFPage) -> String {
    let points = (annotation.quadrilateralPoints ?? []).map(\.pointValue)
    var areas: [CGRect] = []

    if !points.isEmpty && points.count % 4 == 0 {
      for start in stride(from: 0, to: points.count, by: 4) {
        let quad = points[start..<(start + 4)]
        let xs = quad.map(\.x)
        let ys = quad.map(\.y)
        areas.append(
          CGRect(
            x: annotation.bounds.minX + xs.min()!,
            y: annotation.bounds.minY + ys.min()!,
            width: xs.max()! - xs.min()!,
            height: ys.max()! - ys.min()!))
      }
    } else {
      areas.append(annotation.bounds)
    }

    let chunks = areas.compactMap { page.selection(for: $0)?.string }.filter { !$0.isEmpty }
    return TextNormalizer.normalizeWhitespace(chunks.joined(separator: " "))
  }

  private func geometry(of annotation: PDFAnnotation, on page: PDFPage) -> [Double] {
    let box = page.bounds(for: .cropBox)
    let bounds = annotation.bounds

    return [
      bounds.minX - box.minX, box.maxY - bounds.maxY, bounds.maxX - box.minX,
      box.maxY - bounds.minY,
    ].map { (Double($0) * 10).rounded() / 10 }
  }
}

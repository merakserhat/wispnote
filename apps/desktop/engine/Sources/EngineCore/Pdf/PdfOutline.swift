import PDFKit

struct PdfOutline {
  private static let sectionLimit = 200

  private(set) var entries: [PdfOutlineEntry] = []

  init(document: PDFDocument) {
    if let root = document.outlineRoot {
      collect(from: root, level: 1, document: document)
    }
  }

  func section(forPage pageNumber: Int) -> String {
    var best = ""

    for entry in entries {
      if entry.page > pageNumber {
        break
      }
      if entry.page > 0 && !entry.title.isEmpty {
        best = entry.title
      }
    }
    return TextNormalizer.truncate(best, limit: PdfOutline.sectionLimit)
  }

  func json(limit: Int) -> JSONValue {
    .array(
      entries.prefix(limit).map { entry in
        ["level": .int(entry.level), "title": .string(entry.title), "page": .int(entry.page)]
      }
    )
  }

  private mutating func collect(from parent: PDFOutline, level: Int, document: PDFDocument) {
    for index in 0..<parent.numberOfChildren {
      guard let child = parent.child(at: index) else {
        continue
      }
      let destination = child.destination ?? (child.action as? PDFActionGoTo)?.destination
      let page = destination?.page.map { document.index(for: $0) + 1 } ?? -1

      entries.append(
        PdfOutlineEntry(
          level: level, title: TextNormalizer.normalizeWhitespace(child.label), page: page))
      collect(from: child, level: level + 1, document: document)
    }
  }
}

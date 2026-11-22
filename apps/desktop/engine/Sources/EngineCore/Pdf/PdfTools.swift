import PDFKit

struct PdfTools {
  private static let outlineLimit = 500

  let isAvailable = true

  func canSync(_ context: CaptureContext) -> Bool {
    guard context.canSync, let path = context.filePath else {
      return false
    }
    return FileManager.default.fileExists(atPath: path)
  }

  func documentInfo(path: String) -> JSONValue {
    guard let document = open(path) else {
      return [:]
    }
    let attributes = document.documentAttributes ?? [:]
    let size = (try? FileManager.default.attributesOfItem(atPath: path)[.size] as? Int) ?? 0

    return [
      "pdf_title": .string(
        TextNormalizer.normalizeWhitespace(
          attributes[PDFDocumentAttribute.titleAttribute] as? String)),
      "pdf_author": .string(
        TextNormalizer.normalizeWhitespace(
          attributes[PDFDocumentAttribute.authorAttribute] as? String)),
      "page_count": .int(document.pageCount),
      "toc": PdfOutline(document: document).json(limit: PdfTools.outlineLimit),
      "file_size": .int(size),
    ]
  }

  func locate(path: String, text: String, pageHint: Int?) -> JSONValue {
    guard let document = open(path) else {
      return ["located": false]
    }
    return PdfLocator().locate(in: document, text: text, pageHint: pageHint)
  }

  func annotations(path: String) -> JSONValue {
    guard let document = open(path) else {
      return []
    }
    return PdfAnnotationImporter().annotations(in: document)
  }

  private func open(_ path: String) -> PDFDocument? {
    if path.isEmpty || !FileManager.default.fileExists(atPath: path) {
      return nil
    }
    return PDFDocument(url: URL(fileURLWithPath: path))
  }
}

struct ExtractorRegistry {
  private let extractors: [SourceExtractor] = [
    BrowserExtractor(),
    PdfExtractor(),
    MailExtractor(),
    EditorExtractor(),
    GenericExtractor(),
  ]

  func select(for context: CaptureContext) -> SourceExtractor {
    extractors.first { $0.matches(context) } ?? GenericExtractor()
  }
}

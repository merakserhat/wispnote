struct GenericExtractor: SourceExtractor {
  private static let documentApps: Set = [
    "com.apple.ibooks",
    "com.apple.books",
    "com.amazon.lassen",
    "com.microsoft.word",
    "com.apple.iwork.pages",
    "com.apple.notes",
    "notion.id",
    "com.electron.logseq",
    "md.obsidian",
    "com.evernote.evernote",
    "com.apple.textedit",
    "com.goodnotes.mac",
    "com.flexibits.craft",
  ]

  let name = "generic"

  func matches(_ context: CaptureContext) -> Bool {
    true
  }

  func extract(into context: inout CaptureContext, ax: AXClient, elements: ElementBundle) {
    context.sourceKind = .app

    if let path = FilePath.fromDocument(ax.string(elements.window, AXAttribute.document)) {
      context.filePath = path
    }

    let title = TextNormalizer.cleanWindowTitle(context.windowTitle, appName: context.appName)
    let bundle = context.bundleId.lowercased()

    if GenericExtractor.documentApps.contains(bundle) && !title.isEmpty {
      context.sourceKey = "doc:\(bundle):\(title)"
      context.sourceTitle = title
      context.extras["document_app"] = true
      return
    }

    context.sourceKey = "app:\(bundle.isEmpty ? context.appName : bundle)"
    context.sourceTitle =
      !context.appName.isEmpty ? context.appName : (title.isEmpty ? "Unknown app" : title)
    if !title.isEmpty {
      context.extras["window_title"] = .string(title)
    }
  }
}

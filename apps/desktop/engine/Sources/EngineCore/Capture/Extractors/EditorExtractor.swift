import Foundation

struct EditorExtractor: SourceExtractor {
  private static let titleSplit = "\\s+[—–-]\\s+"
  private static let dirtyPrefix = "^[●•*]\\s*"
  private static let maxLine = 10_000_000

  private static let matcher = SourceMatcher(
    bundleIds: [
      "com.microsoft.vscode",
      "com.microsoft.vscodeinsiders",
      "com.visualstudio.code.oss",
      "com.todesktop.230313mzl4w4u92",
      "dev.zed.zed",
      "com.apple.dt.xcode",
      "com.sublimetext.4",
      "com.sublimetext.3",
      "com.github.atom",
      "com.panic.nova",
      "abnerworks.typora",
      "md.obsidian",
    ],
    bundlePrefixes: ["com.jetbrains.", "com.google.android.studio"],
    appNameHints: ["visual studio code", "cursor", "xcode", "sublime", "zed", "nova", "obsidian"]
  )

  let name = "editor"

  func matches(_ context: CaptureContext) -> Bool {
    EditorExtractor.matcher.matches(context)
  }

  func extract(into context: inout CaptureContext, ax: AXClient, elements: ElementBundle) {
    let path = findPath(ax: ax, elements: elements)
    context.sourceKind = path == nil ? .app : .file
    context.filePath = path

    if let path {
      context.sourceKey = "file:\(path)"
      context.sourceTitle = FilePath.lastComponent(path)
      context.extras["project"] = .string(FilePath.lastComponent(FilePath.directory(path)))
    } else {
      let fileName = fileNameFromTitle(context)
      context.sourceKey = "editor:\(context.bundleId):\(fileName ?? context.appName)"
      context.sourceTitle = fileName ?? context.appName
      if fileName == nil {
        context.errors.append("editor: could not determine file")
      }
    }

    let line = ax.number(elements.focused, AXAttribute.insertionPointLineNumber)
    if let line, line >= 0, line < EditorExtractor.maxLine {
      context.lineNumber = line + 1
    }
  }

  private func findPath(ax: AXClient, elements: ElementBundle) -> String? {
    for element in [elements.window, elements.focused] {
      let document = ax.firstString(element, [AXAttribute.document, AXAttribute.url])
      if let path = FilePath.fromDocument(document) {
        return path
      }
    }
    return nil
  }

  private func fileNameFromTitle(_ context: CaptureContext) -> String? {
    let title = TextNormalizer.cleanWindowTitle(context.windowTitle, appName: context.appName)
    if title.isEmpty {
      return nil
    }

    let firstPart: Substring
    if let separator = title.range(of: EditorExtractor.titleSplit, options: .regularExpression) {
      firstPart = title[..<separator.lowerBound]
    } else {
      firstPart = Substring(title)
    }

    let name =
      firstPart
      .replacingOccurrences(of: EditorExtractor.dirtyPrefix, with: "", options: .regularExpression)
      .trimmingCharacters(in: .whitespacesAndNewlines)
    return name.isEmpty ? nil : name
  }
}

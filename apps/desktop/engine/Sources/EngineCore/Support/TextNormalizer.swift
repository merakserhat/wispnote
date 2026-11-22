import Foundation

enum TextNormalizer {
  private static let softHyphen = "\u{00AD}"
  private static let whitespaceRun = "[\\s\\u000B\\u001C-\\u001F\\u0085]+"
  private static let titleSeparators = [" - ", " — ", " – ", " | "]
  private static let titleEdges = CharacterSet(charactersIn: " -—–|")

  static func normalizeWhitespace(_ text: String?) -> String {
    guard let text, !text.isEmpty else {
      return ""
    }
    return text.precomposedStringWithCompatibilityMapping
      .replacingOccurrences(of: softHyphen, with: "")
      .replacingOccurrences(of: whitespaceRun, with: " ", options: .regularExpression)
      .trimmingCharacters(in: .whitespacesAndNewlines)
  }

  static func truncate(_ text: String, limit: Int) -> String {
    let scalars = text.unicodeScalars
    if limit <= 0 || scalars.count <= limit {
      return text
    }
    return String(String.UnicodeScalarView(scalars.prefix(limit - 1))) + "…"
  }

  static func cleanWindowTitle(_ title: String?, appName: String?) -> String {
    var text = normalizeWhitespace(title)
    if text.isEmpty {
      return ""
    }

    if let appName, !appName.isEmpty {
      for separator in titleSeparators {
        let marker = text.range(of: separator + appName, options: .literal)
        if let marker, marker.lowerBound > text.startIndex {
          text = String(text[..<marker.lowerBound])
          break
        }
      }
    }
    return text.trimmingCharacters(in: titleEdges)
  }
}

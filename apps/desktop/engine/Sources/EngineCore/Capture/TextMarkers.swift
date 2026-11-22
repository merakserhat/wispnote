import ApplicationServices

struct TextMarkers {
  private static let objectReplacement = "\u{FFFC}"
  private static let needleLength = 120

  let ax: AXClient

  func selection(in element: AXUIElement) -> String? {
    let range = ax.rawAttribute(element, AXAttribute.selectedTextMarkerRange)
    return text(ax.parameterized(element, AXAttribute.stringForTextMarkerRange, range))
  }

  func document(in element: AXUIElement) -> String? {
    guard
      let start = ax.rawAttribute(element, AXAttribute.startTextMarker),
      let end = ax.rawAttribute(element, AXAttribute.endTextMarker)
    else {
      return nil
    }

    let fullRange = ax.parameterized(
      element, AXAttribute.textMarkerRangeForUnorderedTextMarkers, [start, end] as CFArray)
    return text(ax.parameterized(element, AXAttribute.stringForTextMarkerRange, fullRange))
  }

  static func slice(_ text: String, around selected: String) -> (before: String, after: String)? {
    if text.isEmpty || selected.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
      return nil
    }

    let needle = String(String.UnicodeScalarView(selected.unicodeScalars.prefix(needleLength)))
    guard let found = text.range(of: needle, options: .literal) else {
      return nil
    }

    let scalars = text.unicodeScalars
    let end =
      scalars.index(
        found.lowerBound, offsetBy: selected.unicodeScalars.count, limitedBy: scalars.endIndex)
      ?? scalars.endIndex
    return (String(text[..<found.lowerBound]), String(scalars[end...]))
  }

  static func asProse(_ text: String) -> String {
    TextNormalizer.normalizeWhitespace(text.replacingOccurrences(of: objectReplacement, with: " "))
  }

  private func text(_ value: CFTypeRef?) -> String? {
    guard let value else {
      return nil
    }
    let text = value as? String ?? String(describing: value)
    return text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? nil : text
  }
}

import ApplicationServices

struct AXElementSummarizer {
  private static let attributes = [
    AXAttribute.role,
    AXAttribute.subrole,
    AXAttribute.roleDescription,
    AXAttribute.title,
    AXAttribute.description,
    AXAttribute.identifier,
    AXAttribute.url,
    AXAttribute.document,
    AXAttribute.selectedText,
    AXAttribute.help,
    AXAttribute.placeholderValue,
    AXAttribute.insertionPointLineNumber,
    AXAttribute.numberOfCharacters,
  ]

  let ax: AXClient

  func summarize(_ element: AXUIElement?) -> JSONValue {
    guard let element else {
      return [:]
    }

    let available = Set(ax.attributeNames(element))
    var summary: [String: JSONValue] = [
      "_available_attributes": .array(available.sorted().map(JSONValue.string))
    ]

    for name in AXElementSummarizer.attributes where available.contains(name) {
      if let value = ax.value(element, name), value != .string("") {
        summary[name] = value
      }
    }
    return .object(summary)
  }
}

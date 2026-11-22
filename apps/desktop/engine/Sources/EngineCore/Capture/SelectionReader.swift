import ApplicationServices
import Foundation

struct SelectionReader {
  private static let parentHops = 40
  private static let searchLimits = AXTreeLimits(maxDepth: 12, maxNodes: 250, timeBudget: 0.4)

  let ax: AXClient
  let clipboard: Clipboard

  func read(elements: ElementBundle, settings: EngineSettings, scope: AXTreeWalk?) -> Selection? {
    if let text = ax.string(elements.focused, AXAttribute.selectedText) {
      return Selection(text: text, source: .focused)
    }
    if let text = focusedRange(elements) {
      return Selection(text: text, source: .focusedRange)
    }
    if let text = webAreaSelection(enclosingWebArea(of: elements.focused)) {
      return Selection(text: text, source: .webArea)
    }
    if let text = search(elements: elements, settings: settings, scope: scope) {
      return Selection(text: text, source: .search)
    }
    if settings.clipboardFallback && !exposesSelection(elements),
      let text = clipboard.copySelection()
    {
      return Selection(text: text, source: .clipboard)
    }
    return nil
  }

  func enclosingWebArea(of element: AXUIElement?) -> AXUIElement? {
    var current = element

    for _ in 0..<SelectionReader.parentHops {
      guard let candidate = current else {
        return nil
      }
      if ax.string(candidate, AXAttribute.role) == AXRole.webArea {
        return candidate
      }
      current = ax.element(candidate, AXAttribute.parent)
    }
    return nil
  }

  private func focusedRange(_ elements: ElementBundle) -> String? {
    guard
      let range = ax.value(elements.focused, AXAttribute.selectedTextRange),
      range["_type"] == .string("range"),
      let length = range["length"]?.intValue, length > 0,
      let location = range["location"]?.intValue,
      let value = ax.string(elements.focused, AXAttribute.value)
    else {
      return nil
    }

    let text = value as NSString
    if location >= text.length {
      return nil
    }
    let slice = text.substring(
      with: NSRange(location: location, length: min(length, text.length - location)))
    return slice.isEmpty ? nil : slice
  }

  private func webAreaSelection(_ webArea: AXUIElement?) -> String? {
    guard let webArea else {
      return nil
    }
    return ax.string(webArea, AXAttribute.selectedText)
      ?? TextMarkers(ax: ax).selection(in: webArea)
  }

  private func search(elements: ElementBundle, settings: EngineSettings, scope: AXTreeWalk?)
    -> String?
  {
    var walk = scope
    if walk == nil {
      guard settings.deepSearchSelection, let window = elements.window else {
        return nil
      }
      walk = AXTreeWalk(ax: ax, root: window, limits: SelectionReader.searchLimits)
    }

    for node in walk ?? AXTreeWalk(ax: ax, root: nil) {
      if let text = ax.string(node.element, AXAttribute.selectedText) {
        return text
      }
      if ax.string(node.element, AXAttribute.role) == AXRole.webArea,
        let text = TextMarkers(ax: ax).selection(in: node.element)
      {
        return text
      }
    }
    return nil
  }

  private func exposesSelection(_ elements: ElementBundle) -> Bool {
    let names = ax.attributeNames(elements.focused)
    if names.contains(AXAttribute.selectedText) || names.contains(AXAttribute.selectedTextRange) {
      return true
    }
    if enclosingWebArea(of: elements.focused) != nil {
      return true
    }

    let walk = AXTreeWalk(ax: ax, root: elements.window, limits: SelectionReader.searchLimits)
    return walk.contains { ax.string($0.element, AXAttribute.role) == AXRole.webArea }
  }
}

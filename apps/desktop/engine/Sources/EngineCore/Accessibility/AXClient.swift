import ApplicationServices

final class AXClient {
  private let systemWide = AXUIElementCreateSystemWide()
  private let converter = AXValueConverter()

  func applicationElement(pid: pid_t) -> AXUIElement {
    AXUIElementCreateApplication(pid)
  }

  func focusedElement() -> AXUIElement? {
    element(systemWide, AXAttribute.focusedUIElement)
  }

  func focusedWindow(of application: AXUIElement) -> AXUIElement? {
    element(application, AXAttribute.focusedWindow)
      ?? element(application, AXAttribute.mainWindow)
  }

  func rawAttribute(_ element: AXUIElement?, _ name: String) -> CFTypeRef? {
    guard let element else {
      return nil
    }
    var value: CFTypeRef?
    let error = AXUIElementCopyAttributeValue(element, name as CFString, &value)
    return error == .success ? value : nil
  }

  func value(_ element: AXUIElement?, _ name: String) -> JSONValue? {
    rawAttribute(element, name).map(converter.convert)
  }

  func convert(_ value: CFTypeRef?) -> JSONValue? {
    value.map(converter.convert)
  }

  func element(_ element: AXUIElement?, _ name: String) -> AXUIElement? {
    guard let value = rawAttribute(element, name), CFGetTypeID(value) == AXUIElementGetTypeID()
    else {
      return nil
    }
    return (value as! AXUIElement)
  }

  func children(_ element: AXUIElement?, _ name: String = AXAttribute.children) -> [AXUIElement] {
    guard let value = rawAttribute(element, name) else {
      return []
    }
    if CFGetTypeID(value) == AXUIElementGetTypeID() {
      return [value as! AXUIElement]
    }
    guard CFGetTypeID(value) == CFArrayGetTypeID() else {
      return []
    }
    return (value as! [CFTypeRef])
      .filter { CFGetTypeID($0) == AXUIElementGetTypeID() }
      .map { $0 as! AXUIElement }
  }

  func string(_ element: AXUIElement?, _ name: String) -> String? {
    let text: String

    switch value(element, name) {
    case .string(let value):
      text = value
    case .int(let value):
      text = String(value)
    case .double(let value):
      text = String(value)
    case .bool(let value):
      text = value ? "True" : "False"
    default:
      return nil
    }

    let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
    return trimmed.isEmpty ? nil : trimmed
  }

  func firstString(_ element: AXUIElement?, _ names: [String]) -> String? {
    for name in names {
      if let value = string(element, name) {
        return value
      }
    }
    return nil
  }

  func number(_ element: AXUIElement?, _ name: String) -> Int? {
    switch value(element, name) {
    case .bool(let value):
      return value ? 1 : 0
    case .int(let value):
      return value
    case .double(let value):
      return Int(value)
    case .string(let value):
      let trimmed = value.trimmingCharacters(in: .whitespacesAndNewlines)
      return trimmed.allSatisfy(\.isNumber) ? Int(trimmed) : nil
    default:
      return nil
    }
  }

  func attributeNames(_ element: AXUIElement?) -> [String] {
    guard let element else {
      return []
    }
    var names: CFArray?
    let error = AXUIElementCopyAttributeNames(element, &names)
    return error == .success ? (names as? [String] ?? []) : []
  }

  func parameterizedNames(_ element: AXUIElement?) -> [String] {
    guard let element else {
      return []
    }
    var names: CFArray?
    let error = AXUIElementCopyParameterizedAttributeNames(element, &names)
    return error == .success ? (names as? [String] ?? []) : []
  }

  func parameterized(_ element: AXUIElement?, _ name: String, _ parameter: CFTypeRef?) -> CFTypeRef?
  {
    guard let element, let parameter else {
      return nil
    }
    var value: CFTypeRef?
    let error = AXUIElementCopyParameterizedAttributeValue(
      element, name as CFString, parameter, &value)
    return error == .success ? value : nil
  }

  func isSettable(_ element: AXUIElement?, _ name: String) -> Bool {
    guard let element else {
      return false
    }
    var settable = DarwinBoolean(false)
    let error = AXUIElementIsAttributeSettable(element, name as CFString, &settable)
    return error == .success && settable.boolValue
  }

  func setAttribute(_ element: AXUIElement?, _ name: String, _ value: CFTypeRef) -> Bool {
    guard let element else {
      return false
    }
    return AXUIElementSetAttributeValue(element, name as CFString, value) == .success
  }

  func setMessagingTimeout(_ element: AXUIElement, seconds: Float) {
    AXUIElementSetMessagingTimeout(element, seconds)
  }
}

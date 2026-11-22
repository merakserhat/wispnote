import ApplicationServices

struct AXValueConverter {
  static let elementPlaceholder = "<AXUIElement>"

  func convert(_ value: CFTypeRef) -> JSONValue {
    let type = CFGetTypeID(value)

    if type == AXUIElementGetTypeID() {
      return .string(AXValueConverter.elementPlaceholder)
    }
    if type == AXValueGetTypeID() {
      return convertStructure(value as! AXValue)
    }
    if type == CFBooleanGetTypeID() {
      return .bool(CFBooleanGetValue((value as! CFBoolean)))
    }
    if type == CFNumberGetTypeID() {
      return convertNumber(value as! CFNumber)
    }
    if type == CFStringGetTypeID() {
      return .string(value as! String)
    }
    if type == CFURLGetTypeID() {
      return .string((value as! URL).absoluteString)
    }
    if type == CFArrayGetTypeID() {
      return .array((value as! [CFTypeRef]).map(convert))
    }
    if type == CFDictionaryGetTypeID() {
      var object: [String: JSONValue] = [:]
      for (key, element) in value as! NSDictionary {
        object[key as? String ?? String(describing: key)] = convert(element as CFTypeRef)
      }
      return .object(object)
    }
    return .string(String(describing: value))
  }

  private func convertNumber(_ number: CFNumber) -> JSONValue {
    if CFNumberGetType(number) == .charType {
      return .bool((number as NSNumber).boolValue)
    }

    let value = (number as NSNumber).doubleValue
    if value == value.rounded(), abs(value) < 9e15 {
      return .int(Int(value))
    }
    return .double(value)
  }

  private func convertStructure(_ value: AXValue) -> JSONValue {
    switch AXValueGetType(value) {
    case .cgPoint:
      var point = CGPoint.zero
      if AXValueGetValue(value, .cgPoint, &point) {
        return ["_type": "point", "x": .double(point.x), "y": .double(point.y)]
      }
    case .cgSize:
      var size = CGSize.zero
      if AXValueGetValue(value, .cgSize, &size) {
        return ["_type": "size", "width": .double(size.width), "height": .double(size.height)]
      }
    case .cgRect:
      var rect = CGRect.zero
      if AXValueGetValue(value, .cgRect, &rect) {
        return [
          "_type": "rect",
          "x": .double(rect.origin.x),
          "y": .double(rect.origin.y),
          "width": .double(rect.size.width),
          "height": .double(rect.size.height),
        ]
      }
    case .cfRange:
      var range = CFRange()
      if AXValueGetValue(value, .cfRange, &range) {
        return ["_type": "range", "location": .int(range.location), "length": .int(range.length)]
      }
    default:
      break
    }
    return ["_type": "AXValue"]
  }
}

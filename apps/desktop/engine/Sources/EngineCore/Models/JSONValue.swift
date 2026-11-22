enum JSONValue: Equatable {
  case null
  case bool(Bool)
  case int(Int)
  case double(Double)
  case string(String)
  case array([JSONValue])
  case object([String: JSONValue])

  var boolValue: Bool? {
    if case .bool(let value) = self {
      return value
    }
    return nil
  }

  var intValue: Int? {
    if case .int(let value) = self {
      return value
    }
    return nil
  }

  var doubleValue: Double? {
    switch self {
    case .double(let value):
      return value
    case .int(let value):
      return Double(value)
    default:
      return nil
    }
  }

  var stringValue: String? {
    if case .string(let value) = self {
      return value
    }
    return nil
  }

  var objectValue: [String: JSONValue]? {
    if case .object(let value) = self {
      return value
    }
    return nil
  }

  subscript(key: String) -> JSONValue? {
    objectValue?[key]
  }
}

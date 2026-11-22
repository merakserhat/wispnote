@propertyWrapper
struct NullEncoded<Wrapped: Encodable>: Encodable {
  var wrappedValue: Wrapped?

  init(wrappedValue: Wrapped?) {
    self.wrappedValue = wrappedValue
  }

  func encode(to encoder: Encoder) throws {
    var container = encoder.singleValueContainer()
    if let wrappedValue {
      try container.encode(wrappedValue)
    } else {
      try container.encodeNil()
    }
  }
}

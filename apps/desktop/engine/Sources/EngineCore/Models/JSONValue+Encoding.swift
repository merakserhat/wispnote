import Foundation

extension JSONValue {
  init<Value: Encodable>(encoding value: Value) throws {
    self = try JSONDecoder().decode(JSONValue.self, from: JSONEncoder().encode(value))
  }
}

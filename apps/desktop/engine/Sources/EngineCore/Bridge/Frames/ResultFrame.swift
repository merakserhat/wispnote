struct ResultFrame: Encodable {
  let type = "result"
  let id: JSONValue
  let ok: Bool
  @NullEncoded var data: JSONValue?
  @NullEncoded var error: String?
}

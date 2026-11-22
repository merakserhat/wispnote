struct ErrorFrame: Encodable {
  let type = "error"
  let message: String
}

struct ReadyFrame: Encodable {
  let type = "ready"
  let `protocol`: Int
  let version: String
  let pid: Int32
  let runtime: String
  let accessibility: Bool
  let tap: Bool
  @NullEncoded var tapError: String?
  let pdf: Bool
  let heartbeat: Double
  let triggers: [TriggerBinding]

  enum CodingKeys: String, CodingKey {
    case type
    case `protocol`
    case version
    case pid
    case runtime
    case accessibility
    case tap
    case tapError = "tap_error"
    case pdf
    case heartbeat
    case triggers
  }
}

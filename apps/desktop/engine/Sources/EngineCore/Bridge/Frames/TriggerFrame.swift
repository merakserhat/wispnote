struct TriggerFrame: Encodable {
  let type = "trigger"
  let trigger: Trigger
  let action: EngineAction
  let context: CaptureContext
  let canSync: Bool
  @NullEncoded var supersedes: TriggerBinding?

  enum CodingKeys: String, CodingKey {
    case type
    case trigger
    case action
    case context
    case canSync = "can_sync"
    case supersedes
  }
}

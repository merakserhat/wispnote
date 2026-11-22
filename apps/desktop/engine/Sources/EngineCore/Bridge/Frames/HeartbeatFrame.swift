struct HeartbeatFrame: Encodable {
  let type = "heartbeat"
  let seq: Int
  let uptime: Double
  let tap: Bool
}

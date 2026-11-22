struct ServeOptions {
  var heartbeatSeconds = 2.0
  var wantsTap = true

  init(arguments: [String]) throws {
    var remaining = arguments[...]

    while let argument = remaining.popFirst() {
      switch argument {
      case "--no-tap":
        wantsTap = false
      case "--heartbeat":
        guard let seconds = remaining.popFirst().flatMap(Double.init), seconds > 0 else {
          throw UsageError(message: "--heartbeat needs a number of seconds")
        }
        heartbeatSeconds = seconds
      default:
        throw UsageError(message: "unknown option \(argument)")
      }
    }
  }
}

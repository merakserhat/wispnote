struct CaptureOptions {
  var delaySeconds = 3.0

  init(arguments: [String]) throws {
    var remaining = arguments[...]

    while let argument = remaining.popFirst() {
      guard argument == "--delay" else {
        throw UsageError(message: "unknown option \(argument)")
      }
      guard let seconds = remaining.popFirst().flatMap(Double.init), seconds >= 0 else {
        throw UsageError(message: "--delay needs a number of seconds")
      }
      delaySeconds = seconds
    }
  }
}

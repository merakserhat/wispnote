import Dispatch

final class Heartbeat {
  private let timer: DispatchSourceTimer
  private var sequence = 0

  init(seconds: Double, beat: @escaping (Int) -> Void) {
    timer = DispatchSource.makeTimerSource(queue: DispatchQueue(label: "wispnote-heartbeat"))
    timer.schedule(deadline: .now() + seconds, repeating: seconds)
    timer.setEventHandler { [self] in
      sequence += 1
      beat(sequence)
    }
  }

  func start() {
    timer.resume()
  }
}

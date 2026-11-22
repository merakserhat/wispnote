import Darwin
import Dispatch

final class OrphanWatchdog {
  private let timer: DispatchSourceTimer

  init(seconds: Double, onOrphaned: @escaping () -> Void) {
    let parent = getppid()

    timer = DispatchSource.makeTimerSource(queue: DispatchQueue(label: "wispnote-orphan"))
    timer.schedule(deadline: .now() + seconds, repeating: seconds)
    timer.setEventHandler {
      let current = getppid()
      if current != parent || current == 1 {
        onOrphaned()
      }
    }
  }

  func start() {
    timer.resume()
  }
}

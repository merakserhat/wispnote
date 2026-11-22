import Foundation

final class CommandReader {
  private let onLine: (String) -> Void
  private let onEnd: () -> Void

  init(onLine: @escaping (String) -> Void, onEnd: @escaping () -> Void) {
    self.onLine = onLine
    self.onEnd = onEnd
  }

  func start() {
    let thread = Thread { [self] in
      while let line = readLine(strippingNewline: true) {
        onLine(line)
      }
      onEnd()
    }
    thread.name = "wispnote-stdin"
    thread.start()
  }
}

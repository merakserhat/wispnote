import Foundation

final class Channel {
  private let output: Int32
  private let lock = NSLock()
  private let encoder: JSONEncoder

  init() {
    output = dup(STDOUT_FILENO)
    dup2(STDERR_FILENO, STDOUT_FILENO)

    encoder = JSONEncoder()
    encoder.outputFormatting = [.withoutEscapingSlashes]
  }

  func send<Frame: Encodable>(_ frame: Frame) {
    guard var line = try? encoder.encode(frame) else {
      log("could not encode a \(Frame.self)")
      return
    }
    line.append(0x0A)

    lock.lock()
    defer { lock.unlock() }
    Channel.write(line, to: output)
  }

  func log(_ message: String) {
    Channel.write(Data("[wispnote] \(message)\n".utf8), to: STDERR_FILENO)
  }

  private static func write(_ data: Data, to descriptor: Int32) {
    data.withUnsafeBytes { buffer in
      var offset = 0
      while offset < buffer.count {
        let written = Darwin.write(descriptor, buffer.baseAddress! + offset, buffer.count - offset)
        if written > 0 {
          offset += written
        } else if errno != EINTR {
          return
        }
      }
    }
  }
}

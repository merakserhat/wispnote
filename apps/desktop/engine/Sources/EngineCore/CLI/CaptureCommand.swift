import Foundation

struct CaptureCommand {
  let options: CaptureOptions

  func run() throws -> Int32 {
    if options.delaySeconds > 0 {
      let notice = "Switch to the app you want to capture… (\(Int(options.delaySeconds))s)\n"
      FileHandle.standardError.write(Data(notice.utf8))
      Thread.sleep(forTimeInterval: options.delaySeconds)
    }

    let capture = ContextCapture(
      settings: EngineSettings(), ax: AXClient(), clipboard: Clipboard())
    let context = capture.capture()

    let encoder = JSONEncoder()
    encoder.outputFormatting = [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes]
    print(String(decoding: try encoder.encode(context), as: UTF8.self))
    return context.errors.isEmpty ? 0 : 1
  }
}

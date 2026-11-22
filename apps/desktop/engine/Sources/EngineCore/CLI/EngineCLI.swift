import Foundation

public enum EngineCLI {
  private static let usage = """
    usage: wispnote-engine <command>

      serve [--heartbeat <seconds>] [--no-tap]   run under a host, speaking JSON on stdio
      capture [--delay <seconds>]                capture the frontmost app as JSON
      doctor                                     check permissions
      --version
    """

  public static func run(arguments: [String]) -> Int32 {
    do {
      return try dispatch(arguments)
    } catch let error as UsageError {
      fail(error.message)
      return 2
    } catch {
      fail(error.localizedDescription)
      return 1
    }
  }

  private static func dispatch(_ arguments: [String]) throws -> Int32 {
    guard let command = arguments.first else {
      print(usage)
      return 2
    }

    let rest = Array(arguments.dropFirst())

    switch command {
    case "serve":
      return ServeCommand(options: try ServeOptions(arguments: rest)).run()
    case "capture":
      return try CaptureCommand(options: try CaptureOptions(arguments: rest)).run()
    case "doctor":
      return DoctorCommand().run()
    case "--version":
      print("WispNote engine \(EngineInfo.version)")
      return 0
    default:
      throw UsageError(message: "unknown command \(command)\n\n\(usage)")
    }
  }

  private static func fail(_ message: String) {
    FileHandle.standardError.write(Data("\(message)\n".utf8))
  }
}

import Foundation

enum CommandError: LocalizedError {
  case unknown(String)
  case missing(command: String, field: String)

  var errorDescription: String? {
    switch self {
    case .unknown(let command):
      return "unknown command '\(command)'"
    case .missing(let command, let field):
      return "\(command) needs `\(field)`"
    }
  }
}

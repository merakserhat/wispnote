import Foundation

enum MainThreadError: LocalizedError {
  case timedOut

  var errorDescription: String? {
    "main thread did not respond"
  }
}

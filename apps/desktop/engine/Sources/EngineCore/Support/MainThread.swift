import Foundation

struct MainThread {
  let timeout: TimeInterval

  func run<Value>(_ work: @escaping () throws -> Value) throws -> Value {
    if Thread.isMainThread {
      return try work()
    }

    var outcome: Result<Value, Error>?
    let done = DispatchSemaphore(value: 0)

    DispatchQueue.main.async {
      outcome = Result(catching: work)
      done.signal()
    }

    guard done.wait(timeout: .now() + timeout) == .success, let outcome else {
      throw MainThreadError.timedOut
    }
    return try outcome.get()
  }
}

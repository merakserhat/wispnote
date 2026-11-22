import Dispatch

struct Uptime {
  private let startedAt = DispatchTime.now()

  var seconds: Double {
    let elapsed = DispatchTime.now().uptimeNanoseconds - startedAt.uptimeNanoseconds
    return (Double(elapsed) / 100_000_000).rounded() / 10
  }
}

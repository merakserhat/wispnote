import Dispatch

struct LastGesture {
  let trigger: Trigger
  let context: CaptureContext
  let at: DispatchTime

  func isReusable(for supersedes: Trigger, within seconds: Double) -> Bool {
    let elapsed = DispatchTime.now().uptimeNanoseconds - at.uptimeNanoseconds
    return trigger == supersedes && Double(elapsed) / 1_000_000_000 <= seconds
  }
}

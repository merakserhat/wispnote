import Dispatch

struct MainScheduler: Scheduler {
  func schedule(after seconds: Double, _ work: @escaping () -> Void) -> ScheduledWork {
    let item = DispatchWorkItem(block: work)
    DispatchQueue.main.asyncAfter(deadline: .now() + seconds, execute: item)
    return ScheduledWork(onCancel: item.cancel)
  }
}

@testable import EngineCore

final class TestScheduler: Scheduler {
  private var now = 0.0
  private var nextId = 0
  private var pending: [Int: (due: Double, work: () -> Void)] = [:]

  func schedule(after seconds: Double, _ work: @escaping () -> Void) -> ScheduledWork {
    let id = nextId
    nextId += 1
    pending[id] = (now + seconds, work)
    return ScheduledWork { [weak self] in
      self?.pending[id] = nil
    }
  }

  func advance(by seconds: Double) {
    now += seconds
    let due = pending.filter { $0.value.due <= now }.sorted { $0.value.due < $1.value.due }
    for (id, entry) in due {
      pending[id] = nil
      entry.work()
    }
  }
}

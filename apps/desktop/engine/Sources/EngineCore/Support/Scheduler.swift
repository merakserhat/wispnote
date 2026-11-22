protocol Scheduler {
  func schedule(after seconds: Double, _ work: @escaping () -> Void) -> ScheduledWork
}

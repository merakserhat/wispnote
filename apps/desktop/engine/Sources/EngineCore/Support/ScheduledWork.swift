final class ScheduledWork {
  private let onCancel: () -> Void

  init(onCancel: @escaping () -> Void) {
    self.onCancel = onCancel
  }

  func cancel() {
    onCancel()
  }
}

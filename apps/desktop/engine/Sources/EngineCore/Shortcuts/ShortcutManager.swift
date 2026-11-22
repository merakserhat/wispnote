final class ShortcutManager {
  private static let tapUnavailable =
    "Could not create the event tap - grant Accessibility permission "
    + "to the app running WispNote, then restart it"

  private(set) var settings: EngineSettings
  private(set) var lastError: String?

  var onGesture: ((EngineAction, Trigger, Trigger?) -> Void)?
  var onKey: ((EngineKey) -> Void)?

  private lazy var machine = GestureStateMachine(
    scheduler: MainScheduler(),
    onTrigger: { [weak self] trigger, supersedes in
      self?.dispatch(trigger, supersedes: supersedes)
    },
    onKey: { [weak self] key in
      self?.onKey?(key)
    }
  )

  private lazy var tap = EventTap { [weak self] event in
    self?.machine.handle(event)
  }

  init(settings: EngineSettings) {
    self.settings = settings
    _ = machine
    _ = tap
  }

  var isRunning: Bool {
    tap.isRunning
  }

  func start() -> Bool {
    if tap.start() {
      lastError = nil
      return true
    }
    lastError = ShortcutManager.tapUnavailable
    return false
  }

  func stop() {
    machine.reset()
    tap.stop()
  }

  func reload(_ settings: EngineSettings) {
    self.settings = settings
  }

  func setHudUp(_ up: Bool) {
    machine.setHudUp(up)
  }

  private func dispatch(_ trigger: Trigger, supersedes: Trigger?) {
    let action = settings.action(for: trigger)
    if action == .unbound {
      return
    }

    let superseded = supersedes.flatMap { settings.action(for: $0) == .unbound ? nil : $0 }
    onGesture?(action, trigger, superseded)
  }
}

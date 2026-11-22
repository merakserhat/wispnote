struct EngineSettings {
  static let defaultTriggers: [Trigger: EngineAction] = [
    .controlShift: .showPanel,
    .controlShiftShift: .quickHighlight,
    .controlShiftHold: .unbound,
    .shiftControl: .quickNote,
    .shiftControlControl: .unbound,
    .shiftControlHold: .unbound,
  ]

  var triggers = EngineSettings.defaultTriggers
  var maxSelectionChars = 20_000
  var maxContextChars = 600
  var deepSearchSelection = true
  var clipboardFallback = true

  func action(for trigger: Trigger) -> EngineAction {
    triggers[trigger] ?? .unbound
  }

  var bindings: [TriggerBinding] {
    Trigger.allCases
      .map { TriggerBinding(trigger: $0, action: action(for: $0)) }
      .filter { $0.action != .unbound }
  }
}

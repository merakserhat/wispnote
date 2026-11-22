enum GestureMode {
  case control
  case shift

  func trigger(taps: Int, hold: Bool) -> Trigger? {
    switch (self, taps, hold) {
    case (.control, 1, false):
      return .controlShift
    case (.control, 2, false):
      return .controlShiftShift
    case (.control, 0, true):
      return .controlShiftHold
    case (.shift, 1, false):
      return .shiftControl
    case (.shift, 2, false):
      return .shiftControlControl
    case (.shift, 0, true):
      return .shiftControlHold
    default:
      return nil
    }
  }
}

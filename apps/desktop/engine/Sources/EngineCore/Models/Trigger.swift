enum Trigger: String, Codable, CaseIterable {
  case controlShift = "ctrl+shift"
  case controlShiftShift = "ctrl+shift+shift"
  case controlShiftHold = "ctrl+shift+hold"
  case shiftControl = "shift+ctrl"
  case shiftControlControl = "shift+ctrl+ctrl"
  case shiftControlHold = "shift+ctrl+hold"
}

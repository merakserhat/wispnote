enum GestureEvent {
  case flagsChanged(keycode: Int, flags: UInt64)
  case keyDown(keycode: Int, isRepeat: Bool)
  case interruption
  case tapDisabled
}

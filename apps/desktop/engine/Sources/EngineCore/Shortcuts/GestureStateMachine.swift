final class GestureStateMachine {
  private let scheduler: Scheduler
  private let onTrigger: (Trigger, Trigger?) -> Void
  private let onKey: (EngineKey) -> Void

  private var controlDown = false
  private var shiftDown = false

  private var mode: GestureMode?
  private var modeKeyUp = false
  private var taps = 0
  private var pressDirty = false
  private var holdFired = false
  private var tapTimer: ScheduledWork?
  private var holdTimer: ScheduledWork?

  private var hudUp = false
  private var loneControl = false

  init(
    scheduler: Scheduler,
    onTrigger: @escaping (Trigger, Trigger?) -> Void,
    onKey: @escaping (EngineKey) -> Void
  ) {
    self.scheduler = scheduler
    self.onTrigger = onTrigger
    self.onKey = onKey
  }

  func setHudUp(_ up: Bool) {
    hudUp = up
    if !up {
      loneControl = false
    }
  }

  func handle(_ event: GestureEvent) {
    switch event {
    case .tapDisabled:
      reset()
      controlDown = false
      shiftDown = false
    case .flagsChanged(let keycode, let flags):
      handleFlags(keycode: keycode, flags: flags)
    case .keyDown(let keycode, let isRepeat):
      if hudUp && keycode == KeyCode.escape && !isRepeat {
        onKey(.escape)
      }
      handleInterruption()
    case .interruption:
      handleInterruption()
    }
  }

  func reset() {
    cancelTimers()
    mode = nil
    modeKeyUp = false
    taps = 0
    pressDirty = false
    holdFired = false
    loneControl = false
  }

  private func handleInterruption() {
    if mode == nil {
      return
    }
    interrupt(pressInFlight: otherDown)
  }

  private func handleFlags(keycode: Int, flags: UInt64) {
    var control = controlDown && flags & ModifierFlag.control != 0
    var shift = shiftDown && flags & ModifierFlag.shift != 0

    if keycode == KeyCode.leftControl {
      control = flags & ModifierFlag.control != 0
    } else if keycode == KeyCode.leftShift {
      shift = flags & ModifierFlag.shift != 0
    }

    let isGestureKey = keycode == KeyCode.leftControl || keycode == KeyCode.leftShift
    let foreign = !isGestureKey || flags & ModifierFlag.foreign != 0

    advance(control: control, shift: shift, foreign: foreign)
    controlDown = control
    shiftDown = shift
  }

  private func advance(control: Bool, shift: Bool, foreign: Bool) {
    guard let mode else {
      let wasIdle = !controlDown && !shiftDown
      if wasIdle && !foreign && control != shift {
        self.mode = control ? .control : .shift
        loneControl = control && hudUp
      }
      return
    }

    let modeDown = mode == .control ? control : shift
    let otherIsDown = mode == .control ? shift : control
    let otherWasDown = mode == .control ? shiftDown : controlDown

    if foreign {
      interrupt(pressInFlight: otherIsDown || otherWasDown)
    }

    if otherIsDown && !otherWasDown {
      otherPressed()
    } else if otherWasDown && !otherIsDown {
      otherReleased(mode: mode)
    }

    if !modeDown {
      modeKeyUp = true
    }

    if !modeDown && !otherIsDown {
      exitMode()
    }
  }

  private var otherDown: Bool {
    switch mode {
    case .control:
      return shiftDown
    case .shift:
      return controlDown
    case nil:
      return false
    }
  }

  private func otherPressed() {
    loneControl = false
    tapTimer?.cancel()
    tapTimer = nil

    if pressDirty {
      return
    }
    holdTimer = scheduler.schedule(after: GestureTimings.holdThreshold) { [weak self] in
      self?.holdElapsed()
    }
  }

  private func otherReleased(mode: GestureMode) {
    holdTimer?.cancel()
    holdTimer = nil

    if pressDirty || holdFired {
      pressDirty = false
      holdFired = false
      taps = 0
      return
    }

    let previous = taps > 0 ? mode.trigger(taps: taps, hold: false) : nil
    taps += 1
    if let trigger = mode.trigger(taps: taps, hold: false) {
      onTrigger(trigger, previous)
    }

    if taps >= GestureTimings.maxTaps || modeKeyUp {
      taps = 0
      return
    }

    tapTimer = scheduler.schedule(after: GestureTimings.doubleTapWindow) { [weak self] in
      self?.closeTapWindow()
    }
  }

  private func holdElapsed() {
    guard let mode, otherDown, !pressDirty else {
      return
    }

    holdFired = true
    let previous = taps > 0 ? mode.trigger(taps: taps, hold: false) : nil
    if let trigger = mode.trigger(taps: taps, hold: true) {
      onTrigger(trigger, previous)
    }
  }

  private func closeTapWindow() {
    tapTimer = nil
    taps = 0
  }

  private func interrupt(pressInFlight: Bool) {
    cancelTimers()
    taps = 0
    holdFired = false
    pressDirty = pressInFlight
    loneControl = false
  }

  private func exitMode() {
    let wasLoneControl = loneControl && hudUp
    reset()
    if wasLoneControl {
      onKey(.control)
    }
  }

  private func cancelTimers() {
    tapTimer?.cancel()
    holdTimer?.cancel()
    tapTimer = nil
    holdTimer = nil
  }
}

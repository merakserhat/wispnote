import CoreGraphics

final class EventTap {
  private let onEvent: (GestureEvent) -> Void
  private var port: CFMachPort?
  private var source: CFRunLoopSource?

  private(set) var isRunning = false

  private static let eventTypes: [CGEventType] = [
    .flagsChanged, .keyDown, .leftMouseDown, .rightMouseDown, .otherMouseDown, .scrollWheel,
  ]

  init(onEvent: @escaping (GestureEvent) -> Void) {
    self.onEvent = onEvent
  }

  func start() -> Bool {
    if isRunning {
      return true
    }

    let mask = EventTap.eventTypes.reduce(CGEventMask(0)) { $0 | (1 << CGEventMask($1.rawValue)) }

    guard
      let port = CGEvent.tapCreate(
        tap: .cgSessionEventTap,
        place: .headInsertEventTap,
        options: .listenOnly,
        eventsOfInterest: mask,
        callback: { _, type, event, refcon in
          if let refcon {
            Unmanaged<EventTap>.fromOpaque(refcon).takeUnretainedValue().receive(type, event)
          }
          return Unmanaged.passUnretained(event)
        },
        userInfo: Unmanaged.passUnretained(self).toOpaque()
      )
    else {
      return false
    }

    let source = CFMachPortCreateRunLoopSource(nil, port, 0)
    CFRunLoopAddSource(CFRunLoopGetCurrent(), source, .commonModes)
    CGEvent.tapEnable(tap: port, enable: true)

    self.port = port
    self.source = source
    isRunning = true
    return true
  }

  func stop() {
    if let port {
      CGEvent.tapEnable(tap: port, enable: false)
    }
    if let source {
      CFRunLoopRemoveSource(CFRunLoopGetCurrent(), source, .commonModes)
    }
    port = nil
    source = nil
    isRunning = false
  }

  private func receive(_ type: CGEventType, _ event: CGEvent) {
    if type == .tapDisabledByTimeout || type == .tapDisabledByUserInput {
      if let port {
        CGEvent.tapEnable(tap: port, enable: true)
      }
      onEvent(.tapDisabled)
      return
    }

    if event.getIntegerValueField(.eventSourceUserData) == SyntheticEvent.tag {
      return
    }

    switch type {
    case .flagsChanged:
      onEvent(
        .flagsChanged(
          keycode: Int(event.getIntegerValueField(.keyboardEventKeycode)),
          flags: event.flags.rawValue
        )
      )
    case .keyDown:
      onEvent(
        .keyDown(
          keycode: Int(event.getIntegerValueField(.keyboardEventKeycode)),
          isRepeat: event.getIntegerValueField(.keyboardEventAutorepeat) != 0
        )
      )
    case .scrollWheel:
      if event.getIntegerValueField(.scrollWheelEventMomentumPhase) == 0 {
        onEvent(.interruption)
      }
    default:
      onEvent(.interruption)
    }
  }
}

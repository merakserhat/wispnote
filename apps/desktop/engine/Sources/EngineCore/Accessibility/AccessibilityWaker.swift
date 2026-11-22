import AppKit

final class AccessibilityWaker {
  private static let messagingTimeout: Float = 1.0

  private let ax: AXClient
  private let lock = NSLock()
  private var checked: [pid_t: Bool] = [:]
  private var observer: NSObjectProtocol?

  init(ax: AXClient) {
    self.ax = ax
  }

  func watchActivations() {
    if observer != nil {
      return
    }

    let workspace = NSWorkspace.shared
    observer = workspace.notificationCenter.addObserver(
      forName: NSWorkspace.didActivateApplicationNotification, object: nil, queue: nil
    ) { [weak self] notification in
      let application =
        notification.userInfo?[NSWorkspace.applicationUserInfoKey] as? NSRunningApplication
      if let application {
        self?.wakeInBackground(pid: application.processIdentifier)
      }
    }

    if let frontmost = workspace.frontmostApplication {
      wakeInBackground(pid: frontmost.processIdentifier)
    }
  }

  func wake(pid: pid_t) -> Bool {
    if pid <= 0 || pid == getppid() {
      return false
    }
    if let known = cached(pid) {
      return known
    }

    let element = ax.applicationElement(pid: pid)
    ax.setMessagingTimeout(element, seconds: AccessibilityWaker.messagingTimeout)

    let names = ax.attributeNames(element)
    if names.isEmpty {
      return false
    }

    let woken =
      names.contains(AXAttribute.manualAccessibility)
      && ax.setAttribute(element, AXAttribute.manualAccessibility, kCFBooleanTrue)

    lock.lock()
    checked[pid] = woken
    lock.unlock()
    return woken
  }

  private func cached(_ pid: pid_t) -> Bool? {
    lock.lock()
    defer { lock.unlock() }
    return checked[pid]
  }

  private func wakeInBackground(pid: pid_t) {
    let thread = Thread { [self] in
      _ = wake(pid: pid)
    }
    thread.name = "wispnote-ax-wake"
    thread.start()
  }
}

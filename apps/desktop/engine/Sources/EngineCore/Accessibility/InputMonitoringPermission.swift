import CoreGraphics

enum InputMonitoringPermission {
  static var isGranted: Bool {
    CGPreflightListenEventAccess()
  }

  static func request() {
    CGRequestListenEventAccess()
  }
}

import Foundation

enum FilePath {
  static func fromDocument(_ value: String?) -> String? {
    guard let value, !value.isEmpty else {
      return nil
    }

    if value.hasPrefix("file://") {
      let path = URLComponents(string: value)?.percentEncodedPath ?? pathAfterHost(value)
      let decoded = path.removingPercentEncoding ?? path
      return decoded.isEmpty ? nil : decoded
    }
    if value.hasPrefix("/") {
      return value
    }
    if value.hasPrefix("~") {
      return NSString(string: value).expandingTildeInPath
    }
    return nil
  }

  static func lastComponent(_ path: String) -> String {
    path.split(separator: "/", omittingEmptySubsequences: false).last.map(String.init) ?? path
  }

  static func directory(_ path: String) -> String {
    guard let slash = path.lastIndex(of: "/") else {
      return ""
    }
    return String(path[..<slash])
  }

  private static func pathAfterHost(_ value: String) -> String {
    let rest = value.dropFirst("file://".count)
    guard let slash = rest.firstIndex(of: "/") else {
      return ""
    }
    return String(rest[slash...])
  }
}

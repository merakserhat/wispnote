import Foundation

enum WebURL {
  private static let trackingParameters: Set = [
    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid",
    "mc_cid", "mc_eid", "ref", "source", "_ga", "igshid",
  ]
  private static let defaultPorts = ["http": 80, "https": 443]
  private static let queryValueCharacters = CharacterSet(
    charactersIn: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.-~ ")

  static func normalize(_ url: String?) -> String {
    let trimmed = (url ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
    guard var components = URLComponents(string: trimmed), let scheme = components.scheme else {
      return trimmed
    }

    components.scheme = scheme.lowercased()
    components.percentEncodedHost = components.percentEncodedHost?.lowercased()
    if components.port == defaultPorts[scheme.lowercased()] {
      components.port = nil
    }

    let query = cleanQuery(components.percentEncodedQuery ?? "")
    components.percentEncodedQuery = query.isEmpty ? nil : query
    components.fragment = nil

    var path = components.percentEncodedPath
    while path.count > 1 && path.hasSuffix("/") {
      path.removeLast()
    }
    components.percentEncodedPath = path.isEmpty ? "/" : path

    return components.string ?? trimmed
  }

  static func host(_ url: String?) -> String {
    let trimmed = (url ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
    guard let components = URLComponents(string: trimmed), let host = components.host else {
      return ""
    }

    var authority = host
    if let user = components.percentEncodedUser {
      let password = components.percentEncodedPassword.map { ":\($0)" } ?? ""
      authority = "\(user)\(password)@\(authority)"
    }
    if let port = components.port {
      authority += ":\(port)"
    }
    return authority.lowercased()
  }

  private static func cleanQuery(_ query: String) -> String {
    query.split(separator: "&", omittingEmptySubsequences: true)
      .map { pair -> (name: String, value: String) in
        let halves = pair.split(separator: "=", maxSplits: 1, omittingEmptySubsequences: false)
        return (decode(halves[0]), halves.count > 1 ? decode(halves[1]) : "")
      }
      .filter { !trackingParameters.contains($0.name.lowercased()) }
      .map { "\(encode($0.name))=\(encode($0.value))" }
      .joined(separator: "&")
  }

  private static func decode(_ text: Substring) -> String {
    let spaced = text.replacingOccurrences(of: "+", with: " ")
    return spaced.removingPercentEncoding ?? spaced
  }

  private static func encode(_ text: String) -> String {
    (text.addingPercentEncoding(withAllowedCharacters: queryValueCharacters) ?? text)
      .replacingOccurrences(of: " ", with: "+")
  }
}

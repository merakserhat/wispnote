import CryptoKit
import Foundation

enum StableHash {
  static func of(_ parts: String..., length: Int = 16) -> String {
    let joined = parts.joined(separator: "\u{1F}")
    let digest = SHA256.hash(data: Data(joined.utf8))
    return String(digest.map { String(format: "%02x", $0) }.joined().prefix(length))
  }
}

import Foundation

enum PdfDate {
  static func string(_ date: Date) -> String {
    let formatter = DateFormatter()
    formatter.locale = Locale(identifier: "en_US_POSIX")
    formatter.timeZone = TimeZone(identifier: "UTC")
    formatter.dateFormat = "'D:'yyyyMMddHHmmss'Z'"
    return formatter.string(from: date)
  }
}

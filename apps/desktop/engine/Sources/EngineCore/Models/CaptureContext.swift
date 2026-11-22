import Foundation

struct CaptureContext: Encodable {
  var timestamp = Timestamp.now()

  var appName = ""
  var bundleId = ""
  var pid: Int32 = 0

  var windowTitle = ""
  var elementRole = ""
  var elementSubrole = ""

  var selectedText = ""
  var selectionTruncated = false
  var contextBefore = ""
  var contextAfter = ""

  var sourceKind = SourceKind.app
  var sourceKey = ""
  var sourceTitle = ""
  @NullEncoded var url: String?
  @NullEncoded var filePath: String?

  @NullEncoded var pageNumber: Int?
  @NullEncoded var lineNumber: Int?
  @NullEncoded var section: String?

  var extras: [String: JSONValue] = [:]
  var errors: [String] = []

  var hasSelection: Bool {
    !selectedText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
  }

  var canSync: Bool {
    sourceKind == .pdf && filePath != nil
  }

  enum CodingKeys: String, CodingKey {
    case timestamp
    case appName = "app_name"
    case bundleId = "bundle_id"
    case pid
    case windowTitle = "window_title"
    case elementRole = "element_role"
    case elementSubrole = "element_subrole"
    case selectedText = "selected_text"
    case selectionTruncated = "selection_truncated"
    case contextBefore = "context_before"
    case contextAfter = "context_after"
    case sourceKind = "source_kind"
    case sourceKey = "source_key"
    case sourceTitle = "source_title"
    case url
    case filePath = "file_path"
    case pageNumber = "page_number"
    case lineNumber = "line_number"
    case section
    case extras
    case errors
  }
}

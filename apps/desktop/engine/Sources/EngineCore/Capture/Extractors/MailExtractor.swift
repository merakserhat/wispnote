import ApplicationServices
import Foundation

struct MailExtractor: SourceExtractor {
  private static let messageContentIdentifiers: Set = [
    "_MAIL_MESSAGE_CONTENT", "message_view", "_MAIL_MESSAGE_BODY",
  ]
  private static let prunedIdentifiers: Set = ["Mail.messageList", "MailboxesOutlineView"]
  private static let prunedRoles: Set = ["AXRow", "AXCell", "AXColumn"]
  private static let subjectExclusions = ["To:", "Cc:", "Bcc:", "From:"]
  private static let objectReplacement = "\u{FFFC}"
  private static let limits = AXTreeLimits(maxDepth: 14, maxNodes: 1500, timeBudget: 0.4)

  private static let matcher = SourceMatcher(bundleIds: ["com.apple.mail"])

  let name = "mail"

  func matches(_ context: CaptureContext) -> Bool {
    MailExtractor.matcher.matches(context)
  }

  func selectionScope(context: CaptureContext, ax: AXClient, elements: ElementBundle) -> AXTreeWalk?
  {
    messageRoot(ax: ax, window: elements.window).map { walk(ax: ax, root: $0.element) }
  }

  func extract(into context: inout CaptureContext, ax: AXClient, elements: ElementBundle) {
    context.sourceKind = .mail

    guard let root = messageRoot(ax: ax, window: elements.window) else {
      context.errors.append("mail: no window to read")
      applyFallbackIdentity(to: &context)
      return
    }
    if !root.isAnchored {
      context.errors.append("mail: message container not found; read the whole window")
    }

    let header = readHeader(ax: ax, root: root.element)
    let subject = subject(headerText: header.headerText, windowTitle: context.windowTitle)

    context.sourceTitle = subject ?? context.appName
    set(&context, "sender", header.sender)
    set(&context, "mailbox", header.mailbox)
    set(&context, "timestamp", header.timestamp)
    set(&context, "recipients", header.recipients)
    set(&context, "cc", header.cc)
    set(&context, "bcc", header.bcc)

    recordBodyLength(into: &context, ax: ax, root: root.element)

    let hasIdentity = [subject, header.sender, header.timestamp].contains { $0?.isEmpty == false }
    if hasIdentity {
      context.sourceKey =
        "mail:" + StableHash.of(header.sender ?? "", header.timestamp ?? "", subject ?? "")
    } else {
      context.errors.append("mail: no message header found")
      applyFallbackIdentity(to: &context)
    }
  }

  private func recordBodyLength(
    into context: inout CaptureContext, ax: AXClient, root: AXUIElement
  ) {
    let webArea = walk(ax: ax, root: root)
      .first { ax.string($0.element, AXAttribute.role) == AXRole.webArea }?.element
    guard let webArea, let body = TextMarkers(ax: ax).document(in: webArea) else {
      return
    }
    context.extras["body_length"] = .int(body.unicodeScalars.count)
    context.extras["body_source"] = "text_marker"
  }

  private func applyFallbackIdentity(to context: inout CaptureContext) {
    let identity =
      [context.bundleId, context.appName].first { !$0.isEmpty } ?? "com.apple.mail"
    context.sourceKey = "app:\(identity)"
    if context.sourceTitle.isEmpty {
      context.sourceTitle = context.appName.isEmpty ? "Mail" : context.appName
    }
  }

  private func readHeader(ax: AXClient, root: AXUIElement) -> MailHeader {
    var header = MailHeader()

    for node in walk(ax: ax, root: root) {
      let identifier = ax.string(node.element, AXAttribute.identifier) ?? ""
      if !identifier.hasPrefix("message") {
        continue
      }
      let value = ax.string(node.element, AXAttribute.value) ?? ""

      switch identifier {
      case "message.header.content":
        if !value.isEmpty {
          header.headerText = value
        }
      case "message.mailbox":
        if !value.isEmpty {
          header.mailbox = clean(value)
        }
      case "message.timestamp":
        if !value.isEmpty {
          header.timestamp = clean(value)
        }
      default:
        addAddress(clean(value), identifier: identifier, to: &header)
      }
    }
    return header
  }

  private func addAddress(_ address: String, identifier: String, to header: inout MailHeader) {
    if address.isEmpty {
      return
    }
    if identifier.hasPrefix("message.from.") {
      header.sender = header.sender ?? address
    } else if identifier.hasPrefix("message.to.") {
      header.recipients.append(address)
    } else if identifier.hasPrefix("message.cc.") {
      header.cc.append(address)
    } else if identifier.hasPrefix("message.bcc.") {
      header.bcc.append(address)
    }
  }

  private func clean(_ value: String) -> String {
    value.replacingOccurrences(of: MailExtractor.objectReplacement, with: "")
      .trimmingCharacters(in: .whitespacesAndNewlines)
  }

  private func subject(headerText: String?, windowTitle: String) -> String? {
    for line in (headerText ?? "").components(separatedBy: .newlines) {
      let cleaned = clean(line)
      if !cleaned.isEmpty && !MailExtractor.subjectExclusions.contains(where: cleaned.hasPrefix) {
        return cleaned
      }
    }

    if windowTitle.isEmpty {
      return nil
    }
    let title =
      windowTitle.range(of: " — ", options: .backwards).map {
        String(windowTitle[..<$0.lowerBound])
      }
      ?? windowTitle
    let trimmed = title.trimmingCharacters(in: .whitespacesAndNewlines)
    return trimmed.isEmpty ? nil : trimmed
  }

  private func messageRoot(ax: AXClient, window: AXUIElement?) -> MailMessageRoot? {
    guard let window else {
      return nil
    }
    let anchor = walk(ax: ax, root: window).first {
      MailExtractor.messageContentIdentifiers.contains(
        ax.string($0.element, AXAttribute.identifier) ?? "")
    }
    if let anchor {
      return MailMessageRoot(element: anchor.element, isAnchored: true)
    }
    return MailMessageRoot(element: window, isAnchored: false)
  }

  private func walk(ax: AXClient, root: AXUIElement) -> AXTreeWalk {
    AXTreeWalk(ax: ax, root: root, limits: MailExtractor.limits) { element in
      MailExtractor.prunedIdentifiers.contains(ax.string(element, AXAttribute.identifier) ?? "")
        || MailExtractor.prunedRoles.contains(ax.string(element, AXAttribute.role) ?? "")
    }
  }

  private func set(_ context: inout CaptureContext, _ key: String, _ value: String?) {
    if let value, !value.isEmpty {
      context.extras[key] = .string(value)
    }
  }

  private func set(_ context: inout CaptureContext, _ key: String, _ values: [String]) {
    if !values.isEmpty {
      context.extras[key] = .array(values.map(JSONValue.string))
    }
  }
}

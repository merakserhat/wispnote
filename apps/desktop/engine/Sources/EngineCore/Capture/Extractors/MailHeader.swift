struct MailHeader {
  var headerText: String?
  var sender: String?
  var mailbox: String?
  var timestamp: String?
  var recipients: [String] = []
  var cc: [String] = []
  var bcc: [String] = []
}

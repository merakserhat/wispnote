import Foundation

final class CommandRouter {
  private let commands: Commands
  private let channel: Channel
  private let workers: OperationQueue
  private let decoder = JSONDecoder()

  init(commands: Commands, channel: Channel, workerCount: Int) {
    self.commands = commands
    self.channel = channel

    workers = OperationQueue()
    workers.name = "wispnote-command"
    workers.maxConcurrentOperationCount = workerCount
  }

  func route(line: String) {
    let trimmed = line.trimmingCharacters(in: .whitespacesAndNewlines)
    if trimmed.isEmpty {
      return
    }

    let message: JSONValue
    do {
      message = try decoder.decode(JSONValue.self, from: Data(trimmed.utf8))
    } catch {
      channel.send(ErrorFrame(message: "bad JSON: \(error.localizedDescription)"))
      return
    }
    guard message.objectValue != nil else {
      channel.send(ErrorFrame(message: "expected a JSON object"))
      return
    }

    workers.addOperation { [self] in
      handle(message)
    }
  }

  func cancelAll() {
    workers.cancelAllOperations()
  }

  private func handle(_ message: JSONValue) {
    let command = message["cmd"]?.stringValue ?? ""
    let id = message["id"]

    do {
      let data = try commands.handle(command, message: message)
      reply(to: id, ok: true, data: data, error: nil)
    } catch {
      channel.log("command \(command) failed: \(error.localizedDescription)")
      reply(to: id, ok: false, data: nil, error: error.localizedDescription)
    }
  }

  private func reply(to id: JSONValue?, ok: Bool, data: JSONValue?, error: String?) {
    guard let id, id != .null else {
      return
    }
    channel.send(ResultFrame(id: id, ok: ok, data: data, error: error))
  }
}

import Foundation

final class Bridge {
  private let channel: Channel
  private let wantsTap: Bool
  private let heartbeatSeconds: Double

  private let uptime = Uptime()
  private let shortcuts: ShortcutManager
  private let capture: ContextCapture
  private let pdf = PdfTools()
  private let commands: Commands
  private let router: CommandRouter
  private var lastGesture: LastGesture?

  private var reader: CommandReader?
  private var heartbeat: Heartbeat?
  private var watchdog: OrphanWatchdog?

  private let stopLock = NSLock()
  private var isStopping = false

  init(channel: Channel, wantsTap: Bool, heartbeatSeconds: Double) {
    self.channel = channel
    self.wantsTap = wantsTap
    self.heartbeatSeconds = heartbeatSeconds

    let settings = EngineSettings()
    let clipboard = Clipboard()

    shortcuts = ShortcutManager(settings: settings)
    capture = ContextCapture(settings: settings, ax: AXClient(), clipboard: clipboard)
    commands = Commands(
      shortcuts: shortcuts,
      capture: capture,
      clipboard: clipboard,
      pdf: pdf,
      mainThread: MainThread(timeout: BridgeTimings.mainThreadTimeout),
      uptime: uptime
    )
    router = CommandRouter(
      commands: commands, channel: channel, workerCount: BridgeTimings.commandWorkers)

    shortcuts.onGesture = { [unowned self] action, trigger, supersedes in
      onGesture(action: action, trigger: trigger, supersedes: supersedes)
    }
    shortcuts.onKey = { key in
      channel.send(KeyFrame(key: key))
    }
    commands.requestStop = { [unowned self] in
      stopSoon()
    }
  }

  func start() {
    let tapStarted = wantsTap && shortcuts.start()
    if wantsTap && !tapStarted {
      channel.log(shortcuts.lastError ?? "event tap unavailable")
    }

    capture.watchActivations()

    channel.send(
      ReadyFrame(
        protocol: EngineInfo.protocolVersion,
        version: EngineInfo.version,
        pid: getpid(),
        runtime: EngineInfo.runtime,
        accessibility: AccessibilityPermission.isGranted(),
        tap: tapStarted,
        tapError: tapStarted ? nil : shortcuts.lastError,
        pdf: pdf.isAvailable,
        heartbeat: heartbeatSeconds,
        triggers: shortcuts.settings.bindings
      )
    )

    let heartbeat = Heartbeat(seconds: heartbeatSeconds) { [self] sequence in
      channel.send(
        HeartbeatFrame(seq: sequence, uptime: uptime.seconds, tap: shortcuts.isRunning)
      )
    }
    let watchdog = OrphanWatchdog(seconds: BridgeTimings.orphanCheckSeconds) { [self] in
      stop(reason: "host process died")
    }
    let reader = CommandReader(
      onLine: { [self] line in router.route(line: line) },
      onEnd: { [self] in stop(reason: "host closed stdin") }
    )

    heartbeat.start()
    watchdog.start()
    reader.start()

    self.heartbeat = heartbeat
    self.watchdog = watchdog
    self.reader = reader
  }

  func stop(reason: String) {
    stopLock.lock()
    let alreadyStopping = isStopping
    isStopping = true
    stopLock.unlock()

    if alreadyStopping {
      return
    }

    channel.log("shutting down (\(reason))")
    shortcuts.stop()
    router.cancelAll()
    _exit(0)
  }

  private func onGesture(action: EngineAction, trigger: Trigger, supersedes: Trigger?) {
    let note = supersedes.map { " (supersedes \($0.rawValue))" } ?? ""
    channel.log("trigger \(trigger.rawValue) -> \(action.rawValue)\(note)")

    let context = reusableContext(for: supersedes) ?? capture.capture()
    lastGesture = LastGesture(trigger: trigger, context: context, at: .now())

    channel.send(
      TriggerFrame(
        trigger: trigger,
        action: action,
        context: context,
        canSync: pdf.canSync(context),
        supersedes: supersedes.map {
          TriggerBinding(trigger: $0, action: shortcuts.settings.action(for: $0))
        }
      )
    )
  }

  private func reusableContext(for supersedes: Trigger?) -> CaptureContext? {
    guard let supersedes, let lastGesture else {
      return nil
    }
    let reusable = lastGesture.isReusable(
      for: supersedes, within: BridgeTimings.supersedeReuseSeconds)
    return reusable ? lastGesture.context : nil
  }

  private func stopSoon() {
    DispatchQueue.global().asyncAfter(deadline: .now() + BridgeTimings.shutdownDelaySeconds) {
      [self] in
      stop(reason: "host asked")
    }
  }
}

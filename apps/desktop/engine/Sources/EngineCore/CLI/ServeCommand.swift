import AppKit

struct ServeCommand {
  let options: ServeOptions

  func run() -> Int32 {
    signal(SIGPIPE, SIG_IGN)

    let bridge = Bridge(
      channel: Channel(),
      wantsTap: options.wantsTap,
      heartbeatSeconds: options.heartbeatSeconds
    )
    bridge.start()

    let application = NSApplication.shared
    application.setActivationPolicy(.prohibited)
    application.run()
    return 0
  }
}

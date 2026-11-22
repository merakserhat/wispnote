struct DoctorCommand {
  private static let accessibilityRemedy =
    "System Settings → Privacy & Security → Accessibility: grant it to the app "
    + "running the engine (Electron in dev), then restart it"

  func run() -> Int32 {
    print("WispNote engine \(EngineInfo.version)  ·  \(EngineInfo.runtime)\n")

    let granted = AccessibilityPermission.isGranted()
    print("  [\(granted ? "ok" : "!!")] Accessibility permission")
    if !granted {
      print("       → \(DoctorCommand.accessibilityRemedy)")
    }

    print(
      "\n" + (granted ? "Everything required is in place." : "Fix the items above, then re-run."))
    return granted ? 0 : 1
  }
}

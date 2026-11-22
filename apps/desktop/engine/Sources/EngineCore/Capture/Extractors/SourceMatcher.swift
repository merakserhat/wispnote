struct SourceMatcher {
  var bundleIds: Set<String> = []
  var bundlePrefixes: [String] = []
  var appNameHints: [String] = []

  func matches(_ context: CaptureContext) -> Bool {
    let bundle = context.bundleId.lowercased()
    if !bundle.isEmpty && bundleIds.contains(bundle) {
      return true
    }
    if !bundle.isEmpty && bundlePrefixes.contains(where: bundle.hasPrefix) {
      return true
    }
    let appName = context.appName.lowercased()
    return appNameHints.contains(where: appName.contains)
  }
}

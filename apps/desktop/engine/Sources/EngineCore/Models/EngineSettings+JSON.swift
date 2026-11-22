extension EngineSettings {
  init(json: [String: JSONValue]) {
    self.init()

    for (name, value) in json["triggers"]?.objectValue ?? [:] {
      guard let trigger = Trigger(rawValue: name) else {
        continue
      }
      triggers[trigger] = value.stringValue.flatMap(EngineAction.init(rawValue:)) ?? .unbound
    }

    maxSelectionChars = json["max_selection_chars"]?.intValue ?? maxSelectionChars
    maxContextChars = json["max_context_chars"]?.intValue ?? maxContextChars
    deepSearchSelection = json["deep_search_selection"]?.boolValue ?? deepSearchSelection
    clipboardFallback = json["clipboard_fallback"]?.boolValue ?? clipboardFallback
  }
}

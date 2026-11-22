protocol SourceExtractor {
  var name: String { get }

  func matches(_ context: CaptureContext) -> Bool
  func extract(into context: inout CaptureContext, ax: AXClient, elements: ElementBundle)
  func selectionScope(context: CaptureContext, ax: AXClient, elements: ElementBundle) -> AXTreeWalk?
  func surroundingText(context: CaptureContext, ax: AXClient, elements: ElementBundle)
    -> SurroundingText?
}

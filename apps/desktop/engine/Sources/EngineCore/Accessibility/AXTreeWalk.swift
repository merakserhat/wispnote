import ApplicationServices
import Foundation

struct AXTreeWalk: Sequence, IteratorProtocol {
  private let ax: AXClient
  private let limits: AXTreeLimits
  private let prune: ((AXUIElement) -> Bool)?

  private var queue: [AXTreeNode] = []
  private var head = 0
  private var visited: Set<AXUIElement> = []
  private var seen = 0
  private var deadline: TimeInterval?
  private var lastYielded: AXTreeNode?

  init(
    ax: AXClient,
    root: AXUIElement?,
    limits: AXTreeLimits = AXTreeLimits(),
    prune: ((AXUIElement) -> Bool)? = nil
  ) {
    self.ax = ax
    self.limits = limits
    self.prune = prune

    if let root {
      queue.append(AXTreeNode(element: root, depth: 0))
      visited.insert(root)
    }
  }

  mutating func next() -> AXTreeNode? {
    if deadline == nil {
      deadline = ProcessInfo.processInfo.systemUptime + limits.timeBudget
    }
    if let lastYielded {
      expand(lastYielded)
      self.lastYielded = nil
    }

    guard head < queue.count else {
      return nil
    }
    let node = queue[head]
    head += 1
    lastYielded = node
    return node
  }

  private mutating func expand(_ node: AXTreeNode) {
    seen += 1

    let outOfTime = ProcessInfo.processInfo.systemUptime > (deadline ?? 0)
    if node.depth >= limits.maxDepth || seen >= limits.maxNodes || outOfTime {
      return
    }
    if let prune, prune(node.element) {
      return
    }

    for child in ax.children(node.element) where visited.insert(child).inserted {
      queue.append(AXTreeNode(element: child, depth: node.depth + 1))
    }
  }
}

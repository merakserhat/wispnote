// swift-tools-version: 6.0

import PackageDescription

let package = Package(
  name: "wispnote-engine",
  platforms: [.macOS(.v13)],
  products: [
    .executable(name: "wispnote-engine", targets: ["wispnote-engine"])
  ],
  targets: [
    .executableTarget(
      name: "wispnote-engine",
      dependencies: ["EngineCore"]
    ),
    .target(name: "EngineCore"),
    .testTarget(
      name: "EngineCoreTests",
      dependencies: ["EngineCore"]
    ),
  ],
  swiftLanguageModes: [.v5]
)

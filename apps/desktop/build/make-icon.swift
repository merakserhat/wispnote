import AppKit
import SwiftUI

let tileColor = CGColor(red: 0x35 / 255, green: 0x2f / 255, blue: 0x2a / 255, alpha: 1)
let markColor = CGColor(red: 0xf7 / 255, green: 0xf7 / 255, blue: 0xf5 / 255, alpha: 1)

let canvas: CGFloat = 1024
let tile: CGFloat = 824
let tileRadius: CGFloat = 185.4
let markBox: CGFloat = tile * 76 / 128
let markStroke: CGFloat = 2.2

func render(pixels: Int) -> Data {
  let space = CGColorSpace(name: CGColorSpace.sRGB)!
  let context = CGContext(
    data: nil, width: pixels, height: pixels, bitsPerComponent: 8, bytesPerRow: 0, space: space,
    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!

  context.scaleBy(x: CGFloat(pixels) / canvas, y: CGFloat(pixels) / canvas)
  context.translateBy(x: 0, y: canvas)
  context.scaleBy(x: 1, y: -1)

  let inset = (canvas - tile) / 2
  let tileRect = CGRect(x: inset, y: inset, width: tile, height: tile)
  let tilePath = Path(roundedRect: tileRect, cornerRadius: tileRadius, style: .continuous).cgPath

  context.saveGState()
  context.setShadow(
    offset: CGSize(width: 0, height: -10 * CGFloat(pixels) / canvas),
    blur: 20 * CGFloat(pixels) / canvas,
    color: CGColor(gray: 0, alpha: 0.3))
  context.addPath(tilePath)
  context.setFillColor(tileColor)
  context.fillPath()
  context.restoreGState()

  let scale = markBox / 24
  context.translateBy(x: (canvas - markBox) / 2, y: (canvas - markBox) / 2)
  context.scaleBy(x: scale, y: scale)

  let mark = CGMutablePath()
  mark.move(to: CGPoint(x: 3, y: 7))
  mark.addCurve(
    to: CGPoint(x: 12, y: 17), control1: CGPoint(x: 7, y: 7), control2: CGPoint(x: 7, y: 17))
  mark.addCurve(
    to: CGPoint(x: 21, y: 7), control1: CGPoint(x: 17, y: 17), control2: CGPoint(x: 17, y: 7))

  context.addPath(mark)
  context.setStrokeColor(markColor)
  context.setLineWidth(markStroke)
  context.setLineCap(.round)
  context.setLineJoin(.round)
  context.strokePath()

  let image = NSBitmapImageRep(cgImage: context.makeImage()!)
  return image.representation(using: .png, properties: [:])!
}

let output = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
let iconset = output.appendingPathComponent("icon.iconset", isDirectory: true)
try FileManager.default.createDirectory(at: iconset, withIntermediateDirectories: true)

for points in [16, 32, 128, 256, 512] {
  try render(pixels: points).write(
    to: iconset.appendingPathComponent("icon_\(points)x\(points).png"))
  try render(pixels: points * 2).write(
    to: iconset.appendingPathComponent("icon_\(points)x\(points)@2x.png"))
}
try render(pixels: 1024).write(to: output.appendingPathComponent("icon.png"))

func renderTray(pixels: Int) -> Data {
  let space = CGColorSpace(name: CGColorSpace.sRGB)!
  let context = CGContext(
    data: nil, width: pixels, height: pixels, bitsPerComponent: 8, bytesPerRow: 0, space: space,
    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!

  let scale = CGFloat(pixels) / 24
  context.translateBy(x: 0, y: CGFloat(pixels))
  context.scaleBy(x: scale, y: -scale)

  let mark = CGMutablePath()
  mark.move(to: CGPoint(x: 3, y: 7))
  mark.addCurve(
    to: CGPoint(x: 12, y: 17), control1: CGPoint(x: 7, y: 7), control2: CGPoint(x: 7, y: 17))
  mark.addCurve(
    to: CGPoint(x: 21, y: 7), control1: CGPoint(x: 17, y: 17), control2: CGPoint(x: 17, y: 7))

  context.addPath(mark)
  context.setStrokeColor(CGColor(gray: 0, alpha: 1))
  context.setLineWidth(markStroke)
  context.setLineCap(.round)
  context.setLineJoin(.round)
  context.strokePath()

  let image = NSBitmapImageRep(cgImage: context.makeImage()!)
  return image.representation(using: .png, properties: [:])!
}

let tray = URL(fileURLWithPath: CommandLine.arguments[2], isDirectory: true)
try FileManager.default.createDirectory(at: tray, withIntermediateDirectories: true)
try renderTray(pixels: 18).write(to: tray.appendingPathComponent("trayTemplate.png"))
try renderTray(pixels: 36).write(to: tray.appendingPathComponent("trayTemplate@2x.png"))

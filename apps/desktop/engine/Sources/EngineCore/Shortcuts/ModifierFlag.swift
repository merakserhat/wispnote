enum ModifierFlag {
  static let control: UInt64 = 0x40000
  static let shift: UInt64 = 0x20000
  static let option: UInt64 = 0x80000
  static let command: UInt64 = 0x100000
  static let function: UInt64 = 0x800000
  static let rightShiftDevice: UInt64 = 0x4
  static let rightControlDevice: UInt64 = 0x2000

  static let foreign = option | command | function | rightShiftDevice | rightControlDevice
}

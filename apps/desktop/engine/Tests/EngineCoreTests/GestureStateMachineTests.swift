import XCTest

@testable import EngineCore

final class GestureStateMachineTests: XCTestCase {
  private var scheduler: TestScheduler!
  private var machine: GestureStateMachine!
  private var fired: [String] = []

  override func setUp() {
    scheduler = TestScheduler()
    fired = []
    machine = GestureStateMachine(
      scheduler: scheduler,
      onTrigger: { [unowned self] trigger, supersedes in
        fired.append(supersedes.map { "\(trigger.rawValue)<\($0.rawValue)" } ?? trigger.rawValue)
      },
      onKey: { [unowned self] key in
        fired.append("key:\(key.rawValue)")
      }
    )
  }

  private func control(_ down: Bool, shiftHeld: Bool = false) {
    let flags = (down ? ModifierFlag.control : 0) | (shiftHeld ? ModifierFlag.shift : 0)
    machine.handle(.flagsChanged(keycode: KeyCode.leftControl, flags: flags))
  }

  private func shift(_ down: Bool, controlHeld: Bool = false) {
    let flags = (down ? ModifierFlag.shift : 0) | (controlHeld ? ModifierFlag.control : 0)
    machine.handle(.flagsChanged(keycode: KeyCode.leftShift, flags: flags))
  }

  private func tapShiftInControlMode() {
    shift(true, controlHeld: true)
    shift(false, controlHeld: true)
  }

  func testTapFiresOnReleaseOfTheTappedKey() {
    control(true)
    shift(true, controlHeld: true)
    XCTAssertEqual(fired, [])

    shift(false, controlHeld: true)
    XCTAssertEqual(fired, ["ctrl+shift"])

    control(false)
    XCTAssertEqual(fired, ["ctrl+shift"])
  }

  func testSecondTapInsideTheWindowSupersedesTheFirst() {
    control(true)
    tapShiftInControlMode()
    scheduler.advance(by: 0.2)
    tapShiftInControlMode()

    XCTAssertEqual(fired, ["ctrl+shift", "ctrl+shift+shift<ctrl+shift"])
  }

  func testSecondTapAfterTheWindowIsANewTap() {
    control(true)
    tapShiftInControlMode()
    scheduler.advance(by: 0.3)
    tapShiftInControlMode()

    XCTAssertEqual(fired, ["ctrl+shift", "ctrl+shift"])
  }

  func testThirdTapStartsOver() {
    control(true)
    tapShiftInControlMode()
    tapShiftInControlMode()
    tapShiftInControlMode()

    XCTAssertEqual(fired, ["ctrl+shift", "ctrl+shift+shift<ctrl+shift", "ctrl+shift"])
  }

  func testHoldFiresAtTheThresholdAndNotOnRelease() {
    control(true)
    shift(true, controlHeld: true)
    scheduler.advance(by: 0.39)
    XCTAssertEqual(fired, [])

    scheduler.advance(by: 0.02)
    XCTAssertEqual(fired, ["ctrl+shift+hold"])

    shift(false, controlHeld: true)
    XCTAssertEqual(fired, ["ctrl+shift+hold"])
  }

  func testMirrorGesture() {
    shift(true)
    control(true, shiftHeld: true)
    control(false, shiftHeld: true)

    XCTAssertEqual(fired, ["shift+ctrl"])
  }

  func testReleaseOrderDoesNotMatter() {
    control(true)
    shift(true, controlHeld: true)
    control(false, shiftHeld: true)
    shift(false)

    XCTAssertEqual(fired, ["ctrl+shift"])
  }

  func testAnotherKeyCancelsThePressButNotTheMode() {
    control(true)
    shift(true, controlHeld: true)
    machine.handle(.keyDown(keycode: 0, isRepeat: false))
    shift(false, controlHeld: true)
    XCTAssertEqual(fired, [])

    tapShiftInControlMode()
    XCTAssertEqual(fired, ["ctrl+shift"])
  }

  func testAClickBetweenTapsBreaksTheDoubleTap() {
    control(true)
    tapShiftInControlMode()
    machine.handle(.interruption)
    tapShiftInControlMode()

    XCTAssertEqual(fired, ["ctrl+shift", "ctrl+shift"])
  }

  func testAForeignModifierCancelsThePress() {
    control(true)
    shift(true, controlHeld: true)
    machine.handle(
      .flagsChanged(
        keycode: 55,
        flags: ModifierFlag.control | ModifierFlag.shift | ModifierFlag.command
      )
    )
    shift(false, controlHeld: true)

    XCTAssertEqual(fired, [])
  }

  func testAGestureDoesNotStartWithAForeignModifierHeld() {
    machine.handle(.flagsChanged(keycode: 55, flags: ModifierFlag.command))
    machine.handle(
      .flagsChanged(
        keycode: KeyCode.leftControl, flags: ModifierFlag.command | ModifierFlag.control)
    )
    shift(true, controlHeld: true)
    shift(false, controlHeld: true)

    XCTAssertEqual(fired, [])
  }

  func testLoneControlIsAKeyOnlyWhileTheHudIsUp() {
    control(true)
    control(false)
    XCTAssertEqual(fired, [])

    machine.setHudUp(true)
    control(true)
    control(false)
    XCTAssertEqual(fired, ["key:ctrl"])
  }

  func testControlHeldBeforeTheHudCameUpIsNotALoneControl() {
    control(true)
    machine.setHudUp(true)
    control(false)

    XCTAssertEqual(fired, [])
  }

  func testControlFollowedByShiftIsNotALoneControl() {
    machine.setHudUp(true)
    control(true)
    tapShiftInControlMode()
    control(false)

    XCTAssertEqual(fired, ["ctrl+shift"])
  }

  func testEscapeIsAKeyOnlyWhileTheHudIsUpAndNotOnRepeat() {
    machine.handle(.keyDown(keycode: KeyCode.escape, isRepeat: false))
    XCTAssertEqual(fired, [])

    machine.setHudUp(true)
    machine.handle(.keyDown(keycode: KeyCode.escape, isRepeat: false))
    machine.handle(.keyDown(keycode: KeyCode.escape, isRepeat: true))
    XCTAssertEqual(fired, ["key:escape"])
  }

  func testADisabledTapForgetsThePressedKeys() {
    control(true)
    shift(true, controlHeld: true)
    machine.handle(.tapDisabled)
    shift(false, controlHeld: true)
    XCTAssertEqual(fired, [])

    control(false)
    control(true)
    tapShiftInControlMode()
    XCTAssertEqual(fired, ["ctrl+shift"])
  }
}

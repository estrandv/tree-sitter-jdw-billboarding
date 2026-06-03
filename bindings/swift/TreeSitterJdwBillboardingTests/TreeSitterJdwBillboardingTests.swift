import XCTest
import SwiftTreeSitter
import TreeSitterJdwBillboarding

final class TreeSitterJdwBillboardingTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_jdw_billboarding())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading JDW Billboarding Tree Sitter grammar")
    }
}

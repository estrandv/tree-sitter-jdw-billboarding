from unittest import TestCase

import tree_sitter
import tree_sitter_jdw_billboarding


class TestLanguage(TestCase):
    def test_can_load_grammar(self):
        try:
            tree_sitter.Language(tree_sitter_jdw_billboarding.language())
        except Exception:
            self.fail("Error loading JDW Billboarding Tree Sitter grammar")

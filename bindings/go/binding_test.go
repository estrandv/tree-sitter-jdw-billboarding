package tree_sitter_jdw_billboarding_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_jdw_billboarding "github.com/estrandv/tree-sitter-jdw-billboarding/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_jdw_billboarding.Language())
	if language == nil {
		t.Errorf("Error loading JDW Billboarding Tree Sitter grammar")
	}
}

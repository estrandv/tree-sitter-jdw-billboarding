/**
 * @file JDW Billboarding grammar for tree-sitter
 * @author estrandv <emil.strandvik@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

/*
  JDW Billboarding — see README.md

  Billboard is a LINE-BASED DSL that wraps Shuttle Notation. Each line is
  classified by its leading symbol into one of a handful of statement types.
  Track lines carry Shuttle note sequences, which are delegated to the
  `shuttle` parser via queries/injections.scm rather than re-parsed here.

  Whitespace model: spaces/tabs are token separators (in `extras`), but
  NEWLINES are significant line terminators (kept out of `extras`).
  Line continuation (`\` + newline) and comments (`# ...`, full-line or inline)
  are in `extras` so they disappear cleanly anywhere.

  Argument blobs like `amp0.5,sus2.0` are NOT valid standalone Shuttle (commas
  are only legal after `:`), so they are parsed natively here as `arg_list`
  instead of being injected.
*/

module.exports = grammar({
  name: "jdw_billboarding",

  extras: ($) => [/[ \t]/, /\\\r?\n/],

  rules: {
    source_file: ($) => seq(repeat($._line), optional($._statement)),

    // Full-line `# ...` comments  (NOT in extras — handled explicitly in _line
    // so `#` inside shuttle content like `f#5` isn't consumed as a comment).
    comment: () => /#[^\n]*/,

    _line: ($) => seq(optional($.comment), optional($._statement), optional($.comment), $._newline),
    _newline: () => /\r?\n/,

    _statement: ($) =>
      choice(
        $.group_filter,
        $.synth_header,
        $.effect_definition,
        $.default_statement,
        $.command,
        $.track,
      ),

    // >>> group1 group2 ...
    group_filter: ($) => seq(">>>", repeat1($.group_name)),

    // [*]@[prefix]name[:group] [args]
    synth_header: ($) =>
      seq(
        optional($.selected),
        "@",
        $.instrument_name,
        optional(seq(":", $.group_name)),
        optional($.arg_list),
        optional($.additional_config),
      ),
    selected: () => "*",

    // €type:id [args]
    effect_definition: ($) =>
      seq(
        "€",
        $.effect_type,
        ":",
        $.effect_id,
        optional($.arg_list),
      ),

    // DEFAULT args
    default_statement: ($) => seq("DEFAULT", $.arg_list),

    // [COMMAND_TYPE] /address arg*
    command: ($) =>
      seq(optional($.command_type), $.address, repeat($.command_arg)),
    command_type: () =>
      choice("COMMAND", "UPDATE_COMMAND", "QUEUE_COMMAND"),
    address: () => /\/[A-Za-z0-9_]+/,
    command_arg: () => token(prec(-1, /[^\s#][^\s#]*/)),

    // [<group[;args]>] shuttle_sequence
    track: ($) =>
      seq(optional($.track_metadata), $.shuttle_content),
    track_metadata: ($) =>
      seq(
        "<",
        $.group_override,
        optional(seq(";", $.arg_list)),
        ">",
      ),
    group_override: () => /[A-Za-z_][A-Za-z0-9_]*/,
    // Opaque rest-of-line Shuttle sequence; highlighted via injection.
    // Must not start with a reserved leading symbol (handled by classification).
    // A trailing `\`-newline continues the sequence onto the next line.
    // Note: `#` IS allowed inside shuttle content (e.g. `f#5`). Full-line `#`
    // comments are handled by the `comment` rule in `_line`, not by extras.
    shuttle_content: () =>
      token(prec(-2, /[^\s<>@/€]([^\n]|\\\r?\n)*/)),

    // Comma-separated argument list (Shuttle arg syntax, sans the leading ':').
    arg_list: ($) => seq($.arg, repeat(seq(",", $.arg))),
    arg: ($) =>
      seq(
        optional($.arg_name),
        optional($.operator),
        $.number,
        optional($.ref),
      ),
    operator: () => choice("+", "-", "*", "="),
    arg_name: () => /[A-Za-z_]+/,
    ref: () => /[A-Za-z_]+/,
    number: () => /[0-9]+(\.[0-9]+)?/,

    // Sampler pad config / trailing header data: opaque rest-of-line.
    additional_config: () => token(prec(-1, /[^\n#]+/)),

    instrument_name: () => /[A-Za-z_][A-Za-z0-9_]*/,
    group_name: () => /[A-Za-z_][A-Za-z0-9_]*/,
    effect_type: () => /[A-Za-z_][A-Za-z0-9_]*/,
    effect_id: () => /[A-Za-z0-9_]+/,
  },
});

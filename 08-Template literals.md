8. Template literals
---
* 8.1. Overview
* 8.2. Introduction
  * 8.2.1. Template literals
  * 8.2.2. Escaping in template literals
  * 8.2.3. Line terminators in template literals are always LF (\n)
  * 8.2.4. Tagged template literals
* 8.3. Examples of using tagged template literals
  * 8.3.1. Raw strings
  * 8.3.2. Shell commands
  * 8.3.3. Byte strings
  * 8.3.4. HTTP requests
  * 8.3.5. More powerful regular expressions
  * 8.3.6. Query languages
  * 8.3.7. React JSX via tagged templates
  * 8.3.8. Facebook GraphQL
  * 8.3.9. Text localization (L10N)
  * 8.3.10. Text templating via untagged template literals
  * 8.3.11. A tag function for HTML templating
* 8.4. Implementing tag functions
  * 8.4.1. Number of template strings versus number of substitutions
  * 8.4.2. Escaping in tagged template literals: cooked versus raw
  * 8.4.3. Example: String.raw
  * 8.4.4. Example: implementing a tag function for HTML templating
  * 8.4.5. Example: assembling regular expressions
* 8.5. FAQ: template literals and tagged template literals
  * 8.5.1. Where do template literals and tagged template literals come from?
  * 8.5.2. What is the difference between macros and tagged template literals?
  * 8.5.3. Can I load a template literal from an external source?
  * 8.5.4. Why are backticks the delimiters for template literals?
  * 8.5.5. Weren’t template literals once called template strings?

---

### 8.1 Overview

ES6 has two new kinds of literals: template literals and tagged template literals. These two literals have similar names and look similar, but they are quite different. It is therefore important to distinguish:

* Template literals (code): multi-line string literals that support interpolation
* Tagged template literals (code): function calls
* Web templates (data): HTML with blanks to be filled in

Template literals are string literals that can stretch across multiple lines and include interpolated expressions (inserted via ${···}):

        const firstName = 'Jane';
        console.log(`Hello ${firstName}!
        How are you
        today?`);

        // Output:
        // Hello Jane!
        // How are you
        // today?

Tagged template literals (short: tagged templates) are created by mentioning a function before a template literal:

        > String.raw`A \tagged\ template`
        'A \\tagged\\ template'

Tagged templates are function calls. In the previous example, the method String.raw is called to produce the result of the tagged template.

### 8.2 Introduction

Literals are syntactic constructs that produce values. Examples include string literals (which produce strings) and regular expression literals (which produce regular expression objects). ECMAScript 6 has two new literals:

* Template literals are string literals with support for interpolation and multiple lines.
* Tagged template literals (short: tagged templates): are function calls whose parameters are provided via template literals.

It is important to keep in mind that the names of template literals and tagged templates are slightly misleading. They have nothing to do with templates, as often used in web development: text files with blanks that can be filled in via (e.g.) JSON data.

### 8.2.1 Template literals

A template literal is a new kind of string literal that can span multiple lines and interpolate expressions (include their results). For example:

模板字面量是一种新的字符串自变量 支持多行和插值表达式

        const firstName = 'Jane';
        console.log(`Hello ${firstName}!
        How are you
        today?`);

        // Output:
        // Hello Jane!
        // How are you
        // today?

The literal itself is delimited by backticks (`), the interpolated expressions inside the literal are delimited by ${ and }. Template literals always produce strings.

用反引号来界定 插值用${}

### 8.2.2 Escaping in template literals
### 模板字面量的转义

The backslash is used for escaping inside template literals.

\ 用来转义模板字面量

It enables you to mention backticks and ${ inside template literals:

          > `\``
          '`'

          > `$` // OK
          '$'

          > `${`
          SyntaxError
          > `\${`
          '${'
          > `\${}`
          '${}'

Other than that, the backslash works like in string literals:

          > `\\`
          '\\'
          > `\n`
          '\n'
          > `\u{58}`
          'X'

### 8.2.3 Line terminators in template literals are always LF (\n)
### 模板字面量用\n 换行

Common ways of terminating lines are:

* Line feed (LF, \n, U+000A): used by Unix (incl. current macOS)

* Carriage return (CR, \r, U+000D): used by the old Mac OS.

* CRLF (\r\n): used by Windows.

All of these line terminators are normalized to LF in template literals. That is, the following code logs true on all platforms:

          const str = `BEFORE
          AFTER`;
          console.log(str === 'BEFORE\nAFTER'); // true

<img src="./leanpub_gears.png" width="60" >Spec: line terminators in template literals

In the ECMAScript specification, Sect. “Static Semantics: TV and TRV” defines how line terminators are to be interpreted in template literals:

The TRV of LineTerminatorSequence :: <LF> is the code unit value 0x000A.

The TRV of LineTerminatorSequence :: <CR> is the code unit value 0x000A.

The TRV of LineTerminatorSequence :: <CR><LF> is the sequence consisting of the code unit value 0x000A

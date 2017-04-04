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


### 8.2.4 Tagged template literals

The following is a tagged template literal (short: tagged template):

tagFunction`Hello ${firstName} ${lastName}!`

Putting a template literal after an expression triggers a function call, similar to how a parameter list (comma-separated values in parentheses) triggers a function call. The previous code is equivalent to the following function call (in reality, first parameter is more than just an Array, but that is explained later).

tagFunction(['Hello ', ' ', '!'], firstName, lastName)

Thus, the name before the content in backticks is the name of a function to call, the tag function. The tag function receives two different kinds of data:

* Template strings such as 'Hello '.
* Substitutions such as firstName (delimited by ${}). A substitution can be any expression.

Template strings are known statically (at compile time), substitutions are only known at runtime. The tag function can do with its parameters as it pleases: It can completely ignore the template strings, return values of any type, etc.

Additionally, tag functions get two versions of each template string:

* A “raw” version in which backslashes are not interpreted (`\n` becomes '\\n', a string of length 2)
* A “cooked” version in which backslashes are special (`\n` becomes a string with just a newline in it).

That allows String.raw (which is explained later) to do its work:

          > String.raw`\n` === '\\n'
          true


### 8.3 Examples of using tagged template literals

Tagged template literals allow you to implement custom embedded sub-languages (which are sometimes called domain-specific languages) with little effort, because JavaScript does much of the parsing for you. You only have to write a function that receives the results.

Let’s look at examples. Some of them are inspired by the original proposal for template literals, which refers to them via their old name, quasi-literals.


### 8.3.1 Raw strings

ES6 includes the tag function String.raw for raw strings, where backslashes have no special meaning:

        const str = String.raw`This is a text
        with multiple lines.
        Escapes are not interpreted,
        \n is not a newline.`;

This is useful whenever you need to create strings that have backslashes in them. For example:

        function createNumberRegExp(english) {
            const PERIOD = english ? String.raw`\.` : ','; // (A)
            return new RegExp(`[0-9]+(${PERIOD}[0-9]+)?`);
        }

In line A, String.raw enables us to write the backslash as we would in a regular expression literal. With normal string literals, we have to escape twice: First, we need to escape the dot for the regular expression. Second, we need to escape the backslash for the string literal.

### 8.3.2 Shell commands

        const proc = sh`ps ax | grep ${pid}`;
        (Source: David Herman)

### 8.3.3 Byte strings

        const buffer = bytes`455336465457210a`;
        (Source: David Herman)

### 8.3.4 HTTP requests

        POST`http://foo.org/bar?a=${a}&b=${b}
             Content-Type: application/json
             X-Credentials: ${credentials}

             { "foo": ${foo},
               "bar": ${bar}}
             `
             (myOnReadyStateChangeHandler);
        (Source: Luke Hoban)

### 8.3.5 More powerful regular expressions

Steven Levithan has given [an example](https://gist.github.com/4222600) of how tagged template literals could be used for his regular expression library [XRegExp](http://xregexp.com/).

XRegExp is highly recommended if you are working with regular expressions. You get many advanced features, but there is only a small performance penalty – once at creation time – because XRegExp compiles its input to native regular expressions.

Without tagged templates, you write code such as the following:

          var parts = '/2015/10/Page.html'.match(XRegExp(
            '^ # match at start of string only \n' +
            '/ (?<year> [^/]+ ) # capture top dir name as year \n' +
            '/ (?<month> [^/]+ ) # capture subdir name as month \n' +
            '/ (?<title> [^/]+ ) # capture base name as title \n' +
            '\\.html? $ # .htm or .html file ext at end of path ', 'x'
          ));

          console.log(parts.year); // 2015

We can see that XRegExp gives us named groups (year, month, title) and the x flag. With that flag, most whitespace is ignored and comments can be inserted.

There are two reasons that string literals don’t work well here. First, we have to type every regular expression backslash twice, to escape it for the string literal. Second, it is cumbersome to enter multiple lines.

Instead of adding strings, you can also continue a string literal in the next line if you end the current line with a backslash. But that still involves much visual clutter, especially because you still need the explicit newline via \n at the end of each line.

        var parts = '/2015/10/Page.html'.match(XRegExp(
          '^ # match at start of string only \n\
          / (?<year> [^/]+ ) # capture top dir name as year \n\
          / (?<month> [^/]+ ) # capture subdir name as month \n\
          / (?<title> [^/]+ ) # capture base name as title \n\
          \\.html? $ # .htm or .html file ext at end of path ', 'x'
        ));

Problems with backslashes and multiple lines go away with tagged templates:

        var parts = '/2015/10/Page.html'.match(XRegExp.rx`
            ^ # match at start of string only
            / (?<year> [^/]+ ) # capture top dir name as year
            / (?<month> [^/]+ ) # capture subdir name as month
            / (?<title> [^/]+ ) # capture base name as title
            \.html? $ # .htm or .html file ext at end of path
        `);


Additionally, tagged templates let you insert values v via ${v}. I’d expect a regular expression library to escape strings and to insert regular expressions verbatim. For example:

          var str   = 'really?';
          var regex = XRegExp.rx`(${str})*`;
          This would be equivalent to

          var regex = XRegExp.rx`(really\?)*`;


### 8.3.6 Query languages

Example:

          $`a.${className}[href*='//${domain}/']`

This is a DOM query that looks for all <a> tags whose CSS class is className and whose target is a URL with the given domain. The tag function $ ensures that the arguments are correctly escaped, making this approach safer than manual string concatenation.


### 8.3.7 React JSX via tagged templates

Facebook React is “a JavaScript library for building user interfaces”. It has the optional language extension JSX that enables you to build virtual DOM trees for user interfaces. This extension makes your code more concise, but it is also non-standard and breaks compatibility with the rest of the JavaScript ecosystem.

The library t7.js provides an alternative to JSX and uses templates tagged with t7:

        t7.module(function(t7) {
          function MyWidget(props) {
            return t7`
              <div>
                <span>I'm a widget ${ props.welcome }</span>
              </div>
            `;
          }

          t7.assign('Widget', MyWidget);

          t7`
            <div>
              <header>
                <Widget welcome="Hello world" />
              </header>
            </div>
          `;
        });


In “Why not Template Literals?”, the React team explains why they opted not to use template literals. One challenge is accessing components inside tagged templates. For example, MyWidget is accessed from the second tagged template in the previous example. One verbose way of doing so would be:

        <${MyWidget} welcome="Hello world" />

Instead, t7.js uses a registry which is filled via t7.assign(). That requires extra configuration, but the template literals look nicer; especially if there is both an opening and a closing tag.

### 8.3.8 Facebook GraphQL

Facebook Relay is a “JavaScript framework for building data-driven React applications”. One of its parts is the query language GraphQL whose queries can be created via templates tagged with Relay.QL. For example (borrowed from the Relay homepage):

        class Tea extends React.Component {
          render() {
            var {name, steepingTime} = this.props.tea;
            return (
              <li key={name}>
                {name} (<em>{steepingTime} min</em>)
              </li>
            );
          }
        }
        Tea = Relay.createContainer(Tea, {
          fragments: { // (A)
            tea: () => Relay.QL`
              fragment on Tea {
                name,
                steepingTime,
              }
            `,
          },
        });

        class TeaStore extends React.Component {
          render() {
            return <ul>
              {this.props.store.teas.map(
                tea => <Tea tea={tea} />
              )}
            </ul>;
          }
        }
        TeaStore = Relay.createContainer(TeaStore, {
          fragments: { // (B)
            store: () => Relay.QL`
              fragment on Store {
                teas { ${Tea.getFragment('tea')} },
              }
            `,
          },
        });


The objects starting in line A and line B define fragments, which are defined via callbacks that return queries. The result of fragment tea is put into this.props.tea. The result of fragment store is put into this.props.store.

This is the data that the queries operates on:

        const STORE = {
          teas: [
            {name: 'Earl Grey Blue Star', steepingTime: 5},
            ···
          ],
        };


This data is wrapped in an instance of GraphQLSchema, where it gets the name Store (as mentioned in fragment on Store).

### 8.3.9 Text localization (L10N) 

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

This section describes a simple approach to text localization that supports different languages and different locales (how to format numbers, time, etc.). Given the following message.

          alert(msg`Welcome to ${siteName}, you are visitor
                    number ${visitorNumber}:d!`);

The tag function msg would work as follows.

First, The literal parts are concatenated to form a string that can be used to look up a translation in a table. The lookup string for the previous example is:

      'Welcome to {0}, you are visitor number {1}!'

This lookup string could, for example, be mapped to a German translation::

      'Besucher Nr. {1}, willkommen bei {0}!'

The English “translation” would be the same as the lookup string.

Second, the result from the lookup is used to display the substitutions. Because a lookup result includes indices, it can rearrange the order of the substitutions. That has been done in German, where the visitor number comes before the site name. How the substitutions are formatted can be influenced via annotations such as :d. This annotation means that a locale-specific decimal separator should be used for visitorNumber. Thus, a possible English result is:

Welcome to ACME Corp., you are visitor number 1,300!
In German, we have results such as:

Besucher Nr. 1.300, willkommen bei ACME Corp.!

### 8.3.10 Text templating via untagged template literals

Let’s say we want to create HTML that displays the following data in a table:

        const data = [
            { first: '<Jane>', last: 'Bond' },
            { first: 'Lars', last: '<Croft>' },
        ];

As explained previously, template literals are not templates:

* A template literal is code that is executed immediately.
* A template is text with holes that you can fill with data.

A template is basically a function: data in, text out. And that description gives us a clue how we can turn a template literal into an actual template. Let’s implement a template tmpl as a function that maps an Array addrs to a string:

        const tmpl = addrs => `
            <table>
            ${addrs.map(addr => `
                <tr><td>${addr.first}</td></tr>
                <tr><td>${addr.last}</td></tr>
            `).join('')}
            </table>
        `;
        console.log(tmpl(data));
        // Output:
        // <table>
        //
        //     <tr><td><Jane></td></tr>
        //     <tr><td>Bond</td></tr>
        //
        //     <tr><td>Lars</td></tr>
        //     <tr><td><Croft></td></tr>
        //
        // </table>

The outer template literal provides the bracketing <table> and </table>. Inside, we are embedding JavaScript code that produces a string by joining an Array of strings. The Array is created by mapping each address to two table rows. Note that the plain text pieces <Jane> and <Croft> are not properly escaped. How to do that via a tagged template is explained in the next section.

### 8.3.10.1 Should I use this technique in production code?

This is a useful quick solution for smaller templating tasks. For larger tasks, you may want more powerful solutions such as the templating engine [Handlebars.js](http://handlebarsjs.com/) or the JSX syntax used in React.

Acknowledgement: This approach to text templating is based on [an idea](https://mail.mozilla.org/pipermail/es-discuss/2012-August/024328.html) by Claus Reinke.

### 8.3.11 A tag function for HTML templating

Compared to using untagged templates for HTML templating, like we did in the previous section, tagged templates bring two advantages:

* They can escape characters for us if we prefix ${} with an exclamation mark. That is needed for the names, which contain characters that need to be escaped (<Jane>).

* They can automatically join() Arrays for us, so that we don’t have to call that method ourselves.


Then the code for the template looks as follows. The name of the tag function is html:


        const tmpl = addrs => html`
            <table>
            ${addrs.map(addr => html`
                <tr><td>!${addr.first}</td></tr>
                <tr><td>!${addr.last}</td></tr>
            `)}
            </table>
        `;
        const data = [
            { first: '<Jane>', last: 'Bond' },
            { first: 'Lars', last: '<Croft>' },
        ];
        console.log(tmpl(data));
        // Output:
        // <table>
        //
        //     <tr><td>&lt;Jane&gt;</td></tr>
        //     <tr><td>Bond</td></tr>
        //
        //     <tr><td>Lars</td></tr>
        //     <tr><td>&lt;Croft&gt;</td></tr>
        //
        // </table>


Note that the angle brackets around Jane and Croft are escaped, whereas those around tr and td aren’t.

If you prefix a substitution with an exclamation mark (!${addr.first}) then it will be HTML-escaped. The tag function checks the text preceding a substitution in order to determine whether to escape or not.

An implementation of html [is shown later.](http://exploringjs.com/es6/ch_template-literals.html#sec_html-tag-function-implementation)


### 8.4 Implementing tag functions

The following is a tagged template literal:

tagFunction`lit1\n${subst1} lit2 ${subst2}`
This literal triggers (roughly) the following function call:

tagFunction(['lit1\n',  ' lit2 ', ''], subst1, subst2)
The exact function call looks more like this:

// Globally: add template object to per-realm template map

        {
            // “Cooked” template strings: backslash is interpreted
            const templateObject = ['lit1\n',  ' lit2 ', ''];
            // “Raw” template strings: backslash is verbatim
            templateObject.raw   = ['lit1\\n', ' lit2 ', ''];

            // The Arrays with template strings are frozen
            Object.freeze(templateObject.raw);
            Object.freeze(templateObject);

            __templateMap__[716] = templateObject;
        }

        // In-place: invocation of tag function

tagFunction(__templateMap__[716], subst1, subst2)

There are two kinds of input that the tag function receives:

* Template strings (first parameter): the static parts of tagged templates that don’t change (e.g. ' lit2 '). A template object stores two versions of the template strings:

  * Cooked: with escapes such as \n interpreted. Stored in templateObject[0] etc.
  * Raw: with uninterpreted escapes. Stored in templateObject.raw[0] etc.

* Substitutions (remaining parameters): the values that are embedded inside template literals via ${} (e.g. subst1). Substitutions are dynamic, they can change with each invocation.

The idea behind a global template object is that the same tagged template might be executed multiple times (e.g. in a loop or a function). The template object enables the tag function to cache data from previous invocations: It can put data it derived from input kind #1 (template strings) into the object, to avoid recomputing it. Caching happens per realm (think frame in a browser). That is, there is one template object per call site and realm.

**Tagged template literals in the spec**

[A section on tagged template](http://www.ecma-international.org/ecma-262/6.0/#sec-tagged-templates)literals explains how they are interpreted as function calls. A [separate section](http://www.ecma-international.org/ecma-262/6.0/#sec-template-literals-runtime-semantics-argumentlistevaluation) explains how a template literal is turned into a list of arguments: the template object and the substitutions.

### 8.4.1 Number of template strings versus number of substitutions

Let’s use the following tag function to explore how many template strings there are compared to substitutions.

        function tagFunc(templateObject, ...substs) {
            return { templateObject, substs };
        }

The number of template strings is always one plus the number of substitutions. In other words: every substitution is always surrounded by two template strings.

templateObject.length === substs.length + 1

If a substitution is first in a literal, it is prefixed by an empty template string:

        > tagFunc`${'subst'}xyz`
        { templateObject: [ '', 'xyz' ], substs: [ 'subst' ] }
        If a substitution is last in a literal, it is suffixed by an empty template string:

        > tagFunc`abc${'subst'}`
        { templateObject: [ 'abc', '' ], substs: [ 'subst' ] }
        An empty template literal produces one template string and no substitutions:

        > tagFunc``
        { templateObject: [ '' ], substs: [] }

### 8.4.2 Escaping in tagged template literals: cooked versus raw

Template strings are available in two interpretations – cooked and raw. These interpretations influence escaping:

In both cooked and raw interpretation, a backslash (\) in front of ${ prevents it from being interpreted as starting a substitution.

In both cooked and raw interpretation, backticks are also escaped via backslashes.

However, every single backslash is mentioned in the raw interpretation, even the ones that escape substitutions and backticks.

The tag function describe allows us to explore what that means.

        function describe(tmplObj, ...substs) {
          return {
          Cooked: merge(tmplObj, substs),
          Raw: merge(tmplObj.raw, substs),
          };
        }

        function merge(tmplStrs, substs) {
          // There is always at least one element in tmplStrs

          let result = tmplStrs[0];

          substs.forEach((subst, i) => {
          result += String(subst);
          result += tmplStrs[i+1];
          });

          return result;
        }

Let’s use this tag function:

        > describe`${3+3}`
        { Cooked: '6', Raw: '6' }

        > describe`\${3+3}`
        { Cooked: '${3+3}', Raw: '\\${3+3}' }

        > describe`\\${3+3}`
        { Cooked: '\\6', Raw: '\\\\6' }

        > describe`\``
        { Cooked: '`', Raw: '\\`' }

As you can see, whenever the cooked interpretation has a substitution or a backtick then so does the raw interpretation. However, all backslashes from the literal appear in the raw interpretation.

Other occurrences of the backslash are interpreted as follows:

In cooked mode, the backslash is handled like in string literals.

In raw mode, the backslash is used verbatim.

For example:


        > describe`\\`
        { Cooked: '\\', Raw: '\\\\' }

        > describe`\n`
        { Cooked: '\n', Raw: '\\n' }

        > describe`\u{58}`
        { Cooked: 'X', Raw: '\\u{58}' }


To summarize: The only effect the backslash has in raw mode is that it escapes substitutions and backticks.

** Escaping in tagged template literals in the spec **

In [the grammar for template literals](http://www.ecma-international.org/ecma-262/6.0/#sec-template-literal-lexical-components), you can see that, within a template literal, there must be no open curly brace ({) after a dollar sign ($). However, an escaped dollar sign (\$) can be followed by an open curly brace. The rules for interpreting the characters of a template literal are explained in a [separate section](http://www.ecma-international.org/ecma-262/6.0/#sec-static-semantics-tv-and-trv).

### 8.4.3 Example: String.raw

The following is how you’d implement String.raw:

        function raw(strs, ...substs) {
            let result = strs.raw[0];
            for (const [i,subst] of substs.entries()) {
                result += subst;
                result += strs.raw[i+1];
            }
            return result;
        }

### 8.4.4 Example: implementing a tag function for HTML templating

I previously demonstrated the tag function html for HTML templating:

        const tmpl = addrs => html`
            <table>
            ${addrs.map(addr => html`
                <tr><td>!${addr.first}</td></tr>
                <tr><td>!${addr.last}</td></tr>
            `)}
            </table>
        `;
        const data = [
            { first: '<Jane>', last: 'Bond' },
            { first: 'Lars', last: '<Croft>' },
        ];
        console.log(tmpl(data));
        // Output:
        // <table>
        //
        //     <tr><td>&lt;Jane&gt;</td></tr>
        //     <tr><td>Bond</td></tr>
        //
        //     <tr><td>Lars</td></tr>
        //     <tr><td>&lt;Croft&gt;</td></tr>
        //
        // </table>

If you precede a substitution with an exclamation mark (!${addr.first}), it will be HTML-escaped. The tag function checks the text preceding a substitution in order to determine whether to escape or not.

This is an implementation of html:

        function html(templateObject, ...substs) {
            // Use raw template strings: we don’t want
            // backslashes (\n etc.) to be interpreted
            const raw = templateObject.raw;

            let result = '';

            substs.forEach((subst, i) => {
                // Retrieve the template string preceding
                // the current substitution
                let lit = raw[i];

                // In the example, map() returns an Array:
                // If `subst` is an Array (and not a string),
                // we turn it into a string
                if (Array.isArray(subst)) {
                    subst = subst.join('');
                }

                // If the substitution is preceded by an exclamation
                // mark, we escape special characters in it
                if (lit.endsWith('!')) {
                    subst = htmlEscape(subst);
                    lit = lit.slice(0, -1);
                }
                result += lit;
                result += subst;
            });
            // Take care of last template string
            result += raw[raw.length-1]; // (A)

            return result;
        }

There is always one more template string than substitutions, which is why we need to append the last template string in line A.

The following is a simple implementation of htmlEscape().

        function htmlEscape(str) {
            return str.replace(/&/g, '&amp;') // first!
                      .replace(/>/g, '&gt;')
                      .replace(/</g, '&lt;')
                      .replace(/"/g, '&quot;')
                      .replace(/'/g, '&#39;')
                      .replace(/`/g, '&#96;');
        }

### 8.4.4.1 More ideas

There are more things you can do with this approach to templating:

This approach isn’t limited to HTML, it would work just as well for other kinds of text. Obviously, escaping would have to be adapted.

if-then-else inside the template can be done via the ternary operator (cond?then:else) or via the logical Or operator (||):

          !${addr.first ? addr.first : '(No first name)'}
          !${addr.first || '(No first name)'}

Dedenting: Some of the leading whitespace in each line can be removed if the first non-whitespace character defines in which column the text starts. For example:

          const theHtml = html`
              <div>
                  Hello!
              </div>`;

The first non-whitespace characters are <div>, which means that the text starts in column 4 (the leftmost column is column 0). The tag function html could automatically remove all preceding columns. Then the previous tagged template would be equivalent to:

          const theHtml =
          html`<div>
              Hello!
          </div>`;
        You can use destructuring to extract data from parameters of functions:
          // Without destructuring
          ${addrs.map((person) => html`
              <tr><td>!${person.first}</td></tr>
              <tr><td>!${person.last}</td></tr>
          `)}

          // With destructuring
          ${addrs.map(({first,last}) => html`
              <tr><td>!${first}</td></tr>
              <tr><td>!${last}</td></tr>
          `)}


### 8.4.5 Example: assembling regular expressions

There are two ways of creating regular expression instances.

* Statically (at compile time), via a regular expression literal: /^abc$/i
* Dynamically (at runtime), via the RegExp constructor: new RegExp('^abc$', 'i')

If you use the latter, it is because you have to wait until runtime so that all necessary ingredients are available. You are creating the regular expression by concatenating three kinds of pieces:

* Static text
* Dynamic regular expressions
* Dynamic text

For #3, special characters (dots, square brackets, etc.) have to be escaped, while #1 and #2 can be used verbatim. A regular expression tag function regex can help with this task:

        const INTEGER = /\d+/;
        const decimalPoint = '.'; // locale-specific! E.g. ',' in Germany
        const NUMBER = regex`${INTEGER}(${decimalPoint}${INTEGER})?`;
        regex looks like this:

        function regex(tmplObj, ...substs) {
            // Static text: verbatim
            let regexText = tmplObj.raw[0];
            for ([i, subst] of substs.entries()) {
                if (subst instanceof RegExp) {
                    // Dynamic regular expressions: verbatim
                    regexText += String(subst);
                } else {
                    // Other dynamic data: escaped
                    regexText += quoteText(String(subst));
                }
                // Static text: verbatim
                regexText += tmplObj.raw[i+1];
            }
            return new RegExp(regexText);
        }
        function quoteText(text) {
            return text.replace(/[\\^$.*+?()[\]{}|=!<>:-]/g, '\\$&');
        }

### 8.5 FAQ: template literals and tagged template literals

### 8.5.1 Where do template literals and tagged template literals come from?

Template literals and tagged template literals were borrowed from the language E, which calls this feature [quasi literals.](http://www.erights.org/elang/grammar/quasi-overview.html)


### 8.5.2 What is the difference between macros and tagged template literals?

Macros allow you to implement language constructs that have custom syntax. It’s difficult to provide macros for a programming language whose syntax is as complex as JavaScript’s. Research in this area is ongoing (see Mozilla’s [sweet.js](http://sweetjs.org/)).

While macros are much more powerful for implementing sub-languages than tagged templates, they depend on the tokenization of the language. Therefore, tagged templates are complementary, because they specialize on text content.

### 8.5.3 Can I load a template literal from an external source?

What if I want to load a template literal such as `Hello ${name}!` from an external source (e.g., a file)?

You are abusing template literals if you do so. Given that a template literal can contain arbitrary expressions and is a literal, loading it from somewhere else is similar to loading an expression or a string literal – you have to use eval() or something similar.

### 8.5.4 Why are backticks the delimiters for template literals?

The backtick was one of the few ASCII characters that were still unused in JavaScript. The syntax ${} for interpolation is very common (Unix shells, etc.).

### 8.5.5 Weren’t template literals once called template strings?

The template literal terminology changed relatively late during the creation of the ES6 spec. The following are the old terms:

* Template string (literal): the old name for template literal.
* Tagged template string (literal): the old name for tagged template literal.
* Template handler: the old name for tag function.
* Literal section: the old name for template string (the term substitution remains the same).

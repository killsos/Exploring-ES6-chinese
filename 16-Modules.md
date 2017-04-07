### 16. Modules
---
* 16.1. Overview
  * 16.1.1. Multiple named exports
  * 16.1.2. Single default export
  * 16.1.3. Browsers: scripts versus modules
* 16.2. Modules in JavaScript
  * 16.2.1. ECMAScript 5 module systems
  * 16.2.2. ECMAScript 6 modules
* 16.3. The basics of ES6 modules
  * 16.3.1. Named exports (several per module)
  * 16.3.2. Default exports (one per module)
  * 16.3.3. Imports and exports must be at the top level
  * 16.3.4. Imports are hoisted
  * 16.3.5. Imports are read-only views on exports
  * 16.3.6. Support for cyclic dependencies
* 16.4. Importing and exporting in detail
  * 16.4.1. Importing styles
  * 16.4.2. Named exporting styles: inline versus clause
  * 16.4.3. Re-exporting
  * 16.4.4. All exporting styles
  * 16.4.5. Having both named exports and a default export in a module
* 16.5. The ECMAScript 6 module loader API
  * 16.5.1. Loaders
  * 16.5.2. Loader method: importing modules
  * 16.5.3. More loader methods
  * 16.5.4. Configuring module loading
* 16.6. Using ES6 modules in browsers
  * 16.6.1. Browsers: asynchronous modules versus synchronous scripts
* 16.7. Details: imports as views on exports
  * 16.7.1. In CommonJS, imports are copies of exported values
  * 16.7.2. In ES6, imports are live read-only views on exported values
  * 16.7.3. Implementing views
  * 16.7.4. Imports as views in the spec
* 16.8. Design goals for ES6 modules
  * 16.8.1. Default exports are favored
  * 16.8.2. Static module structure
  * 16.8.3. Support for both synchronous and asynchronous loading
  * 16.8.4. Support for cyclic dependencies between modules
* 16.9. FAQ: modules
  * 16.9.1. Can I use a variable to specify from which module I want to import?
  * 16.9.2. Can I import a module conditionally or on demand?
  * 16.9.3. Can I use variables in an import statement?
  * 16.9.4. Can I use destructuring in an import statement?
  * 16.9.5. Are named exports necessary? Why not default-export objects?
  * 16.9.6. Can I eval() the code of module?
* 16.10. Advantages of ECMAScript 6 modules
* 16.11. Further reading
---

### 16.1 Overview

JavaScript has had modules for a long time. However, they were implemented via libraries, not built into the language. ES6 is the first time that JavaScript has built-in modules.

ES6 modules are stored in files. There is exactly one module per file and one file per module. You have two ways of exporting things from a module.

These two ways can be mixed, but it is usually better to use them separately.

### 16.1.1 Multiple named exports

There can be multiple named exports:

        //------ lib.js ------
        export const sqrt = Math.sqrt;
        export function square(x) {
            return x * x;
        }
        export function diag(x, y) {
            return sqrt(square(x) + square(y));
        }

        //------ main.js ------
        import { square, diag } from 'lib';
        console.log(square(11)); // 121
        console.log(diag(4, 3)); // 5

You can also import the complete module:

        //------ main.js ------
        import * as lib from 'lib';
        console.log(lib.square(11)); // 121
        console.log(lib.diag(4, 3)); // 5

### 16.1.2 Single default export

There can be a single default export. For example, a function:

        //------ myFunc.js ------
        export default function () { ··· } // no semicolon!

        //------ main1.js ------
        import myFunc from 'myFunc';
        myFunc();

        Or a class:

        //------ MyClass.js ------
        export default class { ··· } // no semicolon!

        //------ main2.js ------
        import MyClass from 'MyClass';
        const inst = new MyClass();

Note that there is no semicolon at the end if you default-export a function or a class (which are anonymous declarations).

### 16.1.3 Browsers: scripts versus modules

<table>
  <thead>
    <tr>
      <th>&nbsp;</th>
      <th>Scripts</th>
      <th>Modules</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>HTML element</td>
      <td><code>&lt;script&gt;</code></td>
      <td><code>&lt;script type="module"&gt;</code></td>
    </tr>
    <tr>
      <td>Default mode</td>
      <td>non-strict</td>
      <td>strict</td>
    </tr>
    <tr>
      <td>Top-level variables are</td>
      <td>global</td>
      <td>local to module</td>
    </tr>
    <tr>
      <td>Value of <code>this</code> at top level</td>
      <td><code>window</code></td>
      <td><code>undefined</code></td>
    </tr>
    <tr>
      <td>Executed</td>
      <td>synchronously</td>
      <td>asynchronously</td>
    </tr>
    <tr>
      <td>Declarative imports (<code>import</code> statement)</td>
      <td>no</td>
      <td>yes</td>
    </tr>
    <tr>
      <td>Programmatic imports (Promise-based API)</td>
      <td>yes</td>
      <td>yes</td>
    </tr>
    <tr>
      <td>File extension</td>
      <td><code>.js</code></td>
      <td><code>.js</code></td>
    </tr>
  </tbody>

</table>

### 16.2 Modules in JavaScript

Even though JavaScript never had built-in modules, the community has converged on a simple style of modules, which is supported by libraries in ES5 and earlier. This style has also been adopted by ES6:

* Each module is a piece of code that is executed once it is loaded.
* 模块文件加载完成就执行

* In that code, there may be declarations (variable declarations, function declarations, etc.).
  * By default, these declarations stay local to the module.
  * 默认 声明作用域是模块范围内
  * You can mark some of them as exports, then other modules can import them.
  * 可以exports输出 其他模块可以引用通过import

* A module can import things from other modules. It refers to those modules via module specifiers, strings that are either:
  * Relative paths ('../model/user'): these paths are interpreted relatively to the location of the importing module. The file extension .js can usually be omitted.
  * 相对路径

  * Absolute paths ('/lib/js/helpers'): point directly to the file of the module to be imported.
  * 绝对路径

  * Names ('util'): What modules names refer to has to be configured.

* Modules are singletons. Even if a module is imported multiple times, only a single “instance” of it exists.

* 虽然一个模块被多个文件引用 但是实际只有一个实例

This approach to modules avoids global variables, the only things that are global are module specifiers.

### 16.2.1 ECMAScript 5 module systems

It is impressive how well ES5 module systems work without explicit support from the language. The two most important (and unfortunately incompatible) standards are:

* CommonJS Modules: The dominant implementation of this standard is in Node.js (Node.js modules have a few features that go beyond CommonJS). Characteristics:
  * Compact syntax
  * Designed for synchronous loading and servers

* Asynchronous Module Definition (AMD): The most popular implementation of this standard is RequireJS. Characteristics:
  * Slightly more complicated syntax, enabling AMD to work without eval() (or a compilation step)
  * Designed for asynchronous loading and browsers

The above is but a simplified explanation of ES5 modules. If you want more in-depth material, take a look at [“Writing Modular JavaScript With AMD, CommonJS & ES Harmony” by Addy Osmani.](http://addyosmani.com/writing-modular-js/)

### 16.2.2 ECMAScript 6 modules

The goal for ECMAScript 6 modules was to create a format that both users of CommonJS and of AMD are happy with:

* Similarly to CommonJS, they have a compact syntax, a preference for single exports and support for cyclic dependencies.

* Similarly to AMD, they have direct support for asynchronous loading and configurable module loading.
Being built into the language allows ES6 modules to go beyond CommonJS and AMD (details are explained later):

  * Their syntax is even more compact than CommonJS’s.
  * Their structure can be statically analyzed (for static checking, optimization, etc.).
  * Their support for cyclic dependencies is better than CommonJS’s.

* The ES6 module standard has two parts:

  * Declarative syntax (for importing and exporting)
  * Programmatic loader API: to configure how modules are loaded and to conditionally load modules

### 16.3 The basics of ES6 modules

There are two kinds of exports: named exports (several per module) and default exports (one per module).

一个模块可以多个export 但是只能有一个 export default

As explained later, it is possible use both at the same time, but usually best to keep them separate.

### 16.3.1 Named exports (several per module)

A module can export multiple things by prefixing its declarations with the keyword export. These exports are distinguished by their names and are called named exports.

          //------ lib.js ------
          export const sqrt = Math.sqrt;
          export function square(x) {
              return x * x;
          }
          export function diag(x, y) {
              return sqrt(square(x) + square(y));
          }

          //------ main.js ------
          import { square, diag } from 'lib';
          console.log(square(11)); // 121
          console.log(diag(4, 3)); // 5

There are other ways to specify named exports (which are explained later), but I find this one quite convenient: simply write your code as if there were no outside world, then label everything that you want to export with a keyword.

If you want to, you can also import the whole module and refer to its named exports via property notation:

        //------ main.js ------
        import * as lib from 'lib';
        console.log(lib.square(11)); // 121
        console.log(lib.diag(4, 3)); // 5

The same code in CommonJS syntax: For a while, I tried several clever strategies to be less redundant with my module exports in Node.js. Now I prefer the following simple but slightly verbose style that is reminiscent of the revealing module pattern:

          //------ lib.js ------
          var sqrt = Math.sqrt;
          function square(x) {
              return x * x;
          }
          function diag(x, y) {
              return sqrt(square(x) + square(y));
          }
          module.exports = {
              sqrt: sqrt,
              square: square,
              diag: diag,
          };

          //------ main.js ------
          var square = require('lib').square;
          var diag = require('lib').diag;
          console.log(square(11)); // 121
          console.log(diag(4, 3)); // 5

### 16.3.2 Default exports (one per module)

Modules that only export single values are very popular in the Node.js community. But they are also common in frontend development where you often have classes for models and components, with one class per module. An ES6 module can pick a default export, the main exported value. Default exports are especially easy to import.

The following ECMAScript 6 module “is” a single function:

          //------ myFunc.js ------
          export default function () {} // no semicolon!

          //------ main1.js ------
          import myFunc from 'myFunc';
          myFunc();

An ECMAScript 6 module whose default export is a class looks as follows:

          //------ MyClass.js ------
          export default class {} // no semicolon!

          //------ main2.js ------
          import MyClass from 'MyClass';
          const inst = new MyClass();

There are two styles of default exports:
* Labeling declarations
* Default-exporting values directly

### 16.3.2.1 Default export style 1: labeling declarations

You can prefix any function declaration (or generator function declaration) or class declaration with the keywords export default to make it the default export:

          export default function foo() {} // no semicolon!
          export default class Bar {} // no semicolon!

You can also omit the name in this case. That makes default exports the only place where JavaScript has anonymous function declarations and anonymous class declarations:

          export default function () {} // no semicolon!
          export default class {} // no semicolon!

### 16.3.2.1.1 Why anonymous function declarations and not anonymous function expressions?

When you look at the previous two lines of code, you’d expect the operands of export default to be expressions.

They are only declarations for reasons of consistency: operands can be named declarations, interpreting their anonymous versions as expressions would be confusing (even more so than introducing new kinds of declarations).

If you want the operands to be interpreted as expressions, you need to use parentheses:

      export default (function () {});
      export default (class {});


### 16.3.2.2 Default export style 2: default-exporting values directly

The values are produced via expressions:

        export default 'abc';
        export default foo();
        export default /^xyz$/;
        export default 5 * 7;
        export default { no: false, yes: true };

Each of these default exports has the following structure.

        export default «expression»;

That is equivalent to:

        const __default__ = «expression»;
        export { __default__ as default }; // (A)

The statement in line A is an export clause (which is explained in a later section).

### 16.3.2.2.1 Why two default export styles?

The second default export style was introduced because variable declarations can’t be meaningfully turned into default exports if they declare multiple variables:

          export default const foo = 1, bar = 2, baz = 3;
          // not legal JavaScript!

Which one of the three variables foo, bar and baz would be the default export?

### 16.3.3 Imports and exports must be at the top level

As explained in more detail later, the structure of ES6 modules is static, you can’t conditionally import or export things. That brings a variety of benefits.

This restriction is enforced syntactically by only allowing imports and exports at the top level of a module:

          if (Math.random()) {
              import 'foo'; // SyntaxError
          }

          // You can’t even nest `import` and `export`
          // inside a simple block:
          {
              import 'foo'; // SyntaxError
          }

### 16.3.4 Imports are hoisted
### import会预解析

Module imports are hoisted (internally moved to the beginning of the current scope). Therefore, it doesn’t matter where you mention them in a module and the following code works without any problems:

          foo();

          import { foo } from 'my_module';

### 16.3.5 Imports are read-only views on exports

The imports of an ES6 module are read-only views on the exported entities. That means that the connections to variables declared inside module bodies remain live, as demonstrated in the following code.

          //------ lib.js ------
          export let counter = 3;
          export function incCounter() {
              counter++;
          }

          //------ main.js ------
          import { counter, incCounter } from './lib';

          // The imported value `counter` is live
          console.log(counter); // 3
          incCounter();
          console.log(counter); // 4
          How that works under the hood is explained in a later section.

Imports as views have the following advantages:

* They enable cyclic dependencies, even for unqualified imports (as explained in the next section).

* Qualified and unqualified imports work the same way (they are both indirections).

* You can split code into multiple modules and it will continue to work (as long as you don’t try to change the values of imports).

### 16.3.6 Support for cyclic dependencies

Two modules A and B are cyclically dependent on each other if both A (possibly indirectly/transitively) imports B and B imports A.

If possible, cyclic dependencies should be avoided, they lead to A and B being tightly coupled – they can only be used and evolved together.

Why support cyclic dependencies, then? Occasionally, you can’t get around them, which is why support for them is an important feature. A later section has more information.

Let’s see how CommonJS and ECMAScript 6 handle cyclic dependencies.

### 16.3.6.1 Cyclic dependencies in CommonJS

The following CommonJS code correctly handles two modules a and b cyclically depending on each other.

        //------ a.js ------
        var b = require('b');
        function foo() {
            b.bar();
        }
        exports.foo = foo;

        //------ b.js ------
        var a = require('a'); // (i)
        function bar() {
            if (Math.random()) {
                a.foo(); // (ii)
            }
        }
        exports.bar = bar;

If module a is imported first then, in line i, module b gets a’s exports object before the exports are added to it.

Therefore, b cannot access a.foo in its top level, but that property exists once the execution of a is finished. If bar() is called afterwards then the method call in line ii works.

As a general rule, keep in mind that with cyclic dependencies, you can’t access imports in the body of the module. That is inherent to the phenomenon and doesn’t change with ECMAScript 6 modules.

The limitations of the CommonJS approach are:

* Node.js-style single-value exports don’t work. There, you export single values instead of objects:

           module.exports = function () { ··· };

If module a did that then module b’s variable a would not be updated once the assignment is made. It would continue to refer to the original exports object.

* You can’t use named exports directly. That is, module b can’t import foo like this:

            var foo = require('a').foo;

foo would simply be undefined. In other words, you have no choice but to refer to foo via a.foo.

These limitations mean that both exporter and importers must be aware of cyclic dependencies and support them explicitly.

### 16.3.6.2 Cyclic dependencies in ECMAScript 6

ES6 modules support cyclic dependencies automatically.

That is, they do not have the two limitations of CommonJS modules that were mentioned in the previous section: default exports work, as do unqualified named imports (lines i and iii in the following example).

Therefore, you can implement modules that cyclically depend on each other as follows.

          //------ a.js ------
          import {bar} from 'b'; // (i)
          export function foo() {
              bar(); // (ii)
          }

          //------ b.js ------
          import {foo} from 'a'; // (iii)
          export function bar() {
              if (Math.random()) {
                  foo(); // (iv)
              }
          }

This code works, because, as explained in the previous section, imports are views on exports.

That means that even unqualified imports (such as bar in line ii and foo in line iv) are indirections that refer to the original data.

Thus, in the face of cyclic dependencies, it doesn’t matter whether you access a named export via an unqualified import or via its module: There is an indirection involved in either case and it always works.

### 16.4 Importing and exporting in detail

### 16.4.1 Importing styles

ECMAScript 6 provides several styles of importing2:

Default import:

            import localName from 'src/my_lib';

Namespace import: imports the module as an object (with one property per named export).

          import * as my_lib from 'src/my_lib';

Named imports:

          import { name1, name2 } from 'src/my_lib';

You can rename named imports:

          // Renaming: import `name1` as `localName1`
          import { name1 as localName1, name2 } from 'src/my_lib';

          // Renaming: import the default export as `foo`
          import { default as foo } from 'src/my_lib';

Empty import: only loads the module, doesn’t import anything. The first such import in a program executes the body of the module.

           import 'src/my_lib';

There are only two ways to combine these styles and the order in which they appear is fixed; the default export always comes first.

Combining a default import with a namespace import:

          import theDefault, * as my_lib from 'src/my_lib';

Combining a default import with named imports

          import theDefault, { name1, name2 } from 'src/my_lib';


### 16.4.2 Named exporting styles: inline versus clause

There are two ways in which you can export named things inside modules.

On one hand, you can mark declarations with the keyword export.

          export var myVar1 = ···;
          export let myVar2 = ···;
          export const MY_CONST = ···;

          export function myFunc() {
              ···
          }
          export function* myGeneratorFunc() {
              ···
          }
          export class MyClass {
              ···
          }

On the other hand, you can list everything you want to export at the end of the module (which is similar in style to the revealing module pattern).

          const MY_CONST = ···;
          function myFunc() {
              ···
          }

          export { MY_CONST, myFunc };

You can also export things under different names:

          export { MY_CONST as FOO, myFunc };

### 16.4.3 Re-exporting

Re-exporting means adding another module’s exports to those of the current module. You can either add all of the other module’s exports:

          export * from 'src/other_module';
          Default exports are ignored3 by export *.


Or you can be more selective (optionally while renaming):

          export { foo, bar } from 'src/other_module';

          // Renaming: export other_module’s foo as myFoo
          export { foo as myFoo, bar } from 'src/other_module';


### 16.4.3.1 Making a re-export the default export

The following statement makes the default export of another module foo the default export of the current module:

          export { default } from 'foo';

The following statement makes the named export myFunc of module foo the default export of the current module:

          export { myFunc as default } from 'foo';

### 16.4.4 All exporting styles

ECMAScript 6 provides several styles of exporting4:

* Re-exporting:
  * Re-export everything (except for the default export): 再输出一切但是排除default

            export * from 'src/other_module';

  * Re-export via a clause:

            export { foo as myFoo, bar } from 'src/other_module';
            export { default } from 'src/other_module';
            export { default as foo } from 'src/other_module';
            export { foo as default } from 'src/other_module';

* Named exporting via a clause:

            export { MY_CONST as FOO, myFunc };
            export { foo as default };

* Inline named exports:
  * Variable declarations:

            export var foo;
            export let foo;
            export const foo;

  * Function declarations:

            export function myFunc() {}
            export function* myGenFunc() {}

  * Class declarations:

            export class MyClass {}

* Default export:
  * Function declarations (can be anonymous here):

            export default function myFunc() {}
            export default function () {}
            export default function* myGenFunc() {}
            export default function* () {}

  * Class declarations (can be anonymous here):

            export default class MyClass {}
            export default class {}

  * Expressions: export values. Note the semicolons at the end  输出值必须以分号结束

            export default foo;
            export default 'Hello world!';
            export default 3 * 7;
            export default (function () {});

### 16.4.5 Having both named exports and a default export in a module
### 默认输出与命名输出

The following pattern is surprisingly common in JavaScript: A library is a single function, but additional services are provided via properties of that function.

Examples include jQuery and Underscore.js. The following is a sketch of Underscore as a CommonJS module:

              //------ underscore.js ------
              var _ = function (obj) {
                  ···
              };
              var each = _.each = _.forEach =
                  function (obj, iterator, context) {
                      ···
                  };

              module.exports = _;

              //------ main.js ------
              var _ = require('underscore');
              var each = _.each;
              ···

With ES6 glasses, the function _ is the default export, while each and forEach are named exports. As it turns out, you can actually have named exports and a default export at the same time.

As an example, the previous CommonJS module, rewritten as an ES6 module, looks like this:

              //------ underscore.js ------
              export default function (obj) {
                  ···
              }
              export function each(obj, iterator, context) {
                  ···
              }
              export { each as forEach };

              //------ main.js ------
              import _, { each } from 'underscore';

Note that the CommonJS version and the ECMAScript 6 version are only roughly similar. The latter has a flat structure, whereas the former is nested.

### 16.4.5.1 Recommendation: avoid mixing default exports and named exports
### 推荐: 避免默认和命名输出的混合

I generally recommend to keep the two kinds of exporting separate: per module, either only have a default export or only have named exports.

我个人推荐这种命名输出和默认输出分割 每个模块要不使用默认输出或者命名输出

However, that is not a very strong recommendation; it occasionally may make sense to mix the two kinds. One example is a module that default-exports an entity. For unit tests, one could additionally make some of the internals available via named exports.

### 16.4.5.2 The default export is just another named export

The default export is actually just a named export with the special name default. That is, the following two statements are equivalent:

            import { default as foo } from 'lib';
            import foo from 'lib';

Similarly, the following two modules have the same default export:

            //------ module1.js ------
            export default function foo() {} // function declaration!

            //------ module2.js ------
            function foo() {}
            export { foo as default };

### 16.4.5.3 default: OK as export name, but not as variable name

You can’t use reserved words (such as default and new) as variable names, but you can use them as names for exports (you can also use them as property names in ECMAScript 5).

If you want to directly import such named exports, you have to rename them to proper variables names.

That means that default can only appear on the left-hand side of a renaming import:

            import { default as foo } from 'some_module';

And it can only appear on the right-hand side of a renaming export:

            export { foo as default };

In re-exporting, both sides of the as are export names:

            export { myFunc as default } from 'foo';
            export { default as otherFunc } from 'foo';

            // The following two statements are equivalent:
            export { default } from 'foo';
            export { default as default } from 'foo';

### 16.5 The ECMAScript 6 module loader API

In addition to the declarative syntax for working with modules, there is also a programmatic API. It allows you to:

            * Programmatically work with modules
            * Configure module loading


### The module loader API is not part of the ES6 standard

It will be specified in a separate document, the “JavaScript Loader Standard”, that will be evolved more dynamically than the language specification. The [repository for that document states:](https://github.com/whatwg/loader/)

[The JavaScript Loader Standard] consolidates work on the ECMAScript module loading semantics with the integration points of Web browsers, as well as Node.js.

### The module loader API is work in progress

As you can see in [the repository of the JavaScript Loader Standard](https://github.com/whatwg/loader/), the module loader API is still work in progress. Everything you read about it in this book is tentative. To get an impression of what the API may look like, you can take a look at [the ES6 Module Loader Polyfill](https://github.com/ModuleLoader/es6-module-loader) on GitHub.


### 16.5.1 Loaders

Loaders handle resolving module specifiers (the string IDs at the end of import-from), loading modules, etc. Their constructor is Reflect.Loader. Each platform keeps a default instance in the global variable System (the system loader), which implements its specific style of module loading.

### 16.5.2 Loader method: importing modules

You can programmatically import a module, via an API based on Promises:

          System.import('some_module')
          .then(some_module => {
              // Use some_module
          })
          .catch(error => {
              ···
          });

System.import() enables you to:

* Use modules inside <script> elements (where module syntax is not supported, consult the [section on modules versus scripts for details)](http://exploringjs.com/es6/ch_modules.html#sec_modules-vs-scripts).

* Load modules conditionally.
System.import() retrieves a single module, you can use Promise.all() to import several modules:

            Promise.all(
                ['module1', 'module2', 'module3']
                .map(x => System.import(x)))
            .then(([module1, module2, module3]) => {
                // Use module1, module2, module3
            });

### 16.5.3 More loader methods

Loaders have more methods. Three important ones are:

* System.module(source, options?)

evaluates the JavaScript code in source to a module (which is delivered asynchronously via a Promise).

* System.set(name, module)

is for registering a module (e.g. one you have created via System.module()).

* System.define(name, source, options?)

both evaluates the module code in source and registers the result.


### 16.5.4 Configuring module loading

The module loader API will have various hooks for configuring the loading process. Use cases include:

1. Lint modules on import (e.g. via JSLint or JSHint).

2. Automatically translate modules on import (they could contain CoffeeScript or TypeScript code)

3. Use legacy modules (AMD, Node.js).

Configurable module loading is an area where Node.js and CommonJS are limited.

### 16.6 Using ES6 modules in browsers

Let’s look at how ES6 modules are supported in browsers.

**Support for ES6 modules in browsers is work in progress**

Similarly to module loading, other aspects of support for modules in browsers are still being worked on. Everything you read here may change.

### 16.6.1 Browsers: asynchronous modules versus synchronous scripts

In browsers, there are two different kinds of entities: scripts and modules. They have slightly different syntax and work differently.

This is an overview of the differences, details are explained later:

<table>
  <thead>
    <tr>
      <th>&nbsp;</th>
      <th>Scripts</th>
      <th>Modules</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>HTML element</td>
      <td><code>&lt;script&gt;</code></td>
      <td><code>&lt;script type="module"&gt;</code></td>
    </tr>
    <tr>
      <td>Default mode</td>
      <td>non-strict</td>
      <td>strict</td>
    </tr>
    <tr>
      <td>Top-level variables are</td>
      <td>global</td>
      <td>local to module</td>
    </tr>
    <tr>
      <td>Value of <code>this</code> at top level</td>
      <td><code>window</code></td>
      <td><code>undefined</code></td>
    </tr>
    <tr>
      <td>Executed</td>
      <td>synchronously</td>
      <td>asynchronously</td>
    </tr>
    <tr>
      <td>Declarative imports (<code>import</code> statement)</td>
      <td>no</td>
      <td>yes</td>
    </tr>
    <tr>
      <td>Programmatic imports (Promise-based API)</td>
      <td>yes</td>
      <td>yes</td>
    </tr>
    <tr>
      <td>File extension</td>
      <td><code>.js</code></td>
      <td><code>.js</code></td>
    </tr>
  </tbody>

</table>

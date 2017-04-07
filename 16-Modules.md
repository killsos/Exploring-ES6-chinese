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

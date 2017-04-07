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

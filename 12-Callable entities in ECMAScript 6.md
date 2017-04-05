### 12. Callable entities in ECMAScript 6

This chapter gives advice on how to properly use entities you can call (via function calls, method calls, etc.) in ES6.

---
* 12.1. Overview
* 12.2. Ways of calling in ES6
  * 12.2.1. Calls that can be made anywhere
  * 12.2.2. Calls via super are restricted to specific locations
  * 12.2.3. Non-method functions versus methods
* 12.3. Recommendations for using callable entities
  * 12.3.1. Prefer arrow functions as callbacks
  * 12.3.2. Prefer function declarations as stand-alone functions
  * 12.3.3. Prefer method definitions for methods
  * 12.3.4. Methods versus callbacks
  * 12.3.5. Avoid IIFEs in ES6
  * 12.3.6. Use classes as constructors
* 12.4. ES6 callable entities in detail
  * 12.4.1. Cheat sheet: callable entities
  * 12.4.2. Traditional functions
  * 12.4.3. Generator functions
  * 12.4.4. Method definitions
  * 12.4.5. Generator method definitions
  * 12.4.6. Arrow functions
  * 12.4.7. Classes
* 12.5. Dispatched and direct method calls in ES5 and ES6
  * 12.5.1. Background: prototype chains
  * 12.5.2. Dispatched method calls
  * 12.5.3. Direct method calls
  * 12.5.4. Use cases for direct method calls
  * 12.5.5. Abbreviations for Object.prototype and Array.prototype
* 12.6. The name property of functions
  * 12.6.1. Constructs that provide names for functions
  * 12.6.2. Caveats
  * 12.6.3. Changing the names of functions
  * 12.6.4. The function property name in the spec
* 12.7. FAQ: callable entities
  * 12.7.1. How do I determine whether a function was invoked via new?

---

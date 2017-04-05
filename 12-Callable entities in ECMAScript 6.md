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

### 12.1 Overview

In ES5, a single construct, the (traditional) function, played three roles:

ES5可以call的情况:函数 方法 构造器

* Real (non-method) function
* Method
* Constructor

In ES6, there is more specialization. The three duties are now handled as follows. As far as function definitions and class definitions are concerned, a definition is either a declaration or an expression.

在ES6可以call情况

* Real (non-method) function: 真函数
  * Arrow functions (only have an expression form) 箭头函数---仅仅是表达式方式
  * Traditional functions (created via function definitions) 传统函数---通过传统function关键字
  * Generator functions (created via generator function definitions) 生成器函数 * function

* Method:方法
  * Methods (created by method definitions in object literals and class definitions) 在一个对象或类里定义
  * Generator methods (created by generator method definitions in object literals and class definitions)生成器方法---在一个对象或类中创建生成器函数

* Constructor:构造器函数
  * Classes (created via class definitions) 通过类的定义


Especially for callbacks, arrow functions are handy, because they don’t shadow the this of the surrounding scope.

对于回调函数 箭头函数是很方便 意味箭头不会遮盖所包含作用域的this指向

For longer callbacks and stand-alone functions, traditional functions can be OK. Some APIs use this as an implicit parameter. In that case, you have no choice but to use traditional functions.


Note that I distinguish:

* The entities: e.g. traditional functions
* The syntax that creates the entities: e.g. function definitions

Even though their behaviors differ (as explained later), all of these entities are functions. For example:

尽管他们行为表现不同 但是他们存在形式都是函数

        > typeof (() => {}) // arrow function
        'function'
        > typeof function* () {} // generator function
        'function'
        > typeof class {} // class
        'function'

### 12.2 Ways of call

Some calls can be made anywhere, others are restricted to specific locations.

### 12.2.1 Calls that can be made anywhere

Three kinds of calls can be made anywhere in ES6:

ES6三种调用方法：函数调用 方法调用 构造器调用

* Function calls: func(3, 1)

* Method calls: obj.method('abc')

* Constructor calls: new Constr(8)


### 12.2.2 Calls via super are restricted to specific locations

Two kinds of calls can be made via the super keyword; their use is restricted to specific locations:

super调用的限制：

* Super-method calls: super.method('abc')

Only available within method definitions inside either object literals or derived class definitions.

Super-method调用仅在对象字面量或子类定义过程中

* Super-constructor calls: super(8)

Only available inside the special method constructor() inside a derived class definition.

Super-constructor仅在constructor()调用

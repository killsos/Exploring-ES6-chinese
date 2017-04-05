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

### 12.2.3 Non-method functions versus methods

The difference between non-method functions and methods is becoming more pronounced in ECMAScript 6. There are now special entities for both and things that only they can do:

Arrow functions are made for non-method functions. They pick up this from their surrounding scopes (“lexical this”).
Method definitions are made for methods. They provide support for super, to refer to super-properties and to make super-method calls.

### 12.3 Recommendations for using callable entities
### 推荐使用调用实体

This section gives tips for using callable entities: When it’s best to use which entity; etc.

这段主要介绍在各种情况下使用那种调用实体是最佳实践

### 12.3.1 Prefer arrow functions as callbacks
### 用箭头函数做回调函数

As callbacks, arrow functions have two advantages over traditional functions:

用作回调函数,箭头函数相比于普通函数有两个优势:

* this is lexical and therefore safer to use.

  this是词法的因而使用安全 所谓词法就是this的指向取决于箭头声明的位置 而普通函数取决于调用的位置

* Their syntax is more compact. That matters especially in functional programming, where there are many higher-order functions and methods (functions and methods whose parameters are functions).

箭头函数的语法更加紧凑 这一点在函数编程中的高阶函数和方法显的更重要

* For callbacks that span multiple lines, I find traditional function expressions acceptable, too. But you have to be careful with this.

对于处理多个事件的回调函数 我通常认为函数表达式也是可以的 但是需要注意this的处理

### 12.3.1.1 Problem: this as an implicit parameter
### 隐式参数

Alas(唉), some JavaScript APIs use this as an implicit argument for their callbacks, which prevents you from using arrow functions.

有一些JavaScript APIs用隐式参数作为回调函数 这种情况会不能使用箭头函数

For example: The this in line B is an implicit argument of the function in line A.

        beforeEach(function () { // (A)
            this.addMatchers({ // (B)
                toBeInRange: function (start, end) {  
                    ···
                }  
            });  
        });  

This pattern is less explicit and prevents you from using arrow functions.

explicit  显式

implicit 隐式

### 12.3.1.2 Solution 1: change the API

This is easy to fix, but requires the API to change:

        beforeEach(api => {
            api.addMatchers({
                toBeInRange(start, end) {
                    ···
                }
            });
        });


We have turned the API from an implicit parameter this into an explicit parameter api. I like this kind of explicitness.

### 12.3.1.3 Solution 2: access the value of this in some other way

In some APIs, there are alternate ways to get to the value of this. For example, the following code uses this.

        var $button = $('#myButton');

        $button.on('click', function () {
            this.classList.toggle('clicked');
        });

But the target of the event can also be accessed via event.target:

通过event.target来实现

        var $button = $('#myButton');
        $button.on('click', event => {
            event.target.classList.toggle('clicked');
        });

### 12.3.2 Prefer function declarations as stand-alone functions

As stand-alone functions (versus callbacks), I prefer function declarations:

作为单独函数通过回调函数 我喜欢函数声明

        function foo(arg1, arg2) {
            ···
        }

The benefits are:

Subjectively, I find they look nicer. In this case, the verbose keyword function is an advantage – you want the construct to stand out.

主观的 我觉这样看出来更好看

They look like generator function declarations, leading to more visual consistency of the code.

There is one caveat: Normally, you don’t need this in stand-alone functions. If you use it, you want to access the this of the surrounding scope (e.g. a method which contains the stand-alone function). Alas, function declarations don’t let you do that – they have their own this, which shadows the this of the surrounding scope. Therefore, you may want to let a linter warn you about this in function declarations.

Another option for stand-alone functions is assigning arrow functions to variables. Problems with this are avoided, because it is lexical.

        const foo = (arg1, arg2) => {
            ···
        };

### 12.3.3 Prefer method definitions for methods

Method definitions are the only way to create methods that use super. They are the obvious choice in object literals and classes (where they are the only way to define methods), but what about adding a method to an existing object? For example:

        MyClass.prototype.foo = function (arg1, arg2) {
            ···
        };

The following is a quick way to do the same thing in ES6 (caveat: Object.assign() doesn’t move methods with super properly).

        Object.assign(MyClass.prototype, {
            foo(arg1, arg2) {
                ···
            }
        });

For more information and caveats, consult the section on Object.assign().

### 12.3.4 Methods versus callbacks

Usually, function-valued properties should be created via method definitions. However, occasionally, arrow functions are the better choice. The following two subsections explain what to use when: the former approach is better for objects with methods, the latter approach is better for objects with callbacks.

定义对象的方法用箭头函数


### 12.3.4.1 An object whose properties are methods

Create function-valued properties via method definitions if those properties are really methods. That’s the case if the property values are closely related to the object (obj in the following example) and their sibling methods, not to the surrounding scope (surroundingMethod() in the example).

With a method definition, the this of a property value is the receiver of the method call (e.g. obj if the method call is obj.m(···)).

For example, you can use the WHATWG streams API as follows:

          const surroundingObject = {
              surroundingMethod() {
                  const obj = {
                      data: 'abc',
                      start(controller) {
                          ···
                          console.log(this.data); // abc (*)
                          this.pull(); // (**)
                          ···
                      },
                      pull() {
                          ···
                      },
                      cancel() {
                          ···
                      },
                  };
                  const stream = new ReadableStream(obj);
              },
          };

obj is an object whose properties start, pull and cancel are real methods. Accordingly, these methods can use this to access object-local state (line *) and to call each other (line **).

### 12.3.4.2 An object whose properties are callbacks

Create function-valued properties via arrow functions if the property values are callbacks. Such callbacks tend to be closely related to their surrounding scopes (surroundingMethod() in the following example), not to the objects they are stored in (obj in the example).

The this of an arrow function is the this of the surrounding scope (lexical this).

箭头函数的this是包裹它的作用域的语法this

 Arrow functions make great callbacks, because that is the behavior you normally want for callbacks (real, non-method, functions).

 箭头函数更适合做回调函数

A callback shouldn’t have its own this that shadows the this of the surrounding scope.

If the properties start, pull and cancel are arrow functions then they pick up the this of surroundingMethod() (their surrounding scope):

        const surroundingObject = {
            surroundingData: 'xyz',
            surroundingMethod() {
                const obj = {
                    start: controller => {
                        ···
                        console.log(this.surroundingData); // xyz (*)
                        ···
                    },

                    pull: () => {
                        ···
                    },

                    cancel: () => {
                        ···
                    },
                };
                const stream = new ReadableStream(obj);
            },
        };
        const stream = new ReadableStream();

If the output in line * surprises you then consider the following code:

        const obj = {
            foo: 123,
            bar() {
                const f = () => console.log(this.foo); // 123
                const o = {
                    p: () => console.log(this.foo), // 123
                };
            },
        }

Inside method bar(), the behavior of f should make immediate sense. The behavior of o.p is less obvious, but it is the same as f’s. Both arrow functions have the same surrounding lexical scope, bar(). The latter arrow function being surrounded by an object literal does not change that.

**词法作用域是箭头函数在最近一层的外部函数的作用域  词法作用域可以理解为函数声明作用域**

### 12.3.5 Avoid IIFEs in ES6
### ES6避免自执行匿名函数

This section gives tips for avoiding IIFEs in ES6.

### 12.3.5.1 Replace an IIFE with a block

In ES5, you had to use an IIFE if you wanted to keep a variable local:

        (function () {  // open IIFE
            var tmp = ···;
            ···
        }());  // close IIFE

        console.log(tmp); // ReferenceError

In ECMAScript 6, you can simply use a block and a let or const declaration:

      {  // open block
          let tmp = ···;
          ···
      }  // close block

      console.log(tmp); // ReferenceError

### 12.3.5.2 Replace an IIFE with a module

In ECMAScript 5 code that doesn’t use modules via libraries (such as RequireJS, browserify or webpack), the revealing module pattern is popular, and based on an IIFE. Its advantage is that it clearly separates between what is public and what is private:

在ES5中没有模块化 所以有了IIFE 创造公有和私有的空间

      var my_module = (function () {
          // Module-private variable:
          var countInvocations = 0;

          function myFunc(x) {
              countInvocations++;
              ···
          }

          // Exported by module:
          return {
              myFunc: myFunc
          };
      }());

This module pattern produces a global variable and is used as follows:

      my_module.myFunc(33);

In ECMAScript 6, modules are built in, which is why the barrier to adopting them is low:

      // my_module.js

      // Module-private variable:
      let countInvocations = 0;

      export function myFunc(x) {
          countInvocations++;
          ···
      }

This module does not produce a global variable and is used as follows:

      import { myFunc } from 'my_module.js';

      myFunc(33);


### 12.3.5.3 Immediately-invoked arrow functions
### 自执行箭头函数

There is one use case where you still need an immediately-invoked function in ES6: Sometimes you only can produce a result via a sequence of statements, not via a single expression. If you want to inline those statements, you have to immediately invoke a function. In ES6, you can save a few characters via immediately-invoked arrow functions:

在ES6中有一种情况需要自执行函数 有时候仅仅产生一个结果通过一系列语句而不是通过函数表达式

      const SENTENCE = 'How are you?';

      const REVERSED_SENTENCE = (() => {
          // Iteration over the string gives us code points
          // (better for reversal than characters)
          const arr = [...SENTENCE];
          arr.reverse();
          return arr.join('');
      })();

Note that you must parenthesize(加括号) as shown (the parens are around the arrow function, not around the complete function call). Details are explained in the chapter on arrow functions.

### 12.3.6 Use classes as constructors

In ES5, constructor functions were the mainstream way of creating factories for objects (but there were also many other techniques, some arguably more elegant). In ES6, classes are the mainstream way of implementing constructor functions. Several frameworks support them as alternatives to their custom inheritance APIs.

### 12.4 ES6 callable entities in detail

This section starts with a cheat sheet, before describing each ES6 callable entity in detail.

### 12.4.1 Cheat sheet: callable entities

### 12.4.1.1 The behavior and structure of callable entities

Characteristics of the values produced by the entities:

<table>
  <thead>
    <tr>
      <th>&nbsp;</th>
      <th>Func decl/Func expr</th>
      <th>Arrow</th>
      <th>Class</th>
      <th>Method</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Function-callable</td>
      <td>✔</td>
      <td>✔</td>
      <td>×</td>
      <td>✔</td>
    </tr>
    <tr>
      <td>Constructor-callable</td>
      <td>✔</td>
      <td>×</td>
      <td>✔</td>
      <td>×</td>
    </tr>
    <tr>
      <td>Prototype</td>
      <td><code>F.p</code></td>
      <td><code>F.p</code></td>
      <td>SC</td>
      <td><code>F.p</code></td>
    </tr>
    <tr>
      <td>Property <code>prototype</code>
</td>
      <td>✔</td>
      <td>×</td>
      <td>✔</td>
      <td>×</td>
    </tr>
  </tbody>

</table>

**Characteristics of the whole entities:**

<table>
  <thead>
    <tr>
      <th>&nbsp;</th>
      <th>Func decl</th>
      <th>Func expr</th>
      <th>Arrow</th>
      <th>Class</th>
      <th>Method</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Hoisted</td>
      <td>✔</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td>×</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>Creates <code>window</code> prop. (1)</td>
      <td>✔</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td>×</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>Inner name (2)</td>
      <td>×</td>
      <td>✔</td>
      <td>&nbsp;</td>
      <td>✔</td>
      <td>×</td>
    </tr>
  </tbody>

</table>

**Characteristics of the bodies of the entities:**

<table>
  <thead>
    <tr>
      <th>&nbsp;</th>
      <th>Func decl</th>
      <th>Func expr</th>
      <th>Arrow</th>
      <th>Class (3)</th>
      <th>Method</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>this</code></td>
      <td>✔</td>
      <td>✔</td>
      <td>lex</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><code>new.target</code></td>
      <td>✔</td>
      <td>✔</td>
      <td>lex</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><code>super.prop</code></td>
      <td>×</td>
      <td>×</td>
      <td>lex</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><code>super()</code></td>
      <td>×</td>
      <td>×</td>
      <td>×</td>
      <td>✔</td>
      <td>×</td>
    </tr>
  </tbody>

</table>

**Legend – table cells:**

<ul>
  <li>✔ exists, allowed</li>
  <li>× does not exist, not allowed</li>
  <li>Empty cell: not applicable, not relevant</li>
  <li>lex: lexical, inherited from surrounding lexical scope</li>
  <li>
<code>F.p</code>: <code>Function.prototype</code>
</li>
  <li>SC: superclass for derived classes, <code>Function.prototype</code> for base classes. The details are explained in <a href="ch_classes.html#details-of-subclassing">the chapter on classes</a>.</li>
</ul>

Legend – footnotes:

<ul>
  <li>(1) The rules for what declarations create properties on the global object are explained in <a href="ch_variables.html#sect_global-object">the chapter on variables and scoping</a>.</li>
  <li>(2) The inner names of named function expressions and classes are explained in <a href="ch_classes.html#sec_classes-inner-names">the chapter on classes</a>.</li>
  <li>(3) This column is about the body of the class constructor.</li>
</ul>


**What about generator functions and methods? **

Those work like their non-generator counterparts, with two exceptions:

* Generator functions and methods have the prototype (GeneratorFunction).prototype ((GeneratorFunction) is an internal object, see diagram in Sect. “Inheritance within the iteration API (including generators)”).

* You can’t constructor-call generator functions.

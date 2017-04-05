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



**What about generator functions and methods?**

Those work like their non-generator counterparts, with two exceptions:

* Generator functions and methods have the prototype (GeneratorFunction).prototype
 ((GeneratorFunction) is an internal object, see diagram in Sect.

 “Inheritance within the iteration API (including generators)”).

* You can’t constructor-call generator functions.


### **12.4.1.2 The rules for this**

<table>
  <thead>
    <tr>
      <th>&nbsp;</th>
      <th>function call</th>
      <th>Method call</th>
      <th><code>new</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Traditional function (strict)</td>
      <td><code>undefined</code></td>
      <td>receiver</td>
      <td>instance</td>
    </tr>
    <tr>
      <td>Traditional function (sloppy)</td>
      <td><code>window</code></td>
      <td>receiver</td>
      <td>instance</td>
    </tr>
    <tr>
      <td>Generator function (strict)</td>
      <td><code>undefined</code></td>
      <td>receiver</td>
      <td><code>TypeError</code></td>
    </tr>
    <tr>
      <td>Generator function (sloppy)</td>
      <td><code>window</code></td>
      <td>receiver</td>
      <td><code>TypeError</code></td>
    </tr>
    <tr>
      <td>Method (strict)</td>
      <td><code>undefined</code></td>
      <td>receiver</td>
      <td><code>TypeError</code></td>
    </tr>
    <tr>
      <td>Method (sloppy)</td>
      <td><code>window</code></td>
      <td>receiver</td>
      <td><code>TypeError</code></td>
    </tr>
    <tr>
      <td>Generator method (strict)</td>
      <td><code>undefined</code></td>
      <td>receiver</td>
      <td><code>TypeError</code></td>
    </tr>
    <tr>
      <td>Generator method (sloppy)</td>
      <td><code>window</code></td>
      <td>receiver</td>
      <td><code>TypeError</code></td>
    </tr>
    <tr>
      <td>Arrow function (strict&amp;sloppy)</td>
      <td>lexical</td>
      <td>lexical</td>
      <td><code>TypeError</code></td>
    </tr>
    <tr>
      <td>Class (implicitly strict)</td>
      <td><code>TypeError</code></td>
      <td><code>TypeError</code></td>
      <td>SC protocol</td>
    </tr>
  </tbody>

</table>

Legend – table cells:

* lexical: inherited from surrounding lexical scope
* SC (subclassing) protocol: A base class receives a new instance via this. A derived class gets its instance from its superclass. The details are explained in the chapter on classes.

### 12.4.2 Traditional functions

These are the functions that you know from ES5. There are two ways to create them:

        Function expression:
          const foo = function (x) { ··· };

        Function declaration:
          function foo(x) { ··· }

Rules for this:

* Function calls: this is undefined in strict-mode functions and the global object in sloppy mode.

* Method calls: this is the receiver of the method call (or the first argument of call/apply).

* Constructor calls: this is the newly created instance.

### 12.4.3 Generator functions

Generator functions are explained in the chapter on generators. Their syntax is similar to traditional functions, but they have an extra asterisk:

          Generator function expression:

            const foo = function* (x) { ··· };

          Generator function declaration:

            function* foo(x) { ··· }

The rules for this are as follows. Note that this never refers to the generator object.

* Function/method calls: this is handled like it is with traditional functions. The results of such calls are generator objects.

函数/方法调用: 如同普通函数调用一样 而生成器函数如是

* Constructor calls: You can’t constructor-call generator functions. A TypeError is thrown if you do.

构造器调用: 不可以在构造器中调用生成器函数 如果调用会产生TypeError

### 12.4.4 Method definitions
### 方法定义---新语法 不需要function关键字

Method definitions can appear inside object literals:

        const obj = {
            add(x, y) {
                return x + y;
            }, // comma is required
            sub(x, y) {
                return x - y;
            }, // comma is optional
        };

And inside class definitions:

          class AddSub {
              add(x, y) {
                  return x + y;
              } // no comma
              sub(x, y) {
                  return x - y;
              } // no comma
          }


As you can see, you must separate method definitions in an object literal with commas, but there are no separators between them in a class definition. The former is necessary to keep the syntax consistent, especially with regard to getters and setters.

在对象定义方法需要通过分号进行分离 在类中不需要 这个语法etters and setters也一样

Method definitions are the only place where you can use super to refer to super-properties. Only method definitions that use super produce functions that have the internal property [[HomeObject]], which is required for that feature (details are explained in the chapter on classes).

Rules:

* Function calls: If you extract a method and call it as a function, it behaves like a traditional function.

* Method calls: work as with traditional functions, but additionally allow super.

* Constructor calls: throw a TypeError.

Inside class definitions, methods whose name is constructor are special, as explained later in this chapter.

### 12.4.5 Generator method definitions

Generator methods are explained in the chapter on generators. Their syntax is similar to method definitions, but they have an extra asterisk:

      const obj = {
          * generatorMethod(···) {
              ···
          },
      };
      class MyClass {
          * generatorMethod(···) {
              ···
          }
      }

Rules:

* Calling a generator method returns a generator object.
* You can use this and super as you would in normal method definitions.

### 12.4.6 Arrow functions

Arrow functions are explained in their own chapter:

        const squares = [1,2,3].map(x => x * x);

The following variables are lexical inside an arrow function (picked up from the surrounding scope):

下面这些变量是在箭头函数的语法作用域

          arguments
          super
          this
          new.target

Rules:

* Function calls: lexical this etc.

* Method calls: You can use arrow functions as methods, but their this continues to be lexical and does not refer to the receiver of a method call.

你可以箭头函数作为一个方法 但是就这样也是语法作用域的this this并不指向方法的调用者

* Constructor calls: produce a TypeError.

箭头函数不能用作构造器函数

### 12.4.7 Classes

Classes are explained in their own chapter.

          // Base class: no `extends`
          class Point {
              constructor(x, y) {
                  this.x = x;
                  this.y = y;
              }
              toString() {
                  return `(${this.x}, ${this.y})`;
              }
          }

          // This class is derived from `Point`
          class ColorPoint extends Point {
              constructor(x, y, color) {
                  super(x, y);
                  this.color = color;
              }
              toString() {
                  return super.toString() + ' in ' + this.color;
              }
          }

The Method constructor is special, because it “becomes” the class. That is, classes are very similar to constructor functions:

          > Point.prototype.constructor === Point
          true
          Rules:

Rules:
* Function/method calls: Classes can’t be called as functions or methods (why is explained in the chapter on classes).

类不能以函数方式调用

* Constructor calls: follow a protocol that supports subclassing. In a base class, an instance is created and this refers to it. A derived class receives its instance from its superclass, which is why it needs to call super() before it can access this.

### 12.5 Dispatched and direct method calls in ES5 and ES6
### ES5 and ES6方法调用方式：直接调用和传送方式

There are two ways to call methods in JavaScript:

* Dynamic dispatch (arr.slice(1)): property slice is searched for in the prototype chain of arr. Its result is called with this set to arr.

到原型寻找调用

* Direct call (Array.prototype.slice.call(arr, 1)): slice is called directly with this set to arr (the first argument of call()).

直接用原型的调用

This section explains how these two work and why you will rarely call methods directly in ECMAScript 6. Before we get started, let’s refresh our knowledge of prototype chains.

### 12.5.1 Background: prototype chains
### 原型链基础知识

Remember that each object in JavaScript is actually a chain of one or more objects. The first object inherits properties from the later objects. For example, the prototype chain of an Array ['a', 'b'] looks as follows:

  1. The instance, holding the elements 'a' and 'b'
  2. Array.prototype, the properties provided by the Array constructor
  3. Object.prototype, the properties provided by the Object constructor
  4. null (the end of the chain, so not really a member of it)

原型链结束是null

You can examine the chain via Object.getPrototypeOf():

检查一个对象的原型的方法 Object.getPrototypeOf()

        > var arr = ['a', 'b'];
        > var p = Object.getPrototypeOf;

        > p(arr) === Array.prototype
        true

        > p(p(arr)) === Object.prototype
        true

        > p(p(p(arr)))
        null

Properties in “earlier” objects override properties in “later” objects. For example, Array.prototype provides an Array-specific version of the toString() method, overriding Object.prototype.toString().

后者属性覆盖前者属性

        > var arr = ['a', 'b'];
        > Object.getOwnPropertyNames(Array.prototype)

        [ 'toString', 'join', 'pop', ··· ]
        > arr.toString()
        'a,b'

### 12.5.2 Dispatched method calls

If you look at the method call arr.toString() you can see that it actually performs two steps:

* Dispatch: In the prototype chain of arr, retrieve the value of the first property whose name is toString.

* Call: Call the value and set the implicit parameter this to the receiver arr of the method invocation.

You can make the two steps explicit by using the call() method of functions:

        > var arr = ['a', 'b'];
        > var func = arr.toString; // dispatch
        > func.call(arr) // direct call, providing a value for `this`
        'a,b'

### 12.5.3 Direct method calls

There are two ways to make direct method calls in JavaScript:

Function.prototype.call(thisValue, arg0?, arg1?, ···)
Function.prototype.apply(thisValue, argArray)
Both method call and method apply are invoked on functions. They are different from normal function calls in that you specify a value for this. call provides the arguments of the method call via individual parameters, apply provides them via an Array.

With a dispatched method call, the receiver plays two roles: It is used to find the method and it is an implicit parameter. A problem with the first role is that a method must be in the prototype chain of an object if you want to invoke it. With a direct method call, the method can come from anywhere. That allows you to borrow a method from another object. For example, you can borrow Object.prototype.toString and thus apply the original, un-overridden implementation of toString to an Array arr:

        > const arr = ['a','b','c'];
        > Object.prototype.toString.call(arr)
        '[object Array]'

The Array version of toString() produces a different result:

        > arr.toString() // dispatched
        'a,b,c'
        > Array.prototype.toString.call(arr); // direct
        'a,b,c'


Methods that work with a variety of objects (not just with instances of “their” constructors) are called generic. Speaking JavaScript has a list of all methods that are generic. The list includes most Array methods and all methods of Object.prototype (which have to work with all objects and are thus implicitly generic).

### 12.5.4 Use cases for direct method calls

This section covers use cases for direct method calls. Each time, I’ll first describe the use case in ES5 and then how it changes with ES6 (where you’ll rarely need direct method calls).

### 12.5.4.1 ES5: Provide parameters to a method via an Array

Some functions accept multiple values, but only one value per parameter. What if you want to pass the values via an Array?

For example, push() lets you destructively append several values to an Array:

        > var arr = ['a', 'b'];
        > arr.push('c', 'd')
        4
        > arr
        [ 'a', 'b', 'c', 'd' ]

But you can’t destructively append a whole Array. You can work around that limitation by using apply():

        > var arr = ['a', 'b'];
        > Array.prototype.push.apply(arr, ['c', 'd'])
        4
        > arr
        [ 'a', 'b', 'c', 'd' ]
        Similarly, Math.max() and Math.min() only work for single values:

        > Math.max(-1, 7, 2)
        7
        With apply(), you can use them for Arrays:

        > Math.max.apply(null, [-1, 7, 2])
        7

### 12.5.4.2 ES6: The spread operator (...) mostly replaces apply()

Making a direct method call via apply() only because you want to turn an Array into arguments is clumsy, which is why ECMAScript 6 has the spread operator (...) for this. It provides this functionality even in dispatched method calls.

        > Math.max(...[-1, 7, 2])
        7
        Another example:

        > const arr = ['a', 'b'];
        > arr.push(...['c', 'd'])
        4
        > arr
        [ 'a', 'b', 'c', 'd' ]


As a bonus, spread also works with the new operator:

        > new Date(...[2011, 11, 24])
        Sat Dec 24 2011 00:00:00 GMT+0100 (CET)


Note that apply() can’t be used with new – the above feat can only be achieved via a complicated work-around in ECMAScript 5.

### 12.5.4.3 ES5: Convert an Array-like object to an Array

Some objects in JavaScript are Array-like, they are almost Arrays, but don’t have any of the Array methods. Let’s look at two examples.

First, the special variable arguments of functions is Array-like. It has a length and indexed access to elements.

        > var args = function () { return arguments }('a', 'b');
        > args.length
        2
        > args[0]
        'a'


But arguments isn’t an instance of Array and does not have the method map().

        > args instanceof Array
        false
        > args.map
        undefined


Second, the DOM method document.querySelectorAll() returns an instance of NodeList.

        > document.querySelectorAll('a[href]') instanceof NodeList
        true
        > document.querySelectorAll('a[href]').map // no Array methods!
        undefined

Thus, for many complex operations, you need to convert Array-like objects to Arrays first. That is achieved via Array.prototype.slice(). This method copies the elements of its receiver into a new Array:

        > var arr = ['a', 'b'];
        > arr.slice()
        [ 'a', 'b' ]
        > arr.slice() === arr
        false

If you call slice() directly, you can convert a NodeList to an Array:

        var domLinks = document.querySelectorAll('a[href]');
        var links = Array.prototype.slice.call(domLinks);
        links.map(function (link) {
            return link.href;
        });

And you can convert arguments to an Array:

        function format(pattern) {
            // params start at arguments[1], skipping `pattern`
            var params = Array.prototype.slice.call(arguments, 1);
            return params;
        }
        console.log(format('a', 'b', 'c')); // ['b', 'c']

### 12.5.4.4 ES6: Array-like objects are less burdensome

On one hand, ECMAScript 6 has Array.from(), a simpler way of converting Array-like objects to Arrays:

          const domLinks = document.querySelectorAll('a[href]');
          const links = Array.from(domLinks);
          links.map(link => link.href);

On the other hand, you won’t need the Array-like arguments, because ECMAScript 6 has rest parameters (declared via a triple dot):

function format(pattern, ...params) {
    return params;
}
console.log(format('a', 'b', 'c')); // ['b', 'c']

### 12.5.4.5 ES5: Using hasOwnProperty() safely

obj.hasOwnProperty('prop') tells you whether obj has the own (non-inherited) property prop.

        > var obj = { prop: 123 };

        > obj.hasOwnProperty('prop')
        true

        > 'toString' in obj // inherited
        true
        > obj.hasOwnProperty('toString') // own
        false

However, calling hasOwnProperty via dispatch can cease to work properly if Object.prototype.hasOwnProperty is overridden.

        > var obj1 = { hasOwnProperty: 123 };
        > obj1.hasOwnProperty('toString')
        TypeError: Property 'hasOwnProperty' is not a function

hasOwnProperty may also be unavailable via dispatch if Object.prototype is not in the prototype chain of an object.

        > var obj2 = Object.create(null);
        > obj2.hasOwnProperty('toString')
        TypeError: Object has no method 'hasOwnProperty'

In both cases, the solution is to make a direct call to hasOwnProperty:

        > var obj1 = { hasOwnProperty: 123 };
        > Object.prototype.hasOwnProperty.call(obj1, 'hasOwnProperty')
        true

        > var obj2 = Object.create(null);
        > Object.prototype.hasOwnProperty.call(obj2, 'toString')
        false

### 12.5.4.6 ES6: Less need for hasOwnProperty()

hasOwnProperty() is mostly used to implement Maps via objects. Thankfully, ECMAScript 6 has a built-in Map data structure, which means that you’ll need hasOwnProperty() less.

### 12.5.5 Abbreviations for Object.prototype and Array.prototype

You can access the methods of Object.prototype via an empty object literal (whose prototype is Object.prototype). For example, the following two direct method calls are equivalent:

          Object.prototype.hasOwnProperty.call(obj, 'propKey')
          {}.hasOwnProperty.call(obj, 'propKey')

The same trick works for Array.prototype:

          Array.prototype.slice.call(arguments)
          [].slice.call(arguments)

This pattern has become quite popular. It does not reflect the intention of the author as clearly as the longer version, but it’s much less verbose. [Speed-wise](http://jsperf.com/array-prototype-slice-call-vs-slice-call/17), there isn’t much of a difference between the two versions.

### 12.6 The name property of functions
### 函数的name属性

The name property of a function contains the function’s name:

        > function foo() {}
        > foo.name
        'foo'


This property is useful for debugging (its value shows up in stack traces) and some metaprogramming tasks (picking a function by name etc.).

Prior to ECMAScript 6, this property was already supported by most engines. With ES6, it becomes part of the language standard and is frequently filled in automatically.


### 12.6.1 Constructs that provide names for functions

The following sections describe how name is set up automatically for various programming constructs.

### 12.6.1.1 Variable declarations and assignments

Functions pick up names if they are created via variable declarations:

        let func1 = function () {};
        console.log(func1.name); // func1

        const func2 = function () {};
        console.log(func2.name); // func2

        var func3 = function () {};
        console.log(func3.name); // func3


But even with a normal assignment, name is set up properly:

        let func4;
        func4 = function () {};
        console.log(func4.name); // func4

        var func5;
        func5 = function () {};
        console.log(func5.name); // func5

With regard to names, arrow functions are like anonymous function expressions:

关于name属性 箭头函数与匿名函数表达式类似

const func = () => {};
console.log(func.name); // func

From now on, whenever you see an anonymous function expression, you can assume that an arrow function works the same way.

### 12.6.1.2 Default values

If a function is a default value, it gets its name from its variable or parameter:

        let [func1 = function () {}] = [];
        console.log(func1.name); // func1

        let { f2: func2 = function () {} } = {};
        console.log(func2.name); // func2

        function g(func3 = function () {}) {
            return func3.name;
        }
        console.log(g()); // func3

### 12.6.1.3 Named function definitions

Function declarations and function expression are function definitions. This scenario has been supported for a long time: a function definition with a name passes it on to the name property.

For example, a function declaration:

        function foo() {}
        console.log(foo.name); // foo

The name of a named function expression also sets up the name property.

        const bar = function baz() {};
        console.log(bar.name); // baz

Because it comes first, the function expression’s name baz takes precedence over other names (e.g. the name bar provided via the variable declaration):

对于函数表达式的如果已经有name 优于函数表达式的赋值的name

However, as in ES5, the name of a function expression is only a variable inside the function expression:

这个函数赋值一个变量通过表达式 这个函数名字只能函数体能使用 函数体外不可以使用

        const bar = function baz() {
            console.log(baz.name); // baz
        };
        bar();
        console.log(baz); // ReferenceError


### 12.6.1.4 Methods in object literals

If a function is the value of a property, it gets its name from that property. It doesn’t matter if that happens via a method definition (line A), a traditional property definition (line B), a property definition with a computed property key (line C) or a property value shorthand (line D).

在对象定义方法 可以直接添加外部函数名

        function func() {}
        let obj = {
            m1() {}, // (A)
            m2: function () {}, // (B)
            ['m' + '3']: function () {}, // (C)
            func, // (D)
        };
        console.log(obj.m1.name); // m1
        console.log(obj.m2.name); // m2
        console.log(obj.m3.name); // m3
        console.log(obj.func.name); // func

The names of getters are prefixed with 'get', the names of setters are prefixed with 'set':

设置getters前面加get前缀  设置setters前面加set前缀

        let obj = {
            get foo() {},
            set bar(value) {},
        };
        let getter = Object.getOwnPropertyDescriptor(obj, 'foo').get;
        console.log(getter.name); // 'get foo'

        let setter = Object.getOwnPropertyDescriptor(obj, 'bar').set;
        console.log(setter.name); // 'set bar'

### 12.6.1.5 Methods in class definitions
### 在类中定义方法

The naming of methods in class definitions is similar to object literals:

在类中定义方法是prototype 如果有私有方法加static前缀 方法名可以计算

        class C {
            m1() {}
            ['m' + '2']() {} // computed property key

            static classMethod() {}
        }
        console.log(C.prototype.m1.name); // m1
        console.log(new C().m1.name); // m1

        console.log(C.prototype.m2.name); // m2

        console.log(C.classMethod.name); // classMethod


Getters and setters again have the name prefixes 'get' and 'set', respectively(各自):

        class C {
            get foo() {}
            set bar(value) {}
        }
        let getter = Object.getOwnPropertyDescriptor(C.prototype, 'foo').get;
        console.log(getter.name); // 'get foo'

        let setter = Object.getOwnPropertyDescriptor(C.prototype, 'bar').set;
        console.log(setter.name); // 'set bar'


### 12.6.1.6 Methods whose keys are symbols

In ES6, the key of a method can be a symbol. The name property of such a method is still a string:

If the symbol has a description, the method’s name is the description in square brackets.
Otherwise, the method’s name is the empty string ('').

        const key1 = Symbol('description');
        const key2 = Symbol();

        let obj = {
            [key1]() {},
            [key2]() {},
        };
        console.log(obj[key1].name); // '[description]'
        console.log(obj[key2].name); // ''

### 12.6.1.7 Class definitions

Remember that class definitions create functions. Those functions also have their property name set up correctly:

类的声明也可以通过表达式方式

        class Foo {}
        console.log(Foo.name); // Foo

        const Bar = class {};
        console.log(Bar.name); // Bar


### 12.6.1.8 Default exports

All of the following statements set name to 'default':

        export default function () {}
        export default (function () {});

        export default class {}
        export default (class {});

        export default () => {};


### 12.6.1.9 Other programming constructs

* Generator functions and generator methods get their names the same way that normal functions and methods do.

生成器函数和正常函数一样

* new Function() produces functions whose name is 'anonymous'. [A webkit bug](https://bugs.webkit.org/show_bug.cgi?id=7726) describes why that is necessary on the web.


* func.bind() produces a function whose name is 'bound '+func.name:

如果函数是通过bind绑定的方式 函数name是:bound + function.name;

          function foo(x) {
              return x
          }
          const bound = foo.bind(undefined, 123);
          console.log(bound.name); // 'bound foo'

### 12.6.2 Caveats ⚠️警告

### 12.6.2.1 Caveat: the name of a function is always assigned at creation
### 警告 函数的name属性在创建的时候就确定了

Function names are always assigned during creation and never changed later on. That is, JavaScript engines detect the previously mentioned patterns and create functions that start their lives with the correct names. The following code demonstrates that the name of the function created by functionFactory() is assigned in line A and not changed by the declaration in line B.

函数的name属性在创建的时候就确定了且不能改变


          function functionFactory() {
              return function () {}; // (A)
          }
          const foo = functionFactory(); // (B)
          console.log(foo.name.length); // 0 (anonymous)

One could, in theory, check for each assignment whether the right-hand side evaluates to a function and whether that function doesn’t have a name, yet. But that would incur a significant performance penalty.

### 12.6.2.2 Caveat: minification
### 警告: 最小化

Function names are subject to minification, which means that they will usually change in minified code. Depending on what you want to do, you may have to manage function names via strings (which are not minified) or you may have to tell your minifier what names not to minify.


### 12.6.3 Changing the names of functions

These are the attributes of property name:

        > let func = function () {}
        > Object.getOwnPropertyDescriptor(func, 'name')
        { value: 'func',
          writable: false,
          enumerable: false,
          configurable: true }


The property not being writable means that you can’t change its value via assignment:

        > func.name = 'foo';
        > func.name
        'func'


The property is, however, configurable, which means that you can change it by re-defining it:

        > Object.defineProperty(func, 'name', {value: 'foo', configurable: true});
        > func.name
        'foo'


If the property name already exists then you can omit the descriptor property configurable, because missing descriptor properties mean that the corresponding attributes are not changed.

If the property name does not exist yet then the descriptor property configurable ensures that name remains configurable (the default attribute values are all false or undefined).


### 12.6.4 The function property name in the spec

* The spec operation SetFunctionName() sets up the property name. Search for its name in the spec to find out where that happens.

  * The third parameter of that operation specifies a name prefix. It is used for:
    * Getters and setters (prefixes 'get' and 'set')
    * Function.prototype.bind() (prefix 'bound')

* Anonymous function expressions not having a property name can be seen by looking at their runtime semantics:

  * The names of named function expressions are set up via SetFunctionName(). That operation is not invoked for anonymous function expressions.
  * The names of function declarations are set up when entering a scope (they are hoisted!).
* When an arrow function is created, no name is set up, either (SetFunctionName() is not invoked).


### 12.7 FAQ: callable entities

### 12.7.1 How do I determine whether a function was invoked via new?

ES6 has a new protocol for subclassing, which is explained in the chapter on classes. Part of that protocol is the meta-property new.target, which refers to the first element in a chain of constructor calls (similar to this in a chain for supermethod calls).

在ES6中新添加一个属性new.target属性 这个属性引用构造器调用链中第一个元素 类似于super方法被调用

It is undefined if there is no constructor call. We can use that to enforce that a function must be invoked via new or that it must not be invoked via it. This is an example for the latter:

new.target是null 构造器没有调用 而是按照普通函数调用 我们强迫一个函数必须用new调用而不是普通方式 通过new.target或者this(ES5)

function realFunction() {
    if (new.target !== undefined) {
        throw new Error('Can’t be invoked via `new`');
    }
    ···
}

In ES5, this was usually checked like this:

function realFunction() {
    "use strict";
    if (this !== undefined) {
        throw new Error('Can’t be invoked via `new`');
    }
    ···
}

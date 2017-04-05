### 13. Arrow functions
---
* 13.1. Overview
* 13.2. Traditional functions are bad non-method functions, due to this
  * 13.2.1. Solution 1: that = this
  * 13.2.2. Solution 2: specifying a value for this
  * 13.2.3. Solution 3: bind(this)
  * 13.2.4. ECMAScript 6 solution: arrow functions
* 13.3. Arrow function syntax
  * 13.3.1. Omitting parentheses around single parameters
* 13.4. Lexical variables
  * 13.4.1. Sources of variable values: static versus dynamic
  * 13.4.2. Variables that are lexical in arrow functions
* 13.5. Syntax pitfalls
  * 13.5.1. Arrow functions bind very loosely
  * 13.5.2. No line break after arrow function parameters
  * 13.5.3. You can’t use statements as expression bodies
  * 13.5.4. Returning object literals
* 13.6. Immediately-invoked arrow functions
* 13.7. Arrow functions versus bind()
  * 13.7.1. Extracting methods
  * 13.7.2. this via parameters
  * 13.7.3. Partial evaluation
* 13.8. Arrow functions versus normal functions
* 13.9. FAQ: arrow functions
  * 13.9.1. Why are there “fat” arrow functions (=>) in ES6, but no “thin” arrow functions (->)?

---

### 13.1 Overview

There are two benefits to arrow functions.

箭头函数有两个优点

First, they are less verbose than traditional function expressions:

第一个 箭头函数简洁相对于传统函数表达式

        const arr = [1, 2, 3];
        const squares = arr.map(x => x * x);

// Traditional function expression:

        const squares = arr.map(function (x) { return x * x });

Second, their this is picked up from surroundings (lexical). Therefore, you don’t need bind() or that = this, anymore.

第二个 箭头函数中this是词法作用域 因而不再不需要bind 和 that = this

          function UiComponent() {
              const button = document.getElementById('myButton');
              button.addEventListener('click', () => {
                  console.log('CLICK');
                  this.handleClick(); // lexical `this`
              });
          }

The following variables are all lexical inside arrow functions:

下面四个变量在箭头函数是词法作用域:
* arguments
* super
* this
* new.target

### 13.2 Traditional functions are bad non-method functions, due to this

In JavaScript, traditional functions can be used as:
在JavaScript中传统函数可以被用来: 非方法函数  方法 构造器

* Non-method functions
* Methods
* Constructors

These roles clash: Due to roles 2 and 3, functions always have their own this. But that prevents you from accessing the this of, e.g., a surrounding method from inside a callback (role 1).

2和3是冲突 函数总有它自己this 但是阻止你访问this---词法作用域对于回调函数

You can see that in the following ES5 code:

          function Prefixer(prefix) {
              this.prefix = prefix;
          }

          Prefixer.prototype.prefixArray = function (arr) { // (A)
              'use strict';
              return arr.map(function (x) { // (B)
                  // Doesn’t work:
                  return this.prefix + x; // (C)
              });
          };


In line C, we’d like to access this.prefix, but can’t, because the this of the function from line B shadows the this of the method from line A.

In line C 你想访问this.prefix 但是不可以 因为 line B 罩盖 line A的this

In strict mode, this is undefined in non-method functions, which is why we get an error if we use Prefixer:

在严格模式中 在非方法函数中this是undefined 这也是你用Prefixer产生错误的原因

          > var pre = new Prefixer('Hi ');
          > pre.prefixArray(['Joe', 'Alex'])
          TypeError: Cannot read property 'prefix' of undefined


There are three ways to work around this problem in ECMAScript 5.

在ECMAScript 5有三种解决方法

### 13.2.1 Solution 1: that = this

You can assign this to a variable that isn’t shadowed. That’s what’s done in line A, below:

        function Prefixer(prefix) {
            this.prefix = prefix;
        }

        Prefixer.prototype.prefixArray = function (arr) {
            var that = this; // (A)
            return arr.map(function (x) {
                return that.prefix + x;
            });
        };


Now Prefixer works as expected:

        > var pre = new Prefixer('Hi ');
        > pre.prefixArray(['Joe', 'Alex'])
        [ 'Hi Joe', 'Hi Alex' ]

### 13.2.2 Solution 2: specifying a value for this

A few Array methods have an extra parameter for specifying the value that this should have when invoking the callback. That’s the last parameter in line A, below.

        function Prefixer(prefix) {
            this.prefix = prefix;
        }

        Prefixer.prototype.prefixArray = function (arr) {
            return arr.map(function (x) {
                return this.prefix + x;
            }, this); // (A)
        };

### 13.2.3 Solution 3: bind(this)

You can use the method bind() to convert a function whose this is determined by how it is called (via call(), a function call, a method call, etc.) to a function whose this is always the same fixed value. That’s what we are doing in line A, below.


        function Prefixer(prefix) {
            this.prefix = prefix;
        }

        Prefixer.prototype.prefixArray = function (arr) {
            return arr.map(function (x) {
                return this.prefix + x;
            }.bind(this)); // (A)
        };

### 13.2.4 ECMAScript 6 solution: arrow functions

Arrow functions work much like solution 3. However, it’s best to think of them as a new kind of functions that don’t lexically shadow this.

That is, they are different from normal functions (you could even say that they do less). They are not normal functions plus binding.

With an arrow function, the code looks as follows.

        function Prefixer(prefix) {
            this.prefix = prefix;
        }
        Prefixer.prototype.prefixArray = function (arr) {
            return arr.map((x) => {
                return this.prefix + x;
            });
        };

To fully ES6-ify the code, you’d use a class and a more compact variant of arrow functions:

        class Prefixer {
            constructor(prefix) {
                this.prefix = prefix;
            }

            prefixArray(arr) {
                return arr.map(x => this.prefix + x); // (A)
            }
        }

In line A we save a few characters by tweaking two parts of the arrow function:

* If there is only one parameter and that parameter is an identifier then the parentheses can be omitted.

如果只有一个参数 参数外面圆括号可以省略

* An expression following the arrow leads to that expression being returned.

如果表达式在箭头后面相当于return该值


### 13.3 Arrow function syntax

The “fat” arrow => (as opposed to the thin arrow ->) was chosen to be compatible with CoffeeScript, whose fat arrow functions are very similar.

胖箭头 => 相当于 瘦箭头 -> 只所以选择胖函数是为了与CoffeeScript兼容

Specifying parameters:

* () => { ... } // no parameter 无参数
* x => { ... } // one parameter, an identifier 只有一个参数
* (x, y) => { ... } // several parameters 多个参数

Specifying a body:

* x => { return x * x }  // block
* x => x * x  // expression, equivalent to previous line

The statement block behaves like a normal function body. For example, you need return to give back a value. With an expression body, the expression is always implicitly returned.

Note how much an arrow function with an expression body can reduce verbosity. Compare:

记住 箭头函数表达式体减少繁琐

        const squares = [1, 2, 3].map(function (x) { return x * x });
        const squares = [1, 2, 3].map(x => x * x);

### 13.3.1 Omitting parentheses around single parameters

Omitting the parentheses around the parameters is only possible if they consist of a single identifier:

        > [1,2,3].map(x => 2 * x)
        [ 2, 4, 6 ]

As soon as there is anything else, you have to type the parentheses, even if there is only a single parameter. For example, you need parens if you destructure a single parameter:

        > [[1,2], [3,4]].map(([a,b]) => a + b)
        [ 3, 7 ]

And you need parens if a single parameter has a default value (undefined triggers the default value!):

        > [1, undefined, 3].map((x='yes') => x)
        [ 1, 'yes', 3 ]

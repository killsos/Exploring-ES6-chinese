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

只有一个参数可以省略圆括号 其他都不可以

        > [1,2,3].map(x => 2 * x)
        [ 2, 4, 6 ]

As soon as there is anything else, you have to type the parentheses, even if there is only a single parameter. For example, you need parens if you destructure a single parameter:

如果你想解构一个参数 这时候虽然是一个参数 但是要加圆括号

        > [[1,2], [3,4]].map(([a,b]) => a + b)
        [ 3, 7 ]

And you need parens if a single parameter has a default value (undefined triggers the default value!):

如果需要括号如果参数有默认值 默认值通过undefined来触发

        > [1, undefined, 3].map((x='yes') => x)
        [ 1, 'yes', 3 ]

### 13.4 Lexical variables
### 词法变量

### 13.4.1 Propagating variable values: static versus dynamic
### 传播变量值 静态与动态

The following are two ways in which the values of variables can be propagated.

下面变量值确定的两个方法

First, statically (lexically): Where a variable is accessible is determined by the structure of the program. Variables declared in a scope are accessible in all scopes nested inside it (unless shadowed). For example:

首先 静态就是词法的 一个变量是否可以被访问取决于编码结构 在一个作用域的变量声明可以被所有作用域访问是做内嵌的里面的

        const x = 123;

        function foo(y) {
            return x; // value received statically
        }

Second, dynamically: Variable values can be propagated via function calls. For example:

动态是指在函数调用时候来确定变量值

function bar(arg) {
    return arg; // value received dynamically
}

### 13.4.2 Variables that are lexical in arrow functions
### 箭头的变量值是词法的

The source of this is an important distinguishing aspect of arrow functions:

这是箭头函数是最重要的区别

Traditional functions have a dynamic this; its value is determined by how they are called.
Arrow functions have a lexical this; its value is determined by the surrounding scope.

传统函数的this是动态的 this取决于被调用 箭头函数是词法this---静态 这个this是所包含的作用域

The complete list of variables whose values are determined lexically is:

下面变量也是词法的

      * arguments
      * super
      * this
      * new.target

### 13.5 Syntax pitfalls
### 语法陷阱

There are a few syntax-related details that can sometimes trip you up.

这里有容易犯的语法细节

### 13.5.1 Arrow functions bind very loosely

If you view => as an operator, you could say that it has a low precedence, that it binds loosely. That means that if it is in conflict with other operators, they usually win.

如果认为=>是一个操作符 你可以认为有低的优先级 松散绑定 这就意味着与其他操作符冲突 其他操作符优先

The reason for that is to allow an expression body to “stick together”:

        const f = x => (x % 2) === 0 ? x : 0;

In other words, we want => to lose the fight against === and ?. We want it to be interpreted as follows

        const f = x => ((x % 2) === 0 ? x : 0);

If => won against both, it would look like this:

        const f = (x => (x % 2)) === 0 ? x : 0;

If => lost against ===, but won against ?, it would look like this:

        const f = (x => ((x % 2) === 0)) ? x : 0;

As a consequence, you often have to wrap arrow functions in parentheses if they compete with other operators. For example:

        console.log(typeof () => {}); // SyntaxError
        console.log(typeof (() => {})); // OK

On the flip side（另一方面）, you can use typeof as an expression body without putting it in parens:

const f = x => typeof x;

### 13.5.2 No line break after arrow function parameters

ES6 forbids a line break between the parameter definitions and the arrow of an arrow function:

ES6禁止箭头函数的参数与=>不在同一行


          const func1 = (x, y) // SyntaxError
          => {
              return x + y;
          };

          const func2 = (x, y) => // OK
          {
              return x + y;
          };

          const func3 = (x, y) => { // OK
              return x + y;
          };

          const func4 = (x, y) // SyntaxError
          => x + y;

          const func5 = (x, y) => // OK
          x + y;

Line breaks inside parameter definitions are OK:

如果参数分行 这时候参数与=>可以分行

          const func6 = ( // OK
              x,
              y
          ) => {
              return x + y;
          };


The rationale for this restriction is that it keeps the options open w.r.t. “headless” arrow functions in the future (you’d be able to omit the parentheses when defining an arrow function with zero parameters).

### 13.5.3 You can’t use statements as expression bodies
### 不可以语句作为表达式体

### 13.5.3.1 Expressions versus statements

Quick review (consult “Speaking JavaScript” for more information):

Expressions produce (are evaluated to) values. Examples:

表达式一定会产生一个值

          3 + 4
          foo(7)
          'abc'.length

Statements do things. Examples:

语句是做什么

          while (true) { ··· }
          return 123;


Most expressions can be used as statements, simply by mentioning them in statement positions:


            function bar() {
                3 + 4;
                foo(7);
                'abc'.length;
            }

### 13.5.3.2 The bodies of arrow functions

If an expression is the body of an arrow function, you don’t need braces:

如果表达式是箭头函数体 就不需要花括号

          asyncFunc.then(x => console.log(x));

However, statements have to be put in braces:


asyncFunc.catch(x => { throw x });

### 3.5.4 Returning object literals

Some parts of JavaScript’s syntax are ambiguous. Take, for example, the following code.

{
    bar: 123
}

It could be:

An object literal with a single property, bar.

A block with the label bar and the expression statement 123.

Given that the body of an arrow function can be either an expression or a statement, you have to put an object literal in parentheses if you want it to be an expression body:

箭头函数返回对象字面量时候必须加圆括号

        > const f1 = x => ({ bar: 123 });
        > f1()
        { bar: 123 }

For comparison, this is an arrow function whose body is a block:


        > const f2 = x => { bar: 123 };
        > f2()
        undefined


### 13.6 Immediately-invoked arrow functions
### 自执行箭头函数

Remember Immediately Invoked Function Expressions (IIFEs)? They look as follows and are used to simulate block-scoping and value-returning blocks in ECMAScript 5:

        (function () { // open IIFE
            // inside IIFE
        })(); // close IIFE

You can save a few characters if you use an Immediately Invoked Arrow Function (IIAF):

        (() => {
            return 123
        })();


### 13.6.1 Semicolons
### 分号

Similarly to IIFEs, you should terminate IIAFs with semicolons (or use an equivalent measure), to avoid two consecutive IIAFs being interpreted as a function call (the first one as the function, the second one as the parameter).

IIAFs以分号结束 为了避免两个连续IIAFs被解释为函数调用 前一个被认为函数 后一个被认为参数


### 13.6.2 Parenthesizing arrow function with block bodies

Even if the IIAF has a block body, you must wrap it in parentheses, because it can’t be (directly) function-called. The reason for this syntactic constraint is consistency with arrow functions whose bodies are expressions (as explained next).

As a consequence, the parentheses must be around the arrow function. In contrast, you have a choice with IIFEs – you can either put the parentheses around the whole expression:

          (function () {
              ···
          }());

Or just around the function expression:

          (function () {
              ···
          })();

Given how arrow functions work, the latter way of parenthesizing should be preferred from now on.

### 13.6.3 Parenthesizing arrow function with expression bodies

If you want to understand why you can’t invoke an arrow function by putting parentheses immediately after it, you have to examine how expression bodies work: parentheses after an expression body should be part of the expression, not an invocation of the whole arrow function. This has to do with arrow functions binding loosely, as explained in a previous section.

Let’s look at an example:

          const value = () => foo();

This should be interpreted as:

          const value = () => (foo());

And not as:

          const value = (() => foo)();

Further reading: A section in the chapter on callable entities has more information on using IIFEs and IIAFs in ES6. Spoiler: you rarely need them, as ES6 often provides better alternatives.

### 13.7 Arrow functions versus bind()
### 箭头函数与bind()

ES6 arrow functions are often a compelling alternative to Function.prototype.bind().

ES6箭头函数是一个Function.prototype.bind()不错的替代方法

### 13.7.1 Extracting methods

If an extracted method is to work as a callback, you must specify a fixed this, otherwise it will be invoked as a function (and this will be undefined or the global object). For example:

抽取方法作为回调函数 你必须明确指定this 否则作为一个函数被执行 this是undefined或全局对象

        obj.on('anEvent', this.handleEvent.bind(this));

An alternative is to use an arrow function:

      obj.on('anEvent', event => this.handleEvent(event));


### 13.7.2 this via parameters
### this作为参数

The following code demonstrates a neat trick: For some methods, you don’t need bind() for a callback, because they let you specify the value of this, via an additional parameter. filter() is one such method:


          const as = new Set([1, 2, 3]);
          const bs = new Set([3, 2, 4]);
          const intersection = [...as].filter(bs.has, bs);
              // [2, 3]

However, this code is easier to understand if you use an arrow function:

          const as = new Set([1, 2, 3]);
          const bs = new Set([3, 2, 4]);
          const intersection = [...as].filter(a => bs.has(a));


### 13.7.3 Partial evaluation
### 部分求值

bind() enables you to do partial evaluation, you can create new functions by filling in parameters of an existing function:

bind()进行部分求值 然后创造一个新函数---填充一些参数对于已经存在的函数

          function add(x, y) {
              return x + y;
          }
          const plus1 = add.bind(undefined, 1);

Again, I find an arrow function easier to understand:

          const plus1 = y => add(1, y);

### 13.8 Arrow functions versus normal functions

An arrow function is different from a normal function in only two ways:

箭头函数与普通函数最大区别有两个方面:

The following constructs are lexical: arguments, super, this, new.target

It can’t be used as a constructor: Normal functions support new via the internal method [[Construct]] and the property prototype. Arrow functions have neither, which is why new (() => {}) throws an error.

箭头函数不能作为构造器函数 通常函数支持new操作符通过函数内部方法[[Construct]]---原型属性 箭头函数没有这个属性

Apart from that, there are no observable differences between an arrow function and a normal function. For example, typeof and instanceof produce the same results:

除了这个，还有一个不容易观察到区别在箭头函数与正常函数 typeof和instanceof

箭头函数typeof是函数 instanceof Function 返回也是真

普通函数typeof是函数 instanceof Function 返回也是真

          > typeof (() => {})
          'function'

          > () => {} instanceof Function
          true

          > typeof function () {}
          'function'

          > function () {} instanceof Function
          true


### 13.9 FAQ: arrow functions

### 13.9.1 Why are there “fat” arrow functions (=>) in ES6, but no “thin” arrow functions (->)?

### 为何有胖箭头函数而没有瘦箭头函数

ECMAScript 6 has syntax for functions with a lexical this, so-called arrow functions.

However, it does not have arrow syntax for functions with dynamic this.

That omission was deliberate; method definitions cover most of the use cases for thin arrows. If you really need dynamic this, you can still use a traditional function expression.

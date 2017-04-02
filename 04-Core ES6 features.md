### 4. Core ES6 features
---

This chapter describes the core ES6 features. These features are easy to adopt; the remaining features are mainly of interest to library authors. I explain each feature via the corresponding ES5 code.

这一章描述了ES6核心特性。这些特性很容易用到;剩下的功能主要通过作者感兴趣的库来介绍。我将通过相应的ES5代码来解释每一个特色。

---

* 4.1. From var to const/let
* 4.2. From IIFEs to blocks
* 4.3. From concatenating strings to template literals
  * 4.3.1. String interpolation
  * 4.3.2. Multi-line strings
* 4.4. From function expressions to arrow functions
* 4.5. Handling multiple return values
  * 4.5.1. Multiple return values via arrays
  * 4.5.2. Multiple return values via objects
* 4.6. From for to forEach() to for-of
* 4.7. Handling parameter default values
* 4.8. Handling named parameters
  * 4.8.1. Making the parameter optional
* 4.9. From arguments to rest parameters
* 4.10. From apply() to the spread operator (...)
  * 4.10.1. Math.max()
  * 4.10.2. Array.prototype.push()
* 4.11. From concat() to the spread operator (...)
* 4.12. From function expressions in object literals to method definitions
* 4.13. From constructors to classes
  * 4.13.1. Base classes
  * 4.13.2. Derived classes
* 4.14. From custom error constructors to subclasses of Error
* 4.15. From objects to Maps
* 4.16. New string methods
* 4.17. New Array methods
  * 4.17.1. From Array.prototype.indexOf to Array.prototype.findIndex
  * 4.17.2. From Array.prototype.slice() to Array.from() or the spread operator
  * 4.17.3. From apply() to Array.prototype.fill()
* 4.18. From CommonJS modules to ES6 modules
  * 4.18.1. Multiple exports
  * 4.18.2. Single exports
* 4.19. What to do next

---

### 4.1 From var to const/let

In ES5, you declare variables via var. Such variables are function-scoped, their scopes are the innermost enclosing functions. The behavior of var is occasionally confusing. This is an example:

在ES5代码中，声明一个变量通过关键字var。这样声明变量是函数作用域, 变量作用域是包含该变量最近的函数里,容易引起困扰.
看下面这个列子:

        var x = 3;
        function func(randomize) {
          if (randomize) {
            var x = Math.random(); // (A) scope: whole function
            return x;
          }
          return x; // accesses the x from line A
        }
        func(false); // undefined


That func() returns undefined may be surprising. You can see why if you rewrite the code so that it more closely reflects what is actually going on:

函数func返回undefined让人感觉很奇怪 重写下面代码你就可以看到为什么了,让它更真实地反映出实际上是怎么回事。


        var x = 3;
        function func(randomize) {
            var x;
            if (randomize) {
                x = Math.random();
                return x;
              }
              return x;
            }
            func(false); // undefined


In ES6, you can additionally declare variables via let and const. Such variables are block-scoped, their scopes are the innermost enclosing blocks. let is roughly a block-scoped version of var. const works like let, but creates variables whose values can’t be changed.

在ES6添加let和const关键词声明变量 这样两个关键字声明变量是块级作用域 const声明不能改变其值

let and const behave more strictly and throw more exceptions (e.g. when you access their variables inside their scope before they are declared). Block-scoping helps with keeping the effects of code fragments more local (see the next section for a demonstration). And it’s more mainstream than function-scoping, which eases moving between JavaScript and other programming languages.

let const 表现更加严格并且抛出跟多意外 例如在声明之前访问 便于javascipt代码和主流代码移植

If you replace var with let in the initial version, you get different behavior:

如果用let替换var 会有不同表现

        let x = 3;
        function func(randomize) {
            if (randomize) {
                let x = Math.random();
                return x;
              }
              return x;
        }
        func(false); // 3


That means that you can’t blindly replace var with let or const in existing code; you have to be careful during refactoring.

不要简单用let替换var在已经有代码中

My advice is:

建议如下

Prefer const. You can use it for all variables whose values never change.

喜欢const创建一个常量

Otherwise, use let – for variables whose values do change.

否则用let创建一个变量

Avoid var.

避免使用var声明


### 4.2 From IIFEs to blocks

In ES5, you had to use a pattern called IIFE (Immediately-Invoked Function Expression) if you wanted to restrict the scope of a variable tmp to a block:

在ES5中想限制一个变量作用域在一个块中就不得不使用IIFE 自执行函数表达式

        (function () {  // open IIFE
            var tmp = ···;
            ···
        }());  // close IIFE

        console.log(tmp); // ReferenceError

In ECMAScript 6, you can simply use a block and a let declaration (or a const declaration):

在ES6中就使用块级作用域就很简单,使用let就可以了

      {  // open block
          let tmp = ···;
          ···
      }  // close block

More information: section [“Avoid IIFEs in ES6”](http://exploringjs.com/es6/ch_callables.html#sec_iifes-in-es6).

### 4.3 From concatenating strings to template literals

With ES6, JavaScript finally gets literals for string interpolation and multi-line strings.

在ES6中JavaScript实现字符串插值和多行字符串字面值

### 4.3.1 String interpolation

In ES5, you put values into strings by concatenating those values and string fragments:

在ES5中,将一个变量值放入到字符串需要通过链接方式和字符串片段

        function printCoord(x, y) {
            console.log('('+x+', '+y+')');
        }

In ES6 you can use string interpolation via template literals:

在ES6中 可以使用字符串插值通过模板字面值方式

        function printCoord(x, y) {
            console.log(`(${x}, ${y})`);
        }


### 4.3.2 Multi-line strings

Template literals also help with representing multi-line strings.

字符串模板方式也可以实现多行字符串 字符串模板是两个反引号来定义``

For example, this is what you have to do to represent one in ES5:

需要多个换行符\n


        var HTML5_SKELETON =
            '<!doctype html>\n' +
            '<html>\n' +
            '<head>\n' +
            '    <meta charset="UTF-8">\n' +
            '    <title></title>\n' +
            '</head>\n' +
            '<body>\n' +
            '</body>\n' +
            '</html>\n';

If you escape the newlines via backslashes, things look a bit nicer (but you still have to explicitly add newlines):

转义换行符通过反斜线 当时依然需要添加换行符

      var HTML5_SKELETON = '\
          <!doctype html>\n\
          <html>\n\
          <head>\n\
              <meta charset="UTF-8">\n\
              <title></title>\n\
          </head>\n\
          <body>\n\
          </body>\n\
          </html>';

ES6 template literals can span multiple lines:

ES6 模板字面量方式就可以跨多行 无需添加换行符

        const HTML5_SKELETON = `
        <!doctype html>
        <html>
        <head>
        <meta charset="UTF-8">
        <title></title>
        </head>
        <body>
        </body>
        </html>`;

The examples differ in how much whitespace is included, but that doesn’t matter in this case.

这个例子包含很多空格但是在情况下没关系

### 4.4 From function expressions to arrow functions
   

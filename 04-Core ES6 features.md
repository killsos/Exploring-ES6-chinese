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

In current ES5 code, you have to be careful with this whenever you are using function expressions. In the following example, I create the helper variable _this (line A) so that the this of UiComponent can be accessed in line B.

在ES5袋中 需要小心this当使用函数表达式 在下面这列中 需要创建_this变量来访问到UiComponent所代表this


        function UiComponent() {
            var _this = this; // (A)
            var button = document.getElementById('myButton');
            button.addEventListener('click', function () {
                // 如果这里使用this 则指向button对象
                console.log('CLICK');
                _this.handleClick(); // (B)
            });
        }
        UiComponent.prototype.handleClick = function () {
            ···
        };

In ES6, you can use arrow functions, which don’t shadow this (line A):

在ES6中 可以使用箭头函数---不影响this的指向 原因 箭头函数中this指向取决于声明时候位置this的指向
而普通函数表达式取决于执行时候this的指向

        function UiComponent() {
            var button = document.getElementById('myButton');
            button.addEventListener('click', () => {
                console.log('CLICK');
                this.handleClick(); // (A)
            });
        }

Arrow functions are especially handy for short callbacks that only return results of expressions

箭头函数特别方便时短回调函数---只有返回一个值

In ES5, such callbacks are relatively verbose:

在ES5中 回调函数相对繁琐

        var arr = [1, 2, 3];
        var squares = arr.map(function (x) { return x * x });

In ES6, arrow functions are much more concise:

在ES6中 使用箭头函数就很简洁 不需要用return关键字

        const arr = [1, 2, 3];
        const squares = arr.map(x => x * x);

When defining parameters, you can even omit parentheses if the parameters are just a single identifier. Thus: (x) => x * x and x => x * x are both allowed.

当定义参数 可以省略圆括号如果只有一个参数的时候

### 4.5 Handling multiple return values
### 处理多个返回值

Some functions or methods return multiple values via arrays or objects. In ES5, you always need to create intermediate variables if you want to access those values. In ES6, you can avoid intermediate variables via destructuring.

ES5中在函数或方法返回多个值通过数组或者对象, 因此需要创建一个中间变量来完成. 而在ES6中 就可以避免中间变量通过解构


### 4.5.1 Multiple return values via arrays

exec() returns captured groups via an Array-like object. In ES5, you need an intermediate variable (matchObj in the example below), even if you are only interested in the groups:

        var matchObj =
            /^(\d\d\d\d)-(\d\d)-(\d\d)$/
            .exec('2999-12-31');
        var year = matchObj[1];
        var month = matchObj[2];
        var day = matchObj[3];

In ES6, destructuring makes this code simpler:

        const [, year, month, day] =
            /^(\d\d\d\d)-(\d\d)-(\d\d)$/
            .exec('2999-12-31');

The empty slot at the beginning of the Array pattern skips the Array element at index zero.

在数组中忽略索引0的值


### 4.5.2 Multiple return values via objects

The method Object.getOwnPropertyDescriptor() returns a property descriptor, an object that holds multiple values in its properties.

Object.getOwnPropertyDescriptor()这个方法返回一个属性描述的对象,这个对象拥有多个属性的描述值

In ES5, even if you are only interested in the properties of an object, you still need an intermediate variable (propDesc in the example below):


var obj = { foo: 123 };

var propDesc = Object.getOwnPropertyDescriptor(obj, 'foo');
var writable = propDesc.writable;
var configurable = propDesc.configurable;

console.log(writable, configurable); // true true
In ES6, you can use destructuring:

const obj = { foo: 123 };

const {writable, configurable} =
    Object.getOwnPropertyDescriptor(obj, 'foo');

console.log(writable, configurable); // true true

{writable, configurable} is an abbreviation(缩写) for:

{ writable: writable, configurable: configurable }

总结:数组解构按位置 对象解构按属性名

### 4.6 From for to forEach() to for-of

Prior to ES5, you iterated over Arrays as follows:

ES5之前 只能使用for循环

iterate vt. 迭代；重复；反复说；重做
iterator n. 迭代器；迭代程序
iterative adj. [数] 迭代的；重复的，反复的 n. 反复体
iteratively adv. 迭代地；反复地

        var arr = ['a', 'b', 'c'];
        for (var i=0; i<arr.length; i++) {
            var elem = arr[i];
            console.log(elem);
        }

In ES5, you have the option of using the Array method forEach():

在ES5 有新迭方式forEach

arr.forEach(function (elem) {
    console.log(elem);
});
A for loop has the advantage that you can break from it, forEach() has the advantage of conciseness.

for迭代可以通过break来停止迭代 forEach有点是简洁

arr.forEach(function callback(currentValue, index, array) {
    //your iterator
}[, thisArg]);

forEach 不能使用continue, break;  可以使用如下两种方式：
1. if 语句控制
2. return . (return true, false)
return --> 类似continue

        arryAll.forEach(function(e){  
            if(e%2==0)  
            {  
                arrySpecial.push(e);  
                return;  
            }  
            if(e%3==0)  
            {      
                arrySpecial.push(e);  
                return;  
            }  
        })

In ES6, the for-of loop combines both advantages:

在ES6的for-of循环集合这两个优点 for-of可以对字符串 数组 类数组 Map Set 进行迭代

for-of是通过Symbol.iterator这个方法来完成迭代 所以对象只要Symbol.iterator的方法就可以使用for-of来迭代


for in遍历的是数组的索引（即键名），而for of遍历的是数组元素值
for of遍历的只是数组内的元素，而不包括数组的原型属性method和索引name
遍历对象 通常用for in来遍历对象的键名
for in 可以遍历到myObject的原型方法method,如果不想遍历原型方法和属性的话，可以在循环内部判断一下,hasOwnPropery方法可以判断某属性是否是该对象的实例属性
同样可以通过ES5的Object.keys(myObject)获取对象的实例属性组成的数组，不包括原型方法和属性

        const arr = ['a', 'b', 'c'];
        for (const elem of arr) {
            console.log(elem);
            // a
            // b
            // c
        }


If you want both index and value of each array element, for-of has got you covered, too, via the new Array method entries() and destructuring:

for-of迭代是value 如果迭代index和value需要通过数组entries()同时解构

for (const [index, elem] of arr.entries()) {
    console.log(index+'. '+elem);
}


### 4.7 Handling parameter default values
### 参数的默认值

In ES5, you specify default values for parameters like this:

        function foo(x, y) {
            x = x || 0;
            y = y || 0;
            ···
        }
ES6 has nicer syntax:

        function foo(x=0, y=0) {
            ···
        }

An added benefit is that in ES6, a parameter default value is only triggered by undefined, while it is triggered by any false value in the previous ES5 code.

在ES5之前代码中 默认值被触发通过任何一个false value


### 4.8 Handling named parameters
### 处理有名的参数

A common way of naming parameters in JavaScript is via object literals (the so-called options object pattern):

有名的参数共同方法是通过对象

        selectEntries({ start: 0, end: -1 });

Two advantages of this approach are: Code becomes more self-descriptive and it is easier to omit arbitrary parameters.


In ES5, you can implement selectEntries() as follows:

        function selectEntries(options) {
            var start = options.start || 0;
            var end = options.end || -1;
            var step = options.step || 1;
            ···
        }
In ES6, you can use destructuring in parameter definitions and the code becomes simpler:

        function selectEntries({ start=0, end=-1, step=1 }) {
            ···
        }

### 4.8.1 Making the parameter optional
### 指定可选参数

To make the parameter options optional in ES5, you’d add line A to the code:


        function selectEntries(options) {
            options = options || {}; // (A)
            var start = options.start || 0;
            var end = options.end || -1;
            var step = options.step || 1;
            ···
        }

In ES6 you can specify {} as a parameter default value:

        function selectEntries({ start=0, end=-1, step=1 } = {}) {
            ···
        }

### 4.9 From arguments to rest parameters
### 从arguments到剩余参数

In ES5, if you want a function (or method) to accept an arbitrary number of arguments, you must use the special variable arguments:

        function logAllArguments() {
            for (var i=0; i < arguments.length; i++) {
                console.log(arguments[i]);
            }
        }

In ES6, you can declare a rest parameter (args in the example below) via the ... operator:

        function logAllArguments(...args) {
            for (const arg of args) {
                console.log(arg);
            }
        }

Rest parameters are even nicer if you are only interested in trailing parameters:  

trailing adj. 后面的；拖尾的；牵引的；被拖动的；蔓延的  
n. 拖尾；泥浆彩饰  
v. 尾随（trail的ing形式）  

        function format(pattern, ...args) {
            ···
        }

Handling this case in ES5 is clumsy:  
clumsy  adj. 笨拙的

        function format(pattern) {
            var args = [].slice.call(arguments, 1);
            ···
        }

Rest parameters make code easier to read: You can tell that a function has a variable number of parameters just by looking at its parameter definitions.

### 4.10 From apply() to the spread operator (...)
### 扩展操作符

In ES5, you turn arrays into parameters via apply(). ES6 has the spread operator for this purpose.

在ES5中将一个数组给一个函数作为参数需要apply 在ES6中可以扩展操作符就可以

### 4.10.1 Math.max()

Math.max() returns the numerically greatest of its arguments. It works for an arbitrary number of arguments, but not for Arrays.

ES5 – apply():

          > Math.max.apply(Math, [-1, 5, 11, 3])
          11

ES6 – spread operator:

        > Math.max(...[-1, 5, 11, 3])
        11

### 4.10.2 Array.prototype.push()

Array.prototype.push() appends all of its arguments as elements to its receiver. There is no method that destructively appends an Array to another one.

ES5 – apply():

        var arr1 = ['a', 'b'];
        var arr2 = ['c', 'd'];

        arr1.push.apply(arr1, arr2);
            // arr1 is now ['a', 'b', 'c', 'd']

ES6 – spread operator:

        const arr1 = ['a', 'b'];
        const arr2 = ['c', 'd'];

        arr1.push(...arr2);
            // arr1 is now ['a', 'b', 'c', 'd']

### 4.11 From concat() to the spread operator (...)
### 从concat到扩展符

The spread operator can also (non-destructively) turn the contents of its operand into Array elements. That means that it becomes an alternative to the Array method concat().

ES5 – concat():

            var arr1 = ['a', 'b'];
            var arr2 = ['c'];
            var arr3 = ['d', 'e'];

            console.log(arr1.concat(arr2, arr3));
                // [ 'a', 'b', 'c', 'd', 'e' ]

ES6 – spread operator:

            const arr1 = ['a', 'b'];
            const arr2 = ['c'];
            const arr3 = ['d', 'e'];

            console.log([...arr1, ...arr2, ...arr3]);
                // [ 'a', 'b', 'c', 'd', 'e' ]

### 4.12 From function expressions in object literals to method definitions
### 在对象中通过函数表达式定义方法

In JavaScript, methods are properties whose values are functions.

In ES5 object literals, methods are created like other properties. The property values are provided via function expressions.

                var obj = {
                    foo: function () {
                        ···
                    },
                    bar: function () {
                        this.foo();
                    }, // trailing comma is legal in ES5
                }

ES6 has method definitions, special syntax for creating methods:

                const obj = {
                    foo() {
                        ···
                    },
                    bar() {
                        this.foo();
                    },
                }

### 4.13 From constructors to classes
### 类中的构造器

ES6 classes are mostly just more convenient syntax for constructor functions.

### 4.13.1 Base classes
### 基本类

In ES5, you implement constructor functions directly:

                function Person(name) {
                    this.name = name;
                }
                Person.prototype.describe = function () {
                    return 'Person called '+this.name;
                };

In ES6, classes provide slightly more convenient syntax for constructor functions:

                class Person {
                    // 构造器
                    constructor(name) {
                        this.name = name;
                    }
                    // 原型上方法
                    describe() {
                        return 'Person called '+this.name;
                    }
                    // 静态方法
                    static action(){

                    }
                }

Note the compact syntax for method definitions – no keyword function needed. Also note that there are no commas between the parts of a class.

注意：1 方法定义不需要function关键字 2 类中的方法之间不需要逗号

### 4.13.2 Derived classes

Subclassing is complicated in ES5, especially referring to super-constructors and super-properties. This is the canonical way of creating a sub-constructor Employee of Person:

ES5中子类很复杂 父类-构造器 父类-属性

        function Employee(name, title) {
            Person.call(this, name); // super(name)
            this.title = title;
        }
        Employee.prototype = Object.create(Person.prototype);
        Employee.prototype.constructor = Employee;
        Employee.prototype.describe = function () {
            return Person.prototype.describe.call(this) // super.describe()
                   + ' (' + this.title + ')';
        };

ES6 has built-in support for subclassing, via the extends clause:

extends完成子类对父类的继承

        class Employee extends Person {
            constructor(name, title) {
                super(name);
                this.title = title;
            }
            describe() {
                return super.describe() + ' (' + this.title + ')';
            }
        }


### 4.14 From custom error constructors to subclasses of Error

In ES5, it is impossible to subclass the built-in constructor for exceptions, Error. The following code shows a work-around that gives the constructor MyError important features such as a stack trace:

work-around n. 工作区；变通方案；权变措施


        function MyError() {
            // Use Error as a function
            var superInstance = Error.apply(null, arguments);
            copyOwnPropertiesFrom(this, superInstance);
        }
        MyError.prototype = Object.create(Error.prototype);
        MyError.prototype.constructor = MyError;

        function copyOwnPropertiesFrom(target, source) {
            Object.getOwnPropertyNames(source)
            .forEach(function(propKey) {
                var desc = Object.getOwnPropertyDescriptor(source, propKey);
                Object.defineProperty(target, propKey, desc);
            });
            return target;
        };

In ES6, all built-in constructors can be subclassed, which is why the following code achieves what the ES5 code can only simulate:

        class MyError extends Error {
        }


### 4.15 From objects to Maps
### 从对象到映射

The Map object is a simple key/value map. Any value (both objects and primitive values) may be used as either a key or a value.

Using the language construct object as a map from strings to arbitrary values (a data structure) has always been a makeshift solution in JavaScript. The safest way to do so is by creating an object whose prototype is null. Then you still have to ensure that no key is ever the string '__proto__', because that property key triggers special functionality in many JavaScript engines.

The following ES5 code contains the function countWords that uses the object dict as a map:

        var dict = Object.create(null);
        function countWords(word) {
            var escapedWord = escapeKey(word);
            if (escapedWord in dict) {
                dict[escapedWord]++;
            } else {
                dict[escapedWord] = 1;
            }
        }
        function escapeKey(key) {
            if (key.indexOf('__proto__') === 0) {
                return key+'%';
            } else {
                return key;
            }
        }

In ES6, you can use the built-in data structure Map and don’t have to escape keys. As a downside, incrementing values inside Maps is less convenient.

        const map = new Map();
        function countWords(word) {
            const count = map.get(word) || 0;
            map.set(word, count + 1);
        }

Another benefit of Maps is that you can use arbitrary values as keys, not just strings.

### 4.16 New string methods

The ECMAScript 6 standard library provides several new methods for strings.

**From indexOf to startsWith:**

        if (str.indexOf('x') === 0) {} // ES5
        if (str.startsWith('x')) {} // ES6

**From indexOf to endsWith:**

        function endsWith(str, suffix) { // ES5
          var index = str.indexOf(suffix);
          return index >= 0
            && index === str.length-suffix.length;
        }
        str.endsWith(suffix); // ES6

**From indexOf to includes:**

        if (str.indexOf('x') >= 0) {} // ES5
        if (str.includes('x')) {} // ES6

**From join to repeat**

(the ES5 way of repeating a string is more of a hack):

        new Array(3+1).join('#') // ES5
        '#'.repeat(3) // ES6


### 4.17 New Array methods

There are also several new Array methods in ES6.

### 4.17.1 From Array.prototype.indexOf to Array.prototype.findIndex

The latter can be used to find NaN, which the former can’t detect:

**indexOf到findIndex(value)**

        const arr = ['a', NaN];

        arr.indexOf(NaN); // -1
        arr.findIndex(x => Number.isNaN(x)); // 1

Number.isNaN可以准确判断NaN

window.isNaN和Number.isNaN的区别

As an aside, the new Number.isNaN() provides a safe way to detect NaN (because it doesn’t coerce non-numbers to numbers):

As an aside 顺便插一句

coerce vt. 迫使做;强迫, 强制 (以武力、惩罚、威胁等手段)控制;支配;压制

        > isNaN('abc')
        true
        > Number.isNaN('abc')
        false

### 4.17.2 From Array.prototype.slice() to Array.from() or the spread operator

**from方法通过扩展操作符 与slice**

In ES5, Array.prototype.slice() was used to convert Array-like objects to Arrays. In ES6, you have Array.from():

        var arr1 = Array.prototype.slice.call(arguments); // ES5
        const arr2 = Array.from(arguments); // ES6

If a value is iterable (as all Array-like DOM data structure are by now), you can also use the spread operator (...) to convert it to an Array:


        const arr1 = [...'abc'];
            // ['a', 'b', 'c']

        const arr2 = [...new Set().add('a').add('b')];
            // ['a', 'b']

### 4.17.3 From apply() to Array.prototype.fill()

In ES5, you can use apply(), as a hack, to create in Array of arbitrary length that is filled with undefined:

        // Same as Array(undefined, undefined)
        var arr1 = Array.apply(null, new Array(2));
            // [undefined, undefined]

In ES6, fill() is a simpler alternative:

        const arr2 = new Array(2).fill(undefined);
            // [undefined, undefined]

fill() is even more convenient if you want to create an Array that is filled with an arbitrary value:

        // ES5
        var arr3 = Array.apply(null, new Array(2))
            .map(function (x) { return 'x' });
            // ['x', 'x']

        // ES6
        const arr4 = new Array(2).fill('x');
            // ['x', 'x']

fill() replaces all Array elements with the given value. Holes are treated as if they were elements.

### 4.18 From CommonJS modules to ES6 modules
### CommonJS模块化到ES6模块化

Even in ES5, module systems based on either AMD syntax or CommonJS syntax have mostly replaced hand-written solutions such as the revealing module pattern.

reveal vt. 显示; 露出 泄露; 透露
reveling 显式

ES6 has built-in support for modules. Alas, no JavaScript engine supports them natively, yet. But tools such as browserify, webpack or jspm let you use ES6 syntax to create modules, making the code you write future-proof.

ES6自建模块化现在还没有浏览器支持但是可以browserify, webpack的工具转换

### 4.18.1 Multiple exports

### 4.18.1.1 Multiple exports in CommonJS

In CommonJS, you export multiple entities as follows:

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

        //------ main1.js ------
        var square = require('lib').square;
        var diag = require('lib').diag;

        console.log(square(11)); // 121
        console.log(diag(4, 3)); // 5

Alternatively, you can import the whole module as an object and access square and diag via it:

    //------ main2.js ------
    var lib = require('lib');
    console.log(lib.square(11)); // 121
    console.log(lib.diag(4, 3)); // 5

### 4.18.1.2 Multiple exports in ES6

In ES6, multiple exports are called named exports and handled like this:

          //------ lib.js ------
          export const sqrt = Math.sqrt;
          export function square(x) {
              return x * x;
          }
          export function diag(x, y) {
              return sqrt(square(x) + square(y));
          }

          //------ main1.js ------
          import { square, diag } from 'lib';
          console.log(square(11)); // 121
          console.log(diag(4, 3)); // 5
          The syntax for importing modules as objects looks as follows (line A):

          //------ main2.js ------
          import * as lib from 'lib'; // (A)
          console.log(lib.square(11)); // 121
          console.log(lib.diag(4, 3)); // 5


### 4.18.2 Single exports

### 4.18.2.1 Single exports in CommonJS

Node.js extends CommonJS and lets you export single values from modules, via module.exports:

          //------ myFunc.js ------
          module.exports = function () { ··· };

          //------ main1.js ------
          var myFunc = require('myFunc');
          myFunc();


### 4.18.2.2 Single exports in ES6

In ES6, the same thing is done via a so-called default export (declared via export default):

          //------ myFunc.js ------
          export default function () { ··· } // no semicolon!

          //------ main1.js ------
          import myFunc from 'myFunc';
          myFunc();

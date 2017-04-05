### 11. Parameter handling

---
* 11.1. Overview
  * 11.1.1. Default parameter values
  * 11.1.2. Rest parameters
  * 11.1.3. Named parameters via destructuring
  * 11.1.4. Spread operator (...)
* 11.2. Parameter handling as destructuring
* 11.3. Parameter default values
  * 11.3.1. Why does undefined trigger default values?
  * 11.3.2. Referring to other parameters in default values
  * 11.3.3. Referring to “inner” variables in default values
* 11.4. Rest parameters
  * 11.4.1. No more arguments!
* 11.5. Simulating named parameters
  * 11.5.1. Named Parameters as Descriptions
  * 11.5.2. Optional Named Parameters
  * 11.5.3. Simulating Named Parameters in JavaScript
* 11.6. Examples of destructuring in parameter handling
  * 11.6.1. forEach() and destructuring
  * 11.6.2. Transforming Maps
  * 11.6.3. Handling an Array returned via a Promise
* 11.7. Coding style tips
  * 11.7.1. Optional parameters
  * 11.7.2. Required parameters
  * 11.7.3. Enforcing a maximum arity
* 11.8. The spread operator (...)
  * 11.8.1. Spreading into function and method calls
  * 11.8.2. Spreading into constructors
  * 11.8.3. Spreading into Arrays

---

### 11.1 Overview

Parameter handling has been significantly upgraded in ECMAScript 6. It now supports parameter default values, rest parameters (varargs) and destructuring.

在参数处理ES6有很大改变 包括 默认值 剩余参数(可变参数) 解构


Additionally, the spread operator helps with function/method/constructor calls and Array literals.

此外，扩展操作也有理由函数 方法 构造器函数和数组

### 11.1.1 Default parameter values
### 参数默认值

A default parameter value is specified for a parameter via an equals sign (=). If a caller doesn’t provide a value for the parameter, the default value is used. In the following example, the default parameter value of y is 0:

        function func(x, y=0) {
            return [x, y];
        }
        func(1, 2); // [1, 2]
        func(1); // [1, 0]
        func(); // [undefined, 0]


### 11.1.2 Rest parameters
### 可变参数

If you prefix a parameter name with the rest operator (...), that parameter receives all remaining parameters via an Array:

可变数组通过数组来接受 可变数组如果没有相应值也是空数组


        function format(pattern, ...params) {
            return {pattern, params};
        }
        format(1, 2, 3);
            // { pattern: 1, params: [ 2, 3 ] }
        format();
            // { pattern: undefined, params: [] }


### 11.1.3 Named parameters via destructuring
### 命名参数与解构

You can simulate named parameters if you destructure with an object pattern in the parameter list:


            function selectEntries({ start=0, end=-1, step=1 } = {}) { // (A)
                // The object pattern is an abbreviation of:
                // { start: start=0, end: end=-1, step: step=1 }

                // Use the variables `start`, `end` and `step` here
                ···
            }

            selectEntries({ start: 10, end: 30, step: 2 });
            selectEntries({ step: 3 });
            selectEntries({});
            selectEntries();

The = {} in line A enables you to call selectEntries() without paramters.



### 11.1.4 Spread operator (...)
### 扩展操作

In function and constructor calls, the spread operator turns iterable values into arguments:

在函数或者构造器函数会调用 扩展操作符会将数组转换参数

        > Math.max(-1, 5, 11, 3)
        11
        > Math.max(...[-1, 5, 11, 3])
        11
        > Math.max(-1, ...[-1, 5, 11], 3)
        11


In Array literals, the spread operator turns iterable values into Array elements:

在数组中使用扩展操作符 得到结果依然是数组

        > [1, ...[2,3], 4]
        [1, 2, 3, 4]


### 11.2 Parameter handling as destructuring

The ES6 way of handling parameters is equivalent to destructuring the actual parameters via the formal parameters. That is, the following function call:

实参与形参:

        function func(«FORMAL_PARAMETERS») {
            «CODE»
        }
        func(«ACTUAL_PARAMETERS»);

is roughly equivalent to:

        {
            let [«FORMAL_PARAMETERS»] = [«ACTUAL_PARAMETERS»];
            {
                «CODE»
            }
        }

Example – the following function call:

        function logSum(x=0, y=0) {
            console.log(x + y);
        }

        logSum(7, 8);

becomes:

        {
            let [x=0, y=0] = [7, 8];
            {
                console.log(x + y);
            }
        }

Let’s look at specific features next.

### 11.3 Parameter default values

ECMAScript 6 lets you specify default values for parameters:

function f(x, y=0) {
  return [x, y];
}

Omitting the second parameter triggers the default value:

        > f(1)
        [1, 0]
        > f()
        [undefined, 0]


Watch out – undefined triggers the default value, too:

        > f(undefined, undefined)
        [undefined, 0]

The default value is computed on demand, only when it is actually needed:

        > const log = console.log.bind(console);
        > function g(x=log('x'), y=log('y')) {return 'DONE'}
        > g()
        x
        y
        'DONE'
        > g(1)
        y
        'DONE'
        > g(1, 2)
        'DONE'

### 11.3.1 Why does undefined trigger default values?

It isn’t immediately obvious why undefined should be interpreted as a missing parameter or a missing part of an object or Array. The rationale for doing so is that it enables you to delegate the definition of default values. Let’s look at two examples.

In the first example ([source: Rick Waldron’s TC39 meeting notes from 2012-07-24](https://github.com/rwaldron/tc39-notes/blob/master/es6/2012-07/july-24.md#413-destructuring-issues)), we don’t have to define a default value in setOptions(), we can delegate that task to setLevel().

        function setLevel(newLevel = 0) {
            light.intensity = newLevel;
        }
        function setOptions(options) {
            // Missing prop returns undefined => use default
            setLevel(options.dimmerLevel);
            setMotorSpeed(options.speed);
            ···
        }
        setOptions({speed:5});


In the second example, square() doesn’t have to define a default for x, it can delegate that task to multiply():

        function multiply(x=1, y=1) {
            return x * y;
        }
        function square(x) {
            return multiply(x, x);
        }

Default values further entrench the role of undefined as indicating that something doesn’t exist, versus null indicating emptiness.

### 11.3.2 Referring to other parameters in default values

Within a parameter default value, you can refer to any variable, including other parameters:

        function foo(x=3, y=x) {}
        foo();     // x=3; y=3
        foo(7);    // x=7; y=7
        foo(7, 2); // x=7; y=2

However, order matters. Parameters are declared from left to right. “Inside” a default value, you get a ReferenceError if you access a parameter that hasn’t been declared, yet:

        function bar(x=y, y=4) {}
        bar(3); // OK
        bar(); // ReferenceError: y is not defined

### 11.3.3 Referring to “inner” variables in default values

Default values exist in their own scope, which is between the “outer” scope surrounding the function and the “inner” scope of the function body. Therefore, you can’t access “inner” variables from the default values:

        const x = 'outer';
        function foo(a = x) {
            const x = 'inner';
            console.log(a); // outer
        }

If there were no outer x in the previous example, the default value x would produce a ReferenceError (if triggered).

This restriction is probably most surprising if default values are closures:

        const QUX = 2;

        function bar(callback = () => QUX) { // returns 2
            const QUX = 3;
            callback();
        }
        bar(); // ReferenceError

### 11.4 Rest parameters

Putting the rest operator (...) in front of the last formal parameter means that it will receive all remaining actual parameters in an Array.

        function f(x, ...y) {
            ···
        }
        f('a', 'b', 'c'); // x = 'a'; y = ['b', 'c']

If there are no remaining parameters, the rest parameter will be set to the empty Array:

        f(); // x = undefined; y = []


The spread operator (...) looks exactly like the rest operator, but is used inside function calls and Array literals (not inside destructuring patterns).

### 11.4.1 No more arguments!

Rest parameters can completely replace JavaScript’s infamous special variable arguments. They have the advantage of always being Arrays:

arguments  ...args

        // ECMAScript 5: arguments
        function logAllArguments() {
            for (var i=0; i < arguments.length; i++) {
                console.log(arguments[i]);
            }
        }

        // ECMAScript 6: rest parameter
        function logAllArguments(...args) {
            for (const arg of args) {
                console.log(arg);
            }
        }


### 11.4.1.1 Combining destructuring and access to the destructured value

One interesting feature of arguments is that you can have normal parameters and an Array of all parameters at the same time:

arguments是数组

        function foo(x=0, y=0) {
            console.log('Arity: '+arguments.length);
            ···
        }

You can avoid arguments in such cases if you combine a rest parameter with Array destructuring. The resulting code is longer, but more explicit:

避免使用arguments 使用数组解构...args 这样代码简洁

        function foo(...args) {
            let [x=0, y=0] = args;
            console.log('Arity: '+args.length);
            ···
        }

The same technique works for named parameters (options objects):

命名的参数

        function bar(options = {}) {
            let { namedParam1, namedParam2 } = options;
            ···
            if ('extra' in options) {
                ···
            }
        }

### 11.4.1.2 arguments is iterable

arguments is iterable5 in ECMAScript 6, which means that you can use for-of and the spread operator:

arguments在ES6是可迭代的 所以可以使用for-of 扩展操作符

        > (function () { return typeof arguments[Symbol.iterator] }())
        'function'

        > (function () { return Array.isArray([...arguments]) }())
        true

### 11.5 Simulating named parameters

When calling a function (or method) in a programming language, you must map the actual parameters (specified by the caller) to the formal parameters (of a function definition). There are two common ways to do so:

* Positional parameters are mapped by position. The first actual parameter is mapped to the first formal parameter, the second actual to the second formal, and so on:

位置参数

          selectEntries(3, 20, 2)

* Named parameters use names (labels) to perform the mapping. Formal parameters have labels. In a function call, these labels determine which value belongs to which formal parameter. It does not matter in which order named actual parameters appear, as long as they are labeled correctly. Simulating named parameters in JavaScript looks as follows.

命名参数

          selectEntries({ start: 3, end: 20, step: 2 })


Named parameters have two main benefits: they provide descriptions for arguments in function calls and they work well for optional parameters. I’ll first explain the benefits and then show you how to simulate named parameters in JavaScript via object literals.

### 11.5.1 Named Parameters as Descriptions

As soon as a function has more than one parameter, you might get confused about what each parameter is used for. For example, let’s say you have a function, selectEntries(), that returns entries from a database. Given the function call:

        selectEntries(3, 20, 2);

what do these three numbers mean? Python supports named parameters, and they make it easy to figure out what is going on:

        **Python syntax**

        selectEntries(start=3, end=20, step=2)

### 11.5.2 Optional Named Parameters

Optional positional parameters work well only if they are omitted at the end. Anywhere else, you have to insert placeholders such as null so that the remaining parameters have correct positions.

With optional named parameters, that is not an issue. You can easily omit any of them. Here are some examples:

          **Python syntax**

          selectEntries(step=2)

          selectEntries(end=20, start=3)

          selectEntries()

### 11.5.3 Simulating Named Parameters in JavaScript

JavaScript does not have native support for named parameters, unlike Python and many other languages. But there is a reasonably elegant simulation: Each actual parameter is a property in an object literal whose result is passed as a single formal parameter to the callee. When you use this technique, an invocation of selectEntries() looks as follows.

          selectEntries({ start: 3, end: 20, step: 2 });

The function receives an object with the properties start, end, and step. You can omit any of them:

          selectEntries({ step: 2 });
          selectEntries({ end: 20, start: 3 });
          selectEntries();
          In ECMAScript 5, you’d implement selectEntries() as follows:

          function selectEntries(options) {
              options = options || {};
              var start = options.start || 0;
              var end = options.end || -1;
              var step = options.step || 1;
              ···
          }

In ECMAScript 6, you can use destructuring, which looks like this:

          function selectEntries({ start=0, end=-1, step=1 }) {
              ···
          }

If you call selectEntries() with zero arguments, the destructuring fails, because you can’t match an object pattern against undefined. That can be fixed via a default value. In the following code, the object pattern is matched against {} if the first parameter is missing.

          function selectEntries({ start=0, end=-1, step=1 } = {}) {
              ···
          }

You can also combine positional parameters with named parameters. It is customary for the latter to come last:

          someFunc(posArg1, { namedArg1: 7, namedArg2: true });

In principle, JavaScript engines could optimize this pattern so that no intermediate object is created, because both the object literals at the call sites and the object patterns in the function definitions are static.

In JavaScript, the pattern for named parameters shown here is sometimes called options or option object (e.g., by the jQuery documentation).

11.6 Examples of destructuring in parameter handling

### 11.6.1 forEach() and destructuring

You will probably mostly use the for-of loop in ECMAScript 6, but the Array method forEach() also profits from destructuring. Or rather, its callback does.

First example: destructuring the Arrays in an Array.

        const items = [ ['foo', 3], ['bar', 9] ];
        items.forEach(([word, count]) => {
            console.log(word+' '+count);
        });

Second example: destructuring the objects in an Array.

        const items = [
            { word:'foo', count:3 },
            { word:'bar', count:9 },
        ];
        items.forEach(({word, count}) => {
            console.log(word+' '+count);
        });

### 11.6.2 Transforming Maps

An ECMAScript 6 Map doesn’t have a method map() (like Arrays). Therefore, one has to:

Step 1: Convert it to an Array of [key,value] pairs.

Step 2: map() the Array.

Step 3: Convert the result back to a Map.

This looks as follows.

        const map0 = new Map([
            [1, 'a'],
            [2, 'b'],
            [3, 'c'],
        ]);

        const map1 = new Map( // step 3
            [...map0] // step 1
            .map(([k, v]) => [k*2, '_'+v]) // step 2
        );

        // Resulting Map: {2 -> '_a', 4 -> '_b', 6 -> '_c'}

### 11.6.3 Handling an Array returned via a Promise

The tool method Promise.all() works as follows:

* Input: an iterable of Promises.

* Output: a Promise that is fulfilled with an Array as soon as the last input Promise is fulfilled. That Array contains the fulfillments of the input Promises.

Destructuring helps with handling the Array that the result of Promise.all() is fulfilled with:

        const urls = [
            'http://example.com/foo.html',
            'http://example.com/bar.html',
            'http://example.com/baz.html',
        ];

        Promise.all(urls.map(downloadUrl))
        .then(([fooStr, barStr, bazStr]) => {
            ···
        });

        // This function returns a Promise that is fulfilled
        // with a string (the text)
        function downloadUrl(url) {
            return fetch(url).then(request => request.text());
        }


fetch() is a Promise-based version of XMLHttpRequest.[It is part of the Fetch standard.](https://fetch.spec.whatwg.org/#fetch-api)

### 11.7 Coding style tips

This section mentions a few tricks for descriptive parameter definitions. They are clever, but they also have downsides: they add visual clutter and can make your code harder to understand.

### 11.7.1 Optional parameters

Some parameters have no default values, but can be omitted. In that case, I occasionally use the default value undefined to make it obvious that the parameter is optional. That is redundant, but descriptive.

可选参数可以通过赋值为undefined

          function foo(requiredParam, optionalParam = undefined) {
              ···
          }

### 11.7.2 Required parameters

In ECMAScript 5, you have a few options for ensuring that a required parameter has been provided, which are all quite clumsy:

          function foo(mustBeProvided) {
              if (arguments.length < 1) {
                  throw new Error();
              }
              if (! (0 in arguments)) {
                  throw new Error();
              }
              if (mustBeProvided === undefined) {
                  throw new Error();
              }
              ···
          }

In ECMAScript 6, you can (ab)use default parameter values to achieve more concise code (credit: idea by Allen Wirfs-Brock):

          /**
           * Called if a parameter is missing and
           * the default value is evaluated.
           */
          function mandatory() {
              throw new Error('Missing parameter');
          }
          function foo(mustBeProvided = mandatory()) {
              return mustBeProvided;
          }
          Interaction:

          > foo()
          Error: Missing parameter
          > foo(123)
          123

### 11.7.3 Enforcing a maximum arity
### 强迫最大参数

This section presents three approaches to enforcing a maximum arity. The running example is a function f whose maximum arity is 2 – if a caller provides more than 2 parameters, an error should be thrown.

设置参数个数最多 超过这个最多值得参数被扔掉

The first approach is to collect all actual parameters in the formal rest parameter args and to check its length.



          function f(...args) {
              if (args.length > 2) {
                  throw new Error();
              }
              // Extract the real parameters
              let [x, y] = args;
          }

The second approach relies on unwanted actual parameters appearing in the formal rest parameter empty.

          function f(x, y, ...empty) {
              if (empty.length > 0) {
                  throw new Error();
              }
          }

The third approach uses a sentinel value that is gone if there is a third parameter. One caveat is that the default value OK is also triggered if there is a third parameter whose value is undefined.

          const OK = Symbol();
          function f(x, y, arity=OK) {
              if (arity !== OK) {
                  throw new Error();
              }
          }

Sadly, each one of these approaches introduces significant visual and conceptual clutter. I’m tempted to recommend checking arguments.length, but I also want arguments to go away.

          function f(x, y) {
              if (arguments.length > 2) {
                  throw new Error();
              }
          }


### 11.8 The spread operator (...)

The spread operator (...) looks exactly like the rest operator, but is its opposite:

Rest operator: collects the remaining items of an iterable into an Array and is used for rest parameters and destructuring.

可变操作符 将有的项目迭代到数组  可变操作符通常用到可变参数和解构

Spread operator: turns the items of an iterable into arguments of a function call or into elements of an Array.

扩展操作符 将参数扩展到一个数组

### 11.8.1 Spreading into function and method calls

Math.max() is a good example for demonstrating how the spread operator works in method calls. Math.max(x1, x2, ···) returns the argument whose value is greatest. It accepts an arbitrary number of arguments, but can’t be applied to Arrays. The spread operator fixes that:

        > Math.max(-1, 5, 11, 3)
        11
        > Math.max(...[-1, 5, 11, 3])
        11

In contrast to the rest operator, you can use the spread operator anywhere in a sequence of parts:

        > Math.max(-1, ...[-1, 5, 11], 3)
        11

Another example is JavaScript not having a way to destructively append the elements of one Array to another one. However, Arrays do have the method push(x1, x2, ···), which appends all of its arguments to its receiver. The following code shows how you can use push() to append the elements of arr2 to arr1.

        const arr1 = ['a', 'b'];
        const arr2 = ['c', 'd'];

        arr1.push(...arr2);
        // arr1 is now ['a', 'b', 'c', 'd']

### 11.8.2 Spreading into constructors

In addition to function and method calls, the spread operator also works for constructor calls:

        new Date(...[1912, 11, 24]) // Christmas Eve 1912

That is something that is difficult to achieve in ECMAScript 5.


### 11.8.3 Spreading into Arrays

The spread operator can also be used inside Array literals:

        > [1, ...[2,3], 4]
        [1, 2, 3, 4]

That gives you a convenient way to concatenate Arrays:

        const x = ['a', 'b'];
        const y = ['c'];
        const z = ['d', 'e'];

        const arr = [...x, ...y, ...z]; // ['a', 'b', 'c', 'd', 'e']

One advantage of the spread operator is that its operand can be any iterable value (in contrast to the Array method concat(), which does not support iteration).

### 11.8.3.1 Converting iterable or Array-like objects to Arrays
### 类数组对象也可以迭代

The spread operator lets you convert any iterable value to an Array:

可以将类数组对象 Set 可以将扩展操作符 转为数组

        const arr = [...someIterableObject];

        Let’s convert a Set to an Array:

        const set = new Set([11, -1, 6]);
        const arr = [...set]; // [11, -1, 6]

Your own iterable objects can be converted to Arrays in the same manner:

**任何对象只有Symbol.iterator**

          const obj = {
              * [Symbol.iterator]() {
                  yield 'a';
                  yield 'b';
                  yield 'c';
              }
          };
          const arr = [...obj]; // ['a', 'b', 'c']


Note that, just like the for-of loop, the spread operator only works for iterable values. All built-in data structures are iterable: Arrays, Maps and Sets. All Array-like DOM data structures are also iterable.

for-of循环 扩展操作符是用于可迭代的值 所有内建数据是可迭代：数组 Maps Sets 类数组DOM

Should you ever encounter something that is not iterable, but Array-like (indexed elements plus a property length), you can use Array.from()6 to convert it to an Array:

当遇到不可迭代的对象时候,

对于类数组对象是也按索引存储数据同时附加一个length的属性 可以用Array.from()将类数组对象转为数组

          const arrayLike = {
              '0': 'a',
              '1': 'b',
              '2': 'c',
              length: 3
          };

          // ECMAScript 5:
          var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']

          // ECMAScript 6:
          const arr2 = Array.from(arrayLike); // ['a', 'b', 'c']

          // TypeError: Cannot spread non-iterable value
          const arr3 = [...arrayLike];

扩展操作符的对象必须有Symbol.iterator属性

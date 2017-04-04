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

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

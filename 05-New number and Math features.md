### 5. New number and Math features
---
* 5.1. Overview
  * 5.1.1. New integer literals
  * 5.1.2. New Number properties
  * 5.1.3. New Math methods
* 5.2. New integer literals
  * 5.2.1. Use case for octal literals: Unix-style file permissions
  * 5.2.2. Number.parseInt() and the new integer literals
* 5.3. New static Number properties
  * 5.3.1. Previously global functions
  * 5.3.2. Number.EPSILON
  * 5.3.3. Number.isInteger(number)
  * 5.3.4. Safe integers
* 5.4. New Math functionality
  * 5.4.1. Various numerical functionality
  * 5.4.2. Using 0 instead of 1 with exponentiation and logarithm
  * 5.4.3. Logarithms to base 2 and 10
  * 5.4.4. Support for compiling to JavaScript
  * 5.4.5. Bitwise operations
  * 5.4.6. Trigonometric methods
* 5.5. FAQ: numbers
 * 5.5.1. How can I use integers beyond JavaScript’s 53 bit range?

---

### 5.1 Overview

### 5.1.1 New integer literals

You can now specify integers in binary and octal notation:

可以指定二进制和八进制数字 0b 二进制 0o 八进制 0X 十六进制

        > 0xFF // ES5: hexadecimal
        255
        > 0b11 // ES6: binary
        3
        > 0o10 // ES6: octal
        8


### 5.1.2 New Number properties

The global object Number gained a few new properties:

Number增加新属性

Number.EPSILON for comparing floating point numbers with a tolerance for rounding errors.

Number.EPSILON---对于浮点数小数差的容错量

Number.isInteger(num) checks whether num is an integer (a number without a decimal fraction):

Number.isInteger(num)---判断一个数是否为整数

          > Number.isInteger(1.05)
          false
          > Number.isInteger(1)
          true

          > Number.isInteger(-3.1)
          false
          > Number.isInteger(-3)
          true

A method and constants for determining whether a JavaScript integer is safe (within the signed 53 bit range in which there is no loss of precision):

        Number.isSafeInteger(number)---是否在合理整数范围 2**53次方

        Number.MIN_SAFE_INTEGER

        Number.MAX_SAFE_INTEGER

Number.isNaN(num) checks whether num is the value NaN. In contrast to the global function isNaN(), it doesn’t coerce its argument to a number and is therefore safer for non-numbers:

Number.isNaN(num)---检查一个参数是否是NaN 不会强制参数转换为number型 然后来判断结果是否NaN  

相反是 window.isNaN()---首先会将参数强制转换为number型

          var isNaN = function(value) {
              return Number.isNaN(Number(value));
          }

          // 这样理解window.isNaN()的工作过程

          > isNaN('???')
          true

          > Number.isNaN('???')
          false

Three additional methods of Number are mostly equivalent to the global functions with the same names: Number.isFinite, Number.parseFloat, Number.parseInt.

现在Number这个对象新添加  
Number.isFinite  
Number.parseFloat  
Number.parseInt  
等三个全局方法

### 5.1.3 New Math methods

The global object Math has new methods for numerical, trigonometric and bitwise operations. Let’s look at four examples.

Math.sign() returns the sign of a number:

Math.sign() 判断正负数 1 正 0--0 -1 负

        > Math.sign(-8)
        -1
        > Math.sign(0)
        0
        > Math.sign(3)
        1

Math.trunc() removes the decimal fraction of a number:

Math.trunc() turncate 去掉小数位 并且不四舍五入

        > Math.trunc(3.1)
        3
        > Math.trunc(3.9)
        3
        > Math.trunc(-3.1)
        -3
        > Math.trunc(-3.9)
        -3


Math.log10() computes the logarithm to base 10:

log10结果

        > Math.log10(100)
        2


Math.hypot() Computes the square root of the sum of the squares of its arguments (Pythagoras’ theorem):

Math.hypot() 勾股定理

          > Math.hypot(3, 4)
          5    

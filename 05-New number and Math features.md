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

Math.hypot() 勾股定理  Pythagoras’ theorem 毕达哥拉斯定义 古希腊数学家

        > Math.hypot(3, 4)
        5  


### 5.2 New integer literals

ECMAScript 5 already has literals for hexadecimal integers:

        > 0x9
        9
        > 0xA
        10
        > 0x10
        16
        > 0xFF
        255
        ECMAScript 6 brings two new kinds of integer literals:

Binary literals have the prefix 0b or 0B:

          > 0b11
          3
          > 0b100
          4

Octal literals have the prefix 0o or 0O (that’s a zero followed by the capital letter O; the first variant is safer):

          > 0o7
          7
          > 0o10
          8

Remember that the Number method toString(radix) can be used to see numbers in a base other than 10:

        > 255..toString(16)
        'ff'
        > 4..toString(2)
        '100'
        > 8..toString(8)
        '10'

(The double dots are necessary so that the dot for property access isn’t confused with a decimal dot.)  

number型通过toString可以转换二进制 八进制 十六进制的数字 但是调用toString方法前面加两个点

### 5.2.1 Use case for octal literals: Unix-style file permissions
### 八进制符合Unix-style文件权限

In the Node.js file system module, several functions have the parameter mode. Its value is used to specify file permissions, via an encoding that is a holdover from Unix:

在nodejs文件权限中，文件函数有权限参数，用来指定文件权限

* Permissions are specified for three categories of users:

  * User: the owner of the file  
  * Group: the members of the group associated with the file  
  * All: everyone  

权限用来指定三个不同用户权限 用户 组 all

* Per category, the following permissions can be granted:
  * r (read): the users in the category are allowed to read the file 读
  * w (write): the users in the category are allowed to change the file 写
  * x (execute): the users in the category are allowed to run the file 执行

That means that permissions can be represented by 9 bits (3 categories with 3 permissions each):

用9位二进制表示

|     | 	User		    | Group     | Header Two     |
| :------------- | :------------- | :------------- | :------------- |
| Permissions       | r, w, x       | r, w, x      | r, w, x       |
| Bit       | 8, 7, 6       | 5, 4, 3       | 	2, 1, 0       |


The permissions of a single category of users are stored in 3 bits:

| Bits	 | Permissions | Octal digit     |
| :------------- | :------------- | :------------- |
| 000       | –––       | 1       |
| 100     | ––x       | 2       |
| 010       | –w–       | 3       |
| 011       | –wx       | 4       |
| 100       | r––	       | 5       |
| 101       | r–x       | 6       |
| 110      | rw–       | 7       |
| 111       | rwx       | 8       |


That means that octal numbers are a compact representation of all permissions, you only need 3 digits, one digit per category of users. Two examples:

755 = 111,101,101: I can change, read and execute; everyone else can only read and execute.
640 = 110,100,000: I can read and write; group members can read; everyone can’t access at all.

### 5.2.2 Number.parseInt() and the new integer literals

Number.parseInt() (which does the same as the global function parseInt()) has the following signature:

Number.parseInt()与window.parseInt()和一样

        Number.parseInt(string, radix?)

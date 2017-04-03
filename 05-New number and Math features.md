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

Number.parseInt()与window.parseInt()用法一样

        Number.parseInt(string, radix?)


### 5.2.2.1 Number.parseInt(): hexadecimal number literals

Number.parseInt() provides special support for the hexadecimal literal notation – the prefix 0x (or 0X) of string is removed if:

Number.parseInt() 提供对前缀为0x/0X的字符串的实现。


  * radix is missing or 0. Then radix is set to 16. As a rule, you should never omit the radix.
  * 基数被省略或0 基数被设为16 基数永远不要省略
  * radix is 16.

For example:

        > Number.parseInt('0xFF')
        255
        > Number.parseInt('0xFF', 0)
        255
        > Number.parseInt('0xFF', 16)
        255

In all other cases, digits are only parsed until the first non-digit:

在其他情况下 数字仅被解析到第一个非数字位置

        > Number.parseInt('0xFF', 10)
        0
        > Number.parseInt('0xFF', 17)
        0


### 5.2.2.2 Number.parseInt(): binary and octal number literals

However, Number.parseInt() does not have special support for binary or octal literals!

Number.parseInt() 不支持二进制和八进制！

        > Number.parseInt('0b111')
        0
        > Number.parseInt('0b111', 2)
        0
        > Number.parseInt('111', 2)
        7

        > Number.parseInt('0o10')
        0
        > Number.parseInt('0o10', 8)
        0
        > Number.parseInt('10', 8)
        8

If you want to parse these kinds of literals, you need to use Number():

如果想解析所有进制就要Number()

        > Number('0b111')
        7
        > Number('0o10')
        8

Number.parseInt() works fine with numbers that have a different base, as long as there is no special prefix and the parameter radix is provided:

只要没有前缀的情况 Number.parseInt() 可以解析不同进制 基数这个参数一定要被指定

        > Number.parseInt('111', 2)
        7
        > Number.parseInt('10', 8)
        8

### 5.3 New static Number properties
### Number 静态属性

This section describes new properties that the constructor Number has picked up in ECMAScript 6.

这一节介绍Number新属性 并且Number的构造器在ES6已经实现。


### 5.3.1 Previously global functions

Four number-related functions are already available as global functions and have been added to Number, as methods: isFinite and isNaN, parseFloat and parseInt. All of them work almost the same as their global counterparts, but isFinite and isNaN don’t coerce their arguments to numbers, anymore, which is especially important for isNaN. The following subsections explain all the details.

已经在全局对象的四个函数已经在Number对象已经实现 isFinite  isNaN, parseFloat  parseInt。
这四个函数和之前在全局上工作差不多 但是 isFinite 和 isNaN不会将参数强制转为数字型
这一点对于isNaN很重要


### 5.3.1.1 Number.isFinite(number)

Number.isFinite(number) determines whether number is an actual number (neither Infinity nor -Infinity nor NaN):

判断一个参数是否是真实的数字 当然不包含Infinity  -Infinity NaN这三项

        > Number.isFinite(Infinity)
        false
        > Number.isFinite(-Infinity)
        false
        > Number.isFinite(NaN)
        false
        > Number.isFinite(123)
        true

The advantage of this method is that it does not coerce its parameter to number (whereas the global function does):

这个方法最好优点是不强迫将参数转为数字型

      > Number.isFinite('123')
      false
      > isFinite('123')
      true

### 5.3.1.2 Number.isNaN(number)

Number.isNaN(number) checks whether number is the value NaN.

One ES5 way of making this check is via !==:

在ES5下通过!==的比较

      > const x = NaN;
      > x !== x
      true

A more descriptive way is via the global function isNaN():
还有一点着重介绍的是isNaN在ES5是一个全局方法

      > const x = NaN;
      > isNaN(x)
      true

However, this function coerces non-numbers to numbers and returns true if the result is NaN (which is usually not what you want):

但是这个函数强制将参数转为数字型 在这个转换过程如果返回时NaN最后结果true 但是这不是我们想要的

      > isNaN('???')
      true

The new method Number.isNaN() does not exhibit this problem, because it does not coerce its arguments to numbers:

      > Number.isNaN('???')
      false

### 5.3.1.3 Number.parseFloat and Number.parseInt

The following two methods work exactly like the global functions with the same names. They were added to Number for completeness sake; now all number-related functions are available there.

for...sake 为了...缘故 目的

为了Number的完整性添加下面两个方法 现在与数字相关的函数几乎完整了

      Number.parseFloat(string)
      Number.parseInt(string, radix)

### 5.3.2 Number.EPSILON

Especially with decimal fractions, rounding errors can become a problem in JavaScript3. For example, 0.1 and 0.2 can’t be represented precisely, which you notice if you add them and compare them to 0.3 (which can’t be represented precisely, either).

由于ES3的小数部分进行运算之后产生的偏差  Number.EPSILON就是为了解决这个

      > 0.1 + 0.2 === 0.3
      false


Number.EPSILON specifies a reasonable margin of error when comparing floating point numbers. It provides a better way to compare floating point values, as demonstrated by the following function.

      function epsEqu(x, y) {
          return Math.abs(x - y) < Number.EPSILON;
      }
      console.log(epsEqu(0.1+0.2, 0.3)); // true

### 5.3.3 Number.isInteger(number)

JavaScript has only floating point numbers (doubles). Accordingly, integers are simply floating point numbers without a decimal fraction.

JavaScript仅提供了浮点数 因此 整数就是浮点数没有小数部分

Number.isInteger(number) returns true if number is a number and does not have a decimal fraction.

Number.isInteger验证参数是否有小数部分 如果没有 返回真


      > Number.isInteger(-17)
      true
      > Number.isInteger(33)
      true
      > Number.isInteger(33.1)
      false
      > Number.isInteger('33')
      false
      > Number.isInteger(NaN)
      false
      > Number.isInteger(Infinity)
      false

### 5.3.4 Safe integers

JavaScript numbers have only enough storage space to represent 53 bit signed integers. That is, integers i in the range −2**253 < i < 2**253 are safe. What exactly that means is explained momentarily. The following properties help determine whether a JavaScript integer is safe:

JavaScript仅提供53位有符号的二进制位来存储数字 整数在−2**253 < i < 2**253是安全


      Number.isSafeInteger(number)
      Number.MIN_SAFE_INTEGER
      Number.MAX_SAFE_INTEGER

The notion of safe integers centers on how mathematical integers are represented in JavaScript. In the range (−2**253, 2**253) (excluding the lower and upper bounds), JavaScript integers are safe: there is a one-to-one mapping between them and the mathematical integers they represent.


Beyond this range, JavaScript integers are unsafe: two or more mathematical integers are represented as the same JavaScript integer. For example, starting at 253, JavaScript can represent only every second mathematical integer:

        > Math.pow(2, 53)
        9007199254740992

        > 9007199254740992
        9007199254740992
        > 9007199254740993
        9007199254740992
        > 9007199254740994
        9007199254740994
        > 9007199254740995
        9007199254740996
        > 9007199254740996
        9007199254740996
        > 9007199254740997
        9007199254740996

Therefore, a safe JavaScript integer is one that unambiguously represents a single mathematical integer.

### 5.3.4.1 Static Number properties related to safe integers

The two static Number properties specifying the lower and upper bound of safe integers could be defined as follows:

          Number.MAX_SAFE_INTEGER = Math.pow(2, 53)-1;
          Number.MIN_SAFE_INTEGER = -Number.MAX_SAFE_INTEGER;

Number.isSafeInteger() determines whether a JavaScript number is a safe integer and could be defined as follows:

        Number.isSafeInteger = function (n) {
            return (typeof n === 'number' &&
                Math.round(n) === n &&
                Number.MIN_SAFE_INTEGER <= n &&
                n <= Number.MAX_SAFE_INTEGER);
        }


For a given value n, this function first checks whether n is a number and an integer. If both checks succeed, n is safe if it is greater than or equal to MIN_SAFE_INTEGER and less than or equal to MAX_SAFE_INTEGER.

### 5.3.4.2 When are computations with integers correct?

How can we make sure that results of computations with integers are correct? For example, the following result is clearly not correct:

        > 9007199254740990 + 3
        9007199254740992

We have two safe operands, but an unsafe result:

          > Number.isSafeInteger(9007199254740990)
          true
          > Number.isSafeInteger(3)
          true
          > Number.isSafeInteger(9007199254740992)
          false

The following result is also incorrect:

          > 9007199254740995 - 10
          9007199254740986

This time, the result is safe, but one of the operands isn’t:

        > Number.isSafeInteger(9007199254740995)
        false
        > Number.isSafeInteger(10)
        true
        > Number.isSafeInteger(9007199254740986)
        true

Therefore, the result of applying an integer operator op is guaranteed to be correct only if all operands and the result are safe. More formally:

isSafeInteger(a) && isSafeInteger(b) && isSafeInteger(a op b)
implies that a op b is a correct result.


5.4 New Math functionality

The global object Math has several new methods in ECMAScript 6.

### 5.4.1 Various numerical functionality

### 5.4.1.1 Math.sign(x)

Math.sign(x) returns:

-1 if x is a negative number (including -Infinity).
0 if x is zero4.
+1 if x is a positive number (including Infinity).
NaN if x is NaN or not a number.
Examples:

      > Math.sign(-8)
      -1
      > Math.sign(3)
      1

      > Math.sign(0)
      0
      > Math.sign(NaN)
      NaN

      > Math.sign(-Infinity)
      -1
      > Math.sign(Infinity)
      1

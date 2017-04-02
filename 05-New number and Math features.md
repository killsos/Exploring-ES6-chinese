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

可以二进制和八进制数字 0b 二进制 0o 八进制 0X 十六进制

        > 0xFF // ES5: hexadecimal
        255
        > 0b11 // ES6: binary
        3
        > 0o10 // ES6: octal
        8

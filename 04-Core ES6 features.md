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

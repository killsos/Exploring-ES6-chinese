### 9. Variables and scoping

---

* 9.1. Overview
  * 9.1.1. let
  * 9.1.2. const
  * 9.1.3. Ways of declaring variables
* 9.2. Block scoping via let and const
* 9.3. const creates immutable variables
  * 9.3.1. Pitfall: const does not make the value immutable
  * 9.3.2. const in loop bodies
* 9.4. The temporal dead zone
  * 9.4.1. The life cycle of var-declared variables
  * 9.4.2. The life cycle of let-declared variables
  * 9.4.3. Examples
  * 9.4.4. typeof throws a ReferenceError for a variable in the TDZ
  * 9.4.5. Why is there a temporal dead zone?
  * 9.4.6. Further reading
* 9.5. let and const in loop heads
  * 9.5.1. for loop
  * 9.5.2. for-of loop and for-in loop
  * 9.5.3. Why are per-iteration bindings useful?
* 9.6. Parameters as variables
  * 9.6.1. Parameters versus local variables
  * 9.6.2. Parameter default values and the temporal dead zone
  * 9.6.3. Parameter default values don’t see the scope of the body
* 9.7. The global object
* 9.8. Function declarations and class declarations
* 9.9. Coding style: const versus let versus var
  * 9.9.1. An alternative approach

---

### 9.1 Overview

ES6 provides two new ways of declaring variables: let and const, which mostly replace the ES5 way of declaring variables, var.

ES6 用let const来替换var

### 9.1.1 let

let works similarly to var, but the variable it declares is block-scoped, it only exists within the current block. var is function-scoped.

let与var类似 区别在于let是块级作用域 与let最近块 var是函数作用域

In the following code, you can see that the let-declared variable tmp only exists inside the block that starts in line A:

          function order(x, y) {
              if (x > y) { // (A)
                  let tmp = x;
                  x = y;
                  y = tmp;
              }
              console.log(tmp===x); // ReferenceError: tmp is not defined
              return [x, y];
          }


### 9.1.2 const

const works like let, but the variable you declare must be immediately initialized, with a value that can’t be changed afterwards.

const与let类似 但是const声明的必须立即初始化 并且值不能修改


          const foo;
              // SyntaxError: missing = in const declaration

          const bar = 123;
          bar = 456;
          // TypeError: `bar` is read-only

Since for-of creates one binding (storage space for a variable) per loop iteration, it is OK to const-declare the loop variable:

由于for-of每一次循环迭代都会创建一个存储空间与变量进行绑定所以可以const声明


          for (const x of ['a', 'b']) {
              console.log(x);
          }
          // Output:
          // a
          // b

### 9.1.3 Ways of declaring variables

The following table gives an overview of six ways in which variables can be declared in ES6 ([inspired by a table by kangax](https://twitter.com/kangax/status/567330097603284992)):

| Header One     | Hoisting 预解析     |Scope 作用域    |Creates global properties 是否是全局属性     |
| :------------- | :------------- |:------------- |:-------------: |
| var      | Declaration          | Function      | Yes       |
| let      | Temporal dead zone   | Block         | No       |
| const    | Temporal dead zone   | Block         | No       |
| function | Complete             | Block         | Yes       |
| class    | No                   | Block         | No       |
| import   | Complete             | Module-global | No       |

<img src="./var-let-const.png" />


总结：

var function 会预解析 let const class import 不会预解析

function let const class import 块级作用域 var 不是

var function 会产生全局属性 所以少用 只有在最外层才是

### 9.2 Block scoping via let and const

Both let and const create variables that are block-scoped – they only exist within the innermost block that surrounds them. The following code demonstrates that the const-declared variable tmp only exists inside the block of the if statement:

let const 仅作用于最近的{}

        function func() {
            if (true) {
                const tmp = 123;
            }
            console.log(tmp); // ReferenceError: tmp is not defined
        }

In contrast, var-declared variables are function-scoped:

        function func() {
            if (true) {
                var tmp = 123;
            }
            console.log(tmp); // 123
        }

Block scoping means that you can shadow variables within a function:

        function func() {
          const foo = 5;
          if (···) {
             const foo = 10; // shadows outer `foo`
             console.log(foo); // 10
          }
          console.log(foo); // 5
        }

### 9.3 const creates immutable variables

Variables created by let are mutable:

        let foo = 'abc';
        foo = 'def';
        console.log(foo); // def

Constants, variables created by const, are immutable – you can’t assign different values to them:

        const foo = 'abc';
        foo = 'def'; // TypeError

**Spec detail: changing a const variable always throws a TypeError**

Normally, changing an immutable binding only causes an exception in strict mode, as per [SetMutableBinding()](http://www.ecma-international.org/ecma-262/6.0/#sec-declarative-environment-records-setmutablebinding-n-v-s). But const-declared variables always produce strict bindings – see [FunctionDeclarationInstantiation(func, argumentsList)](http://www.ecma-international.org/ecma-262/6.0/#sec-functiondeclarationinstantiation), step 35.b.i.1.


### 9.3.1 Pitfall: const does not make the value immutable
### 易犯错误 const的值不可改变

const only means that a variable always has the same value, but it does not mean that the value itself is or becomes immutable.

const只是变量有相同值 但并不意味着值自己不可变

const不可变就是变量的内存地址不可变 但是内存地址中内容是可变的

For example, obj is a constant, but the value it points to is mutable – we can add a property to it:

        const obj = {};
        obj.prop = 123;
        console.log(obj.prop); // 123

We cannot, however, assign a different value to obj:

        obj = {}; // TypeError

If you want the value of obj to be immutable, you have to take care of it, yourself. For example, by freezing it:

如果不想给const声明的变量添加属性进行改变可以Object.freeze 进行冻结

        const obj = Object.freeze({});
        obj.prop = 123; // TypeError

### 9.3.1.1 Pitfall: Object.freeze() is shallow
### 易犯错误 Object.freeze() is shallow

Keep in mind that Object.freeze() is shallow, it only freezes the properties of its argument, not the objects stored in its properties.

For example, the object obj is frozen:

        > const obj = Object.freeze({ foo: {} });
        > obj.bar = 123
        TypeError: Can't add property bar, object is not extensible

        > obj.foo = {}
        TypeError: Cannot assign to read only property 'foo' of #<Object>


But the object obj.foo is not.

        > obj.foo.qux = 'abc';
        > obj.foo.qux
        'abc'


### 9.3.2 const in loop bodies

Once a const variable has been created, it can’t be changed. But that doesn’t mean that you can’t re-enter its scope and start fresh, with a new value. For example, via a loop:

        function logArgs(...args) {
            for (const [index, elem] of args.entries()) { // (A)
                const message = index + '. ' + elem; // (B)
                console.log(message);
            }
        }
        logArgs('Hello', 'everyone');

        // Output:
        // 0. Hello
        // 1. everyone

There are two const declarations in this code, in line A and in line B. And during each loop iteration, their constants have different values.

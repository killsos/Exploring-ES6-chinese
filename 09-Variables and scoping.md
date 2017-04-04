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

Once a const variable has been created, it can’t be changed. But that doesn’t mean that you can’t re-enter its scope and start fresh, with a new value.

一旦const变量已经被创建 是不能被改变 但是并不意味着 你不可以再进入它的作用域和用一个新值重新刷新

For example, via a loop:

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

### 9.4 The temporal dead zone

A variable declared by let or const has a so-called temporal dead zone (TDZ): When entering its scope, it can’t be accessed (got or set) until execution reaches the declaration. Let’s compare the life cycles of var-declared variables (which don’t have TDZs) and let-declared variables (which have TDZs).

用let const声明的变量有一个被叫temporal dead zone (TDZ) 当进入变量的作用域 一直到这个变量的声明被执行 才能对变量进行set get的操作

var 没有 temporal dead zone (TDZ) let 有temporal dead zone (TDZ)

### 9.4.1 The life cycle of var-declared variables
### var声明变量生命周期

var variables don’t have temporal dead zones. Their life cycle comprises the following steps:

var声明变量没有TDZ 它们周期有下面步骤:

* When the scope (its surrounding function) of a var variable is entered, storage space (a binding) is created for it. The variable is immediately initialized, by setting it to undefined.

* 当进入函数作用域 一个存储空间被创建 这个变量立即被初始化用undefined

* When the execution within the scope reaches the declaration, the variable is set to the value specified by the initializer (an assignment) – if there is one. If there isn’t, the value of the variable remains undefined.

* 当声明语句被执行的首 变量被赋予新值 如果没有新值依然是undefined


### 9.4.2 The life cycle of let-declared variables
### let声明变量声明周期

Variables declared via let have temporal dead zones and their life cycle looks like this:

let声明的变量有TDZ 变量生命周期如下:

* When the scope (its surrounding block) of a let variable is entered, storage space (a binding) is created for it. The variable remains uninitialized.

* 当变量作用域 一个存储空间被创建 但是不会初始化

* Getting or setting an uninitialized variable causes a ReferenceError.

* 这个时候任何设置或获取的动作都会引起TypeError

* When the execution within the scope reaches the declaration, the variable is set to the value specified by the initializer (an assignment) – if there is one. If there isn’t then the value of the variable is set to undefined.

* 声明的语句被执行 这时候就完成初始化无论有没有具体值  如果没有值也是undefinded

const variables work similarly to let variables, but they must have an initializer (i.e., be set to a value immediately) and can’t be changed.

const声明和let类似 区别在于const必须用值进行初始化 并且不能改变

### 9.4.3 Examples

Within a TDZ, an exception is thrown if a variable is got or set:

在TDZ区域 会引起ReferenceError

        let tmp = true;
        if (true) { // enter new scope, TDZ starts
            // Uninitialized binding for `tmp` is created
            console.log(tmp); // ReferenceError

            let tmp; // TDZ ends, `tmp` is initialized with `undefined`
            console.log(tmp); // undefined

            tmp = 123;
            console.log(tmp); // 123
        }
        console.log(tmp); // true

If there is an initializer then the TDZ ends after the initializer was evaluated and the result was assigned to the variable:

        let foo = console.log(foo); // ReferenceError

The following code demonstrates that the dead zone is really temporal (based on time) and not spatial (based on location):

        if (true) { // enter new scope, TDZ starts
            const func = function () {
                console.log(myVar); // OK!
            };

            // Here we are within the TDZ and
            // accessing `myVar` would cause a `ReferenceError`

            let myVar = 3; // TDZ ends
            func(); // called outside TDZ
        }

### 9.4.4 typeof throws a ReferenceError for a variable in the TDZ

If you access a variable in the temporal dead zone via typeof, you get an exception:

        if (true) {
            console.log(typeof foo); // ReferenceError (TDZ)
            console.log(typeof aVariableThatDoesntExist); // 'undefined'
            let foo;
        }

Why? The rationale is as follows: foo is not undeclared, it is uninitialized. You should be aware of its existence, but aren’t. Therefore, being warned seems desirable.

Furthermore, this kind of check is only useful for conditionally creating global variables. That is something that you don’t need to do in normal programs.


### 9.4.4.1 Conditionally creating variables

When it comes to conditionally creating variables, you have two options.

* Option 1 – typeof and var:

        if (typeof someGlobal === 'undefined') {
            var someGlobal = { ··· };
        }

This option only works in global scope (and therefore not inside ES6 modules).

* Option 2 – window:

      if (!('someGlobal' in window)) {
          window.someGlobal = { ··· };
      }

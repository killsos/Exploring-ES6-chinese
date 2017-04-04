### 10. Destructuring

---
* 10.1. Overview
  * 10.1.1. Object destructuring
  * 10.1.2. Array destructuring
  * 10.1.3. Where can destructuring be used?
* 10.2. Background: Constructing data versus extracting data
* 10.3. Patterns for destructuring
  * 10.3.1. Pick what you need
* 10.4. How do patterns access the innards of values?
  * 10.4.1. Object patterns coerce values to objects
  * 10.4.2. Array patterns work with iterables
* 10.5. Default values
  * 10.5.1. undefined triggers default values
  * 10.5.2. Default values are computed on demand
  * 10.5.3. Default values can refer to other variables in the pattern
  * 10.5.4. Default values for patterns
  * 10.5.5. More complex default values
* 10.6. More object destructuring features
  * 10.6.1. Property value shorthands
  * 10.6.2. Computed property keys
* 10.7. More Array destructuring features
  * 10.7.1. Elision
  * 10.7.2. Rest operator (...)
* 10.8. You can assign to more than just variables
* 10.9. Pitfalls of destructuring
  * 10.9.1. Don’t start a statement with a curly brace
* 10.10. Examples of destructuring
  * 10.10.1. Destructuring returned Arrays
  * 10.10.2. Destructuring returned objects
  * 10.10.3. Array-destructuring iterable values
* 10.10.4. Multiple return values
* 10.11. The destructuring algorithm
  * 10.11.1. The algorithm
  * 10.11.2. Applying the algorithm

---

### 10.1 Overview

Destructuring is a convenient way of extracting multiple values from data stored in (possibly nested) objects and Arrays. It can be used in locations that receive data (such as the left-hand side of an assignment). How to extract the values is specified via patterns (read on for examples).

解构是为了对象和数组抽出数据的便利方法 左侧是接受数据 对象通过属性名获值 数组通过位置获取数据

### 10.1.1 Object destructuring

Destructuring objects:

        const obj = { first: 'Jane', last: 'Doe' };
        const {first: f, last: l} = obj;
            // f = 'Jane'; l = 'Doe'

        // {prop} is short for {prop: prop}
        const {first, last} = obj;
            // first = 'Jane'; last = 'Doe'

Destructuring helps with processing return values:

        const obj = { foo: 123 };

        const {writable, configurable} =
            Object.getOwnPropertyDescriptor(obj, 'foo');

        console.log(writable, configurable); // true true

### 10.1.2 Array destructuring
### 数据解构

Array destructuring (works for all iterable values):

        const iterable = ['a', 'b'];
        const [x, y] = iterable;
            // x = 'a'; y = 'b'

Destructuring helps with processing return values:

        const [all, year, month, day] =
            /^(\d\d\d\d)-(\d\d)-(\d\d)$/
            .exec('2999-12-31');

### 10.1.3 Where can destructuring be used?

Destructuring can be used in the following locations (I’m showing Array patterns to demonstrate; object patterns work just as well):

        // Variable declarations: 变量声明
        const [x] = ['a'];
        let [x] = ['a'];
        var [x] = ['a'];

        // Assignments: 赋值
        [x] = ['a'];

        // Parameter definitions: 参数定义
        function f([x]) { ··· }
        f(['a']);

You can also destructure in a for-of loop:

在for-of循环用解构

        const arr = ['a', 'b'];
        for (const [index, element] of arr.entries()) {
            console.log(index, element);
        }
        // Output:
        // 0 a
        // 1 b

### 10.2 Background: Constructing data versus extracting data
### 组成数据与抽取数据

To fully understand what destructuring is, let’s first examine its broader context.

JavaScript has operations for constructing data, one property at a time:


        const obj = {};
        obj.first = 'Jane';
        obj.last = 'Doe';

The same syntax can be used to extract data. Again, one property at a time:

        const f = obj.first;
        const l = obj.last;

Additionally, there is syntax to construct multiple properties at the same time, via an object literal:

        const obj = { first: 'Jane', last: 'Doe' };

Before ES6, there was no corresponding mechanism for extracting data. That’s what destructuring is – it lets you extract multiple properties from an object via an object pattern.

ES6之前没有抽取数据的机制

For example, on the left-hand side of an assignment:

        const { first: f, last: l } = obj;

You can also destructure Arrays via patterns:

        const [x, y] = ['a', 'b']; // x = 'a'; y = 'b'

### 10.3 Patterns for destructuring

The following two parties are involved in destructuring:

* **Destructuring source:** the data to be destructured. For example, the right-hand side of a destructuring assignment.

* **Destructuring target:**  the pattern used for destructuring. For example, the left-hand side of a destructuring assignment.

The destructuring target is either one of three patterns:

Assignment target. For example: x

* An assignment target is usually a variable. But in destructuring assignment, you have more options, as I’ll explain later.

* Object pattern. For example: { first: «pattern», last: «pattern» }
The parts of an object pattern are properties, the property values are again patterns (recursively).

* Array pattern. For example: [ «pattern», «pattern» ]
The parts of an Array pattern are elements, the elements are again patterns (recursively).

That means that you can nest patterns, arbitrarily deeply:

        const obj = { a: [{ foo: 123, bar: 'abc' }, {}], b: true };
        const { a: [{foo: f}] } = obj; // f = 123

### 10.3.1 Pick what you need

If you destructure an object, you mention only those properties that you are interested in:

        const { x: x } = { x: 7, y: 3 }; // x = 7

If you destructure an Array, you can choose to only extract a prefix:

        const [x,y] = ['a', 'b', 'c']; // x='a'; y='b';

### 10.4 How do patterns access the innards of values?

In an assignment pattern = someValue, how does the pattern access what’s inside someValue?

### 10.4.1 Object patterns coerce values to objects

The object pattern coerces destructuring sources to objects before accessing properties. That means that it works with primitive values:

        const {length : len} = 'abc'; // len = 3
        const {toString: s} = 123; // s = Number.prototype.toString

### 10.4.1.1 Failing to object-destructure a value

The coercion to object is not performed via Object(), but via the internal operation ToObject(). The two operations handle undefined and null differently.

Object() converts primitive values to wrapper objects and leaves objects untouched:

        > typeof Object('abc')
        'object'

        > var obj = {};
        > Object(obj) === obj
        true

It also converts undefined and null to empty objects:

        > Object(undefined)
        {}
        > Object(null)
        {}

In contrast, ToObject() throws a TypeError if it encounters undefined or null. Therefore, the following destructurings fail, even before destructuring accesses any properties:

        const { prop: x } = undefined; // TypeError
        const { prop: y } = null; // TypeError

As a consequence, you can use the empty object pattern {} to check whether a value is coercible to an object. As we have seen, only undefined and null aren’t:

        **({} = [true, false]); // OK, Arrays are coercible to objects**
        **({} = 'abc'); // OK, strings are coercible to objects**

        ({} = undefined); // TypeError
        ({} = null); // TypeError

The parentheses around the expressions are necessary because statements must not begin with curly braces in JavaScript

### 10.4.2 Array patterns work with iterables

Array destructuring uses an iterator to get to the elements of a source. Therefore, you can Array-destructure any value that is iterable. Let’s look at examples of iterable values.

Strings are iterable:

        const [x,...y] = 'abc'; // x='a'; y=['b', 'c']

Don’t forget that the iterator over strings returns code points (“Unicode characters”, 21 bits), not code units (“JavaScript characters”, 16 bits). (For more information on Unicode, consult [the chapter “Chapter 24. Unicode and JavaScript”](http://speakingjs.com/es5/ch24.html) in “Speaking JavaScript”.)

For example:

        const [x,y,z] = 'a\uD83D\uDCA9c'; // x='a'; y='\uD83D\uDCA9'; z='c'

You can’t access the elements of a Set via indices, but you can do so via an iterator.

Set不能通过索引获取数据 但是可以通过迭代获取数据

Therefore, Array destructuring works for Sets:

因此 数组的解构和Sets类似

const [x,y] = new Set(['a', 'b']); // x='a'; y='b’;

The Set iterator always returns elements in the order in which they were inserted, which is why the result of the previous destructuring is always the same.

### 10.4.2.1 Failing to Array-destructure a value
### 数组解构错误

A value is iterable if it has a method whose key is Symbol.iterator that returns an object. Array-destructuring throws a TypeError if the value to be destructured isn’t iterable:

          let x;
          [x] = [true, false]; // OK, Arrays are iterable
          [x] = 'abc'; // OK, strings are iterable
          [x] = { * [Symbol.iterator]() { yield 1 } }; // OK, iterable

          [x] = {}; // TypeError, empty objects are not iterable
          [x] = undefined; // TypeError, not iterable
          [x] = null; // TypeError, not iterable

The TypeError is thrown even before accessing elements of the iterable, which means that you can use the empty Array pattern [] to check whether a value is iterable:

可以用一个空数组来检查一个变量是否可迭代

          [] = {}; // TypeError, empty objects are not iterable
          [] = undefined; // TypeError, not iterable
          [] = null; // TypeError, not iterable

### 10.5 Default values
#### 解构的默认值

Default values are an optional feature of patterns. They provide a fallback if nothing is found in the source. If a part (an object property or an Array element) has no match in the source, it is matched against:

* its default value (if specified; it’s optional)
* undefined (otherwise)

Let’s look at an example. In the following destructuring, the element at index 0 has no match on the right-hand side. Therefore, destructuring continues by matching x against 3, which leads to x being set to 3.

          const [x=3, y] = []; // x = 3; y = undefined

You can also use default values in object patterns:

          const {foo: x=3, bar: y} = {}; // x = 3; y = undefined

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

### 10.5.1 undefined triggers default values
### undefined引发默认值

Default values are also used if a part does have a match and that match is undefined:

            const [x=1] = [undefined]; // x = 1
            const {prop: y=2} = {prop: undefined}; // y = 2


### 10.5.2 Default values are computed on demand
### 默认值也用来计算之后的值

The default values themselves are only computed when they are needed. In other words, this destructuring:

            const {prop: y=someFunc()} = someValue;
            is equivalent to:

            let y;
            if (someValue.prop === undefined) {
                y = someFunc();
            } else {
                y = someValue.prop;
            }

You can observe that if you use console.log():

            > function log(x) { console.log(x); return 'YES' }

            > const [a=log('hello')] = [];
            > a
            'YES'

            > const [b=log('hello')] = [123];
            > b
            123

In the second destructuring, the default value is not triggered and log() is not called.


### 10.5.3 Default values can refer to other variables in the pattern
### 默认值与其他变量

A default value can refer to any variable, including other variables in the same pattern:

        const [x=3, y=x] = [];     // x=3; y=3
        const [x=3, y=x] = [7];    // x=7; y=7
        const [x=3, y=x] = [7, 2]; // x=7; y=2


However, order matters: the variables x and y are declared from left to right and produce a ReferenceError if they are accessed before their declarations:

解构从左到右

          const [x=y, y=3] = []; // ReferenceError

### 10.5.4 Default values for patterns

So far we have only seen default values for variables, but you can also associate them with patterns:

          const [{ prop: x } = {}] = [];

What does this mean? Recall the rule for default values: If a part has no match in the source, destructuring continues with the default value.

The element at index 0 has no match, which is why destructuring continues with:

          const { prop: x } = {}; // x = undefined

You can more easily see why things work this way if you replace the pattern { prop: x } with the variable pattern:

          const [pattern = {}] = [];


### 10.5.5 More complex default values

Let’s further explore default values for patterns. In the following example, we assign a value to x via the default value { prop: 123 }:

          const [{ prop: x } = { prop: 123 }] = [];

Because the Array element at index 0 has no match on the right-hand side, destructuring continues as follows and x is set to 123.

          const { prop: x } = { prop: 123 };  // x = 123


However, x is not assigned a value in this manner if the right-hand side has an element at index 0, because then the default value isn’t triggered.

          const [{ prop: x } = { prop: 123 }] = [{}];


In this case, destructuring continues with:

          const { prop: x } = {}; // x = undefined

Thus, if you want x to be 123 if either the object or the property is missing, you need to specify a default value for x itself:

const [{ prop: x=123 } = {}] = [{}];

Here, destructuring continues as follows, independently of whether the right-hand side is [{}] or [].

const { prop: x=123 } = {}; // x = 123

### 10.6 More object destructuring features

### 10.6.1 Property value shorthands

Property value shorthands are a feature of object literals: If the property value is a variable that has the same name as the property key then you can omit the key. This works for destructuring, too:

          const { x, y } = { x: 11, y: 8 }; // x = 11; y = 8

          // Same as:
          const { x: x, y: y } = { x: 11, y: 8 };

You can also combine property value shorthands with default values:

          const { x, y = 1 } = {}; // x = undefined; y = 1

### 10.6.2 Computed property keys

Computed property keys are another object literal feature that also works for destructuring. You can specify the key of a property via an expression, if you put it in square brackets:

        const FOO = 'foo';
        const { [FOO]: f } = { foo: 123 }; // f = 123

Computed property keys allow you to destructure properties whose keys are symbols:

        // Create and destructure a property whose key is a symbol
        const KEY = Symbol();
        const obj = { [KEY]: 'abc' };
        const { [KEY]: x } = obj; // x = 'abc'

        // Extract Array.prototype[Symbol.iterator]
        const { [Symbol.iterator]: func } = [];
        console.log(typeof func); // function

### 10.7 More Array destructuring features

### 10.7.1 Elision
### 省略

Elision lets you use the syntax of Array “holes” to skip elements during destructuring:

省略让你有语法的空位置来忽略元素

        const [,, x, y] = ['a', 'b', 'c', 'd']; // x = 'c'; y = 'd'

### 10.7.2 Rest operator (...)
### 剩余操作符来获取数组解构

The rest operator lets you extract the remaining elements of an iterable into an Array. If this operator is used inside an Array pattern, it must come last:

        const [x, ...y] = ['a', 'b', 'c'];

        // x='a'; y=['b', 'c']

The [spread operator](http://exploringjs.com/es6/ch_parameter-handling.html#sec_spread-operator) has exactly the same syntax as the rest operator – three dots. But they are different: the former contributes data to Array literals and function calls, whereas the latter is used for destructuring and extracts data.

If the operator can’t find any elements, it matches its operand against the empty Array. That is, it never produces undefined or null. For example:

剩余操作符不会是undefined null 只能是空数组[]

        const [x, y, ...z] = ['a']; // x='a'; y=undefined; z=[]

The operand of the rest operator doesn’t have to be a variable, you can use patterns, too:

const [x, ...[y, z]] = ['a', 'b', 'c'];
    // x = 'a'; y = 'b'; z = 'c'
The rest operator triggers the following destructuring:

[y, z] = ['b', 'c']


### 10.8 You can assign to more than just variables

If you assign via destructuring, each assignment target can be everything that is allowed on the left-hand side of a normal assignment.

For example, a reference to a property (obj.prop):

        const obj = {};
        ({ foo: obj.prop } = { foo: 123 });
        console.log(obj); // {prop:123}

Or a reference to an Array element (arr[0]):

        const arr = [];
        ({ bar: arr[0] } = { bar: true });
        console.log(arr); // [true]

You can also assign to object properties and Array elements via the rest operator (...):

        const obj = {};
        [first, ...obj.prop] = ['a', 'b', 'c'];

         // first = 'a'; obj.prop = ['b', 'c']

If you declare variables or define parameters via destructuring then you must use simple identifiers, you can’t refer to object properties and Array elements

### 10.9 Pitfalls of destructuring
### 解构易犯错误

There are two things to be mindful of when using destructuring:

* You can’t start a statement with a curly brace

* 不能{}开始语句

* During destructuring, you can either declare variables or assign to them, but not both.
The next two sections contain the details.

* 解构过程 不仅声明变量或且赋值  但是不能同时

### 10.9.1 Don’t start a statement with a curly brace
### 解构过程不能或括号开始

Because code blocks begin with a curly brace, statements must not begin with one. This is unfortunate when using object destructuring in an assignment:

因为块代码是或括号开始 语句不必须开始

        { a, b } = someObject; // SyntaxError

The work-around is to put the complete expression in parentheses:

        ({ a, b } = someObject); // OK

The following syntax does not work:

        ({ a, b }) = someObject; // SyntaxError


With let, var and const, curly braces never cause problems:

const { a, b } = someObject; // OK

总结:在解构过程如果只有赋值不能以花括号开始

### 10.10 Examples of destructuring

Let’s start with a few smaller examples.

The for-of loop supports destructuring:

        const map = new Map().set(false, 'no').set(true, 'yes');

        for (const [key, value] of map) {
          console.log(key + ' is ' + value);
        }

You can use destructuring to swap values. That is something that engines could optimize, so that no Array would be created.

        [a, b] = [b, a];

You can use destructuring to split an Array:

const [first, ...rest] = ['a', 'b', 'c'];
    // first = 'a'; rest = ['b', 'c']

### 10.10.1 Destructuring returned Arrays

Some built-in JavaScript operations return Arrays. Destructuring helps with processing them:

          const [all, year, month, day] =
              /^(\d\d\d\d)-(\d\d)-(\d\d)$/
              .exec('2999-12-31');

If you are only interested in the groups (and not in the complete match, all), you can use elision to skip the array element at index 0:

          const [, year, month, day] =
              /^(\d\d\d\d)-(\d\d)-(\d\d)$/
              .exec('2999-12-31');

exec() returns null if the regular expression doesn’t match. Unfortunately, you can’t handle null via default values, which is why you must use the Or operator (||) in this case:

          const [, year, month, day] =
              /^(\d\d\d\d)-(\d\d)-(\d\d)$/
              .exec(someStr) || [];


Array.prototype.split() returns an Array. Therefore, destructuring is useful if you are interested in the elements, not the Array:

    const cells = 'Jane\tDoe\tCTO'
    const [firstName, lastName, title] = cells.split('\t');
    console.log(firstName, lastName, title);

### 10.10.2 Destructuring returned objects

Destructuring is also useful for extracting data from objects that are returned by functions or methods. For example, the iterator method next() returns an object with two properties, done and value. The following code logs all elements of Array arr via the iterator iter. Destructuring is used in line A.

    const arr = ['a', 'b'];
    const iter = arr[Symbol.iterator]();
    while (true) {
        const {done,value} = iter.next(); // (A)
        if (done) break;
        console.log(value);
    }


### 10.10.3 Array-destructuring iterable values

    Array-destructuring works with any iterable value. That is occasionally useful:

    const [x,y] = new Set().add('a').add('b');
        // x = 'a'; y = 'b'

    const [a,b] = 'foo';
        // a = 'f'; b = 'o'


### 10.10.4 Multiple return values

To see the usefulness of multiple return values, let’s implement a function findElement(a, p) that searches for the first element in the Array a for which the function p returns true. The question is: what should findElement() return? Sometimes one is interested in the element itself, sometimes in its index, sometimes in both. The following implementation returns both.

        function findElement(array, predicate) {
            for (const [index, element] of array.entries()) { // (A)
                if (predicate(element, index, array)) {
                    // We found an element:
                    return { element, index };
                        // Same as (property value shorthands):
                        // { element: element, index: index }
                }
            }
            // We couldn’t find anything; return failure values:
            return { element: undefined, index: -1 };
        }

The function iterates over all elements of array, via the Array method entries(), which returns an iterable over [index,element] pairs (line A). The parts of the pairs are accessed via destructuring.

Let’s use findElement():

        const arr = [7, 8, 6];
        const {element, index} = findElement(arr, x => x % 2 === 0);
            // element = 8, index = 1

Several ECMAScript 6 features allowed us to write more concise code: The callback is an arrow function; the return value is destructured via an object pattern with property value shorthands.

Due to index and element also referring to property keys, the order in which we mention them doesn’t matter. We can swap them and nothing changes:

        const {index, element} = findElement(···);

We have successfully handled the case of needing both index and element. What if we are only interested in one of them? It turns out that, thanks to ECMAScript 6, our implementation can take care of that, too. And the syntactic overhead compared to functions with single return values is minimal.

        const a = [7, 8, 6];

        const {element} = findElement(a, x => x % 2 === 0);
            // element = 8

        const {index} = findElement(a, x => x % 2 === 0);
            // index = 1

Each time, we only extract the value of the one property that we need.

### 10.11 The destructuring algorithm

This section looks at destructuring from a different angle: as a recursive pattern matching algorithm.

This different angle should especially help with understanding default values. If you feel you don’t fully understand them yet, read on.

At the end, I’ll use the algorithm to explain the difference between the following two function declarations.

function move({x=0, y=0} = {})         { ··· }
function move({x, y} = { x: 0, y: 0 }) { ··· }


### 10.11.1 The algorithm

A destructuring assignment looks like this:

«pattern» = «value»

We want to use pattern to extract data from value. I’ll now describe an algorithm for doing so, which is known in functional programming as pattern matching (short: matching). The algorithm specifies the operator ← (“match against”) for destructuring assignment that matches a pattern against a value and assigns to variables while doing so:

«pattern» ← «value»

The algorithm is specified via recursive rules that take apart both operands of the ← operator. The declarative notation may take some getting used to, but it makes the specification of the algorithm more concise. Each rule has two parts:

* The head (first line) describes the condition that triggers the rule.
* The body (remaining lines) describes what happens if the rule is triggered.

Let’s look at an example:

* (2c) {key: «pattern», «properties»} ← obj

          «pattern» ← obj.key
          {«properties»} ← obj

* (2e) {} ← obj (no properties left) // Nothing to do

In rule (2c), the head means that this rule is executed if there is an object pattern with at least one property and zero or more remaining properties. That pattern is matched against a value obj. The effect of this rule is that execution continues with the property value pattern being matched against obj.key and the remaining properties being matched against obj.

In rule (2e), the head means that this rule is executed if the empty object pattern {} is matched against a value obj. Then there is nothing to be done.

Whenever the algorithm is invoked, the rules are checked top to bottom and only the first rule that is applicable is executed.

I only show the algorithm for destructuring assignment. Destructuring variable declarations and destructuring parameter definitions work similarly.

I don’t cover advanced features (computed property keys; property value shorthands; object properties and array elements as assignment targets), either. Only the basics.

* 10.11.1.1 Patterns

A pattern is either:

* A variable: x
* An object pattern: {«properties»}
* An Array pattern: [«elements»]

Each of the following sections describes one of these three cases.

The following three sections specify how to handle these three cases. Each section contains one or more numbered rules.

### 10.11.1.2 Variable

(1) x ← value (including undefined and null)
  x = value

### 10.11.1.3 Object pattern

* (2a) {«properties»} ← undefined

  throw new TypeError();

* (2b) {«properties»} ← null

  throw new TypeError();

* (2c) {key: «pattern», «properties»} ← obj

  «pattern» ← obj.key

  {«properties»} ← obj

* (2d) {key: «pattern» = default_value, «properties»} ← obj

          const tmp = obj.key;
          if (tmp !== undefined) {
              «pattern» ← tmp
          } else {
              «pattern» ← default_value
          }
          {«properties»} ← obj

* (2e) {} ← obj (no properties left)

  // Nothing to do


### 10.11.1.4 Array pattern

Array pattern and iterable. The algorithm for Array destructuring starts with an Array pattern and an iterable:

  (3a) [«elements»] ← non_iterable

  assert(!isIterable(non_iterable))

    throw new TypeError();

  (3b) [«elements»] ← iterable

  assert(isIterable(iterable))

            const iterator = iterable[Symbol.iterator]();
            «elements» ← iterator

  Helper function:

            function isIterable(value) {
                return (value !== null
                    && typeof value === 'object'
                    && typeof value[Symbol.iterator] === 'function');
            }

  Array elements and iterator. The algorithm continues with the elements of the pattern (left-hand side of the arrow) and the iterator that was obtained from the iterable (right-hand side of the arrow).

* (3c) «pattern», «elements» ← iterator

    «pattern» ← getNext(iterator) // undefined after last item

    «elements» ← iterator

* (3d) «pattern» = default_value, «elements» ← iterator

          const tmp = getNext(iterator);  // undefined after last item

          if (tmp !== undefined) {
              «pattern» ← tmp
          } else {
              «pattern» ← default_value
          }
          «elements» ← iterator

* (3e) , «elements» ← iterator (hole, elision)

    getNext(iterator); // skip

    «elements» ← iterator

* (3f) ...«pattern» ← iterator (always last part!)

            const tmp = [];
            for (const elem of iterator) {
                tmp.push(elem);
            }
            «pattern» ← tmp

* (3g) ← iterator (no elements left)
    // Nothing to do

          Helper function:

          function getNext(iterator) {
              const {done,value} = iterator.next();
              return (done ? undefined : value);
          }

### 10.11.2 Applying the algorithm

In ECMAScript 6, you can simulate named parameters if the caller uses an object literal and the callee uses destructuring. This simulation is explained in detail in the chapter on parameter handling. The following code shows an example: function move1() has two named parameters, x and y:

          function move1({x=0, y=0} = {}) { // (A)
              return [x, y];
          }
          move1({x: 3, y: 8}); // [3, 8]
          move1({x: 3}); // [3, 0]
          move1({}); // [0, 0]
          move1(); // [0, 0]
          There are three default values in line A:

The first two default values allow you to omit x and y.

The third default value allows you to call move1() without parameters (as in the last line).

But why would you define the parameters as in the previous code snippet? Why not as follows – which is also completely legal ES6 code?

          function move2({x, y} = { x: 0, y: 0 }) {
              return [x, y];
          }

To see why move1() is correct, let’s use both functions for two examples. Before we do that, let’s see how the passing of parameters can be explained via matching.

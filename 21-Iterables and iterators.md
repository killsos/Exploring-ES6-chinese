### 21. Iterables and iterators

---
* 21.1. Overview
  * 21.1.1. Iterable values
  * 21.1.2. Constructs supporting iteration
* 21.2. Iterability
* 21.3. Iterable data sources
  * 21.3.1. Arrays
  * 21.3.2. Strings
  * 21.3.3. Maps
  * 21.3.4. Sets
  * 21.3.5. arguments
  * 21.3.6. DOM data structures
  * 21.3.7. Iterable computed data
  * 21.3.8. Plain objects are not iterable
* 21.4. Iterating language constructs
  * 21.4.1. Destructuring via an Array pattern
  * 21.4.2. The for-of loop
  * 21.4.3. Array.from()
  * 21.4.4. The spread operator (...)
  * 21.4.5. Maps and Sets
  * 21.4.6. Promises
  * 21.4.7. yield*
* 21.5. Implementing iterables
  * 21.5.1. Iterators that are iterable
  * 21.5.2. Optional iterator methods: return() and throw()
* 21.6. More examples of iterables
  * 21.6.1. Tool functions that return iterables
  * 21.6.2. Combinators for iterables
  * 21.6.3. Infinite iterables
* 21.7. FAQ: iterables and iterators
  * 21.7.1. Isn’t the iteration protocol slow?
  * 21.7.2. Can I reuse the same object several times?
  * 21.7.3. Why doesn’t ECMAScript 6 have iterable combinators?
  * 21.7.4. Aren’t iterables difficult to implement?
* 21.8. The ECMAScript 6 iteration protocol in depth
  * 21.8.1. Iteration
  * 21.8.2. Closing iterators
  * 21.8.3. Checklist

---

### 21.1 Overview

ES6 introduces a new mechanism for traversing data: iteration.

ES6有新迭代数据机制

Two concepts are central to iteration:

有两个观点是迭代的核心

* An iterable is a data structure that wants to make its elements accessible to the public. It does so by implementing a method whose key is Symbol.iterator. That method is a factory for iterators.

对象如果有Symbol.iterator属性是可迭代

* An iterator is a pointer for traversing the elements of a data structure (think cursors in databases).

可迭代是游标对于数据结构遍历元素

Expressed as interfaces in TypeScript notation, these roles look like this:

          interface Iterable {
              [Symbol.iterator]() : Iterator;
          }
          interface Iterator {
              next() : IteratorResult;
          }
          interface IteratorResult {
              value: any;
              done: boolean;
          }


### 21.1.1 Iterable values

The following values are iterable:

1. Arrays
2. Strings
3. Maps
4. Sets
5. DOM data structures (work in progress)

Plain objects are not iterable (why is explained in [a dedicated section](http://exploringjs.com/es6/ch_iteration.html#sec_plain-objects-not-iterable)).

### 21.1.2 Constructs supporting iteration

Language constructs that access data via iteration:


* Destructuring via an Array pattern:

        const [a,b] = new Set(['a', 'b', 'c']);

* for-of loop:

        for (const x of ['a', 'b', 'c']) {
            console.log(x);
        }

* Array.from():

        const arr = Array.from(new Set(['a', 'b', 'c']));

* Spread operator (...):

        const arr = [...new Set(['a', 'b', 'c'])];

* Constructors of Maps and Sets:

        const map = new Map([[false, 'no'], [true, 'yes']]);
        const set = new Set(['a', 'b', 'c']);

* Promise.all(), Promise.race():

        Promise.all(iterableOverPromises).then(···);
        Promise.race(iterableOverPromises).then(···);

* yield*:

        yield* anIterable;


### 21.2 Iterability
### 可迭代性

The idea of iterability is as follows.

* Data consumers:

JavaScript has language constructs that consume data.

For example, for-of loops over values and the spread operator (...) inserts values into Arrays or function calls.

for-of spread operator (...)

* Data sources:

The data consumers could get their values from a variety of sources.

For example, you may want to iterate over the elements of an Array, the key-value entries in a Map or the characters of a string.

It’s not practical for every consumer to support all sources, especially because it should be possible to create new sources (e.g. via libraries). Therefore, ES6 introduces the interface Iterable. Data consumers use it, data sources implement it:

<img src="./iteration----consumers_sources.jpg" />

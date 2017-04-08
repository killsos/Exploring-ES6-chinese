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

<img src="./iteration----consumers_sources.jpg"  width="500"/>

Given that JavaScript does not have interfaces, Iterable is more of a convention:

Source: A value is considered iterable if it has a method whose key is the symbol Symbol.iterator that returns a so-called iterator.

Symbol.iterator被称为可迭代

The iterator is an object that returns values via its method next(). We say: it iterates over the items (the content) of the iterable, one per method call.

Consumption: Data consumers use the iterator to retrieve the values they are consuming.

Let’s see what consumption looks like for an Array arr. First, you create an iterator via the method whose key is Symbol.iterator:

          > const arr = ['a', 'b', 'c'];
          > const iter = arr[Symbol.iterator]();


Then you call the iterator’s method next() repeatedly to retrieve the items “inside” the Array:

          > iter.next()
          { value: 'a', done: false }
          > iter.next()
          { value: 'b', done: false }
          > iter.next()
          { value: 'c', done: false }
          > iter.next()
          { value: undefined, done: true }


As you can see, next() returns each item wrapped in an object, as the value of the property value. The boolean property done indicates when the end of the sequence of items has been reached.

Iterable and iterators are part of a so-called protocol (interfaces plus rules for using them) for iteration.

A key characteristic of this protocol is that it is sequential: the iterator returns values one at a time.

That means that if an iterable data structure is non-linear (such as a tree), iteration will linearize it.

### 21.3 Iterable data sources

I’ll use the for-of loop to iterate over various kinds of iterable data.

### 21.3.1 Arrays

Arrays (and Typed Arrays) are iterables over their elements:

          for (const x of ['a', 'b']) {
              console.log(x);
          }
          // Output:
          // 'a'
          // 'b'


### 21.3.2 Strings

Strings are iterable, but they iterate over Unicode code points, each of which may comprise one or two JavaScript characters:

          for (const x of 'a\uD83D\uDC0A') {
              console.log(x);
          }
          // Output:
          // 'a'
          // '\uD83D\uDC0A' (crocodile emoji)

### 21.3.3 Maps

Maps are iterables over their entries. Each entry is encoded as a [key, value] pair, an Array with two elements. The entries are always iterated over deterministically, in the same order in which they were added to the map.

          const map = new Map().set('a', 1).set('b', 2);
          for (const pair of map) {
              console.log(pair);
          }
          // Output:
          // ['a', 1]
          // ['b', 2]


Note that WeakMaps are not iterable.

### 21.3.4 Sets

Sets are iterables over their elements (which are iterated over in the same order in which they were added to the Set).

          const set = new Set().add('a').add('b');
          for (const x of set) {
              console.log(x);
          }
          // Output:
          // 'a'
          // 'b'


Note that WeakSets are not iterable.

### 21.3.5 arguments

Even though the special variable arguments is more or less obsolete in ECMAScript 6 (due to rest parameters), it is iterable:

          function printArgs() {
              for (const x of arguments) {
                  console.log(x);
              }
          }
          printArgs('a', 'b');

          // Output:
          // 'a'
          // 'b'

### 21.3.6 DOM data structures

Most DOM data structures will eventually be iterable:

          for (const node of document.querySelectorAll('div')) {
              ···
          }

Note that implementing this functionality is work in progress. But it is relatively easy to do so, because the symbol Symbol.iterator can’t clash with existing property keys.


### 21.3.7 Iterable computed data

Not all iterable content does have to come from data structures, it could also be computed on the fly. For example, all major ES6 data structures (Arrays, Typed Arrays, Maps, Sets) have three methods that return iterable objects:

* entries() returns an iterable over entries encoded as [key, value] Arrays.

For Arrays, the values are the Array elements and the keys are their indices.

For Sets, each key and value are the same – the Set element.

* keys() returns an iterable over the keys of the entries.

* values() returns an iterable over the values of the entries.

Let’s see what that looks like. entries() gives you a nice way to get both Array elements and their indices:

          const arr = ['a', 'b', 'c'];
          for (const pair of arr.entries()) {
              console.log(pair);
          }
          // Output:
          // [0, 'a']
          // [1, 'b']
          // [2, 'c']


### 21.3.8 Plain objects are not iterable

Plain objects (as created by object literals) are not iterable:

空对象是通过对象字面量创建的是不可迭代

          for (const x of {}) { // TypeError
              console.log(x);
          }


Why aren’t objects iterable over properties, by default? The reasoning is as follows. There are two levels at which you can iterate in JavaScript:

1. The program level: iterating over properties means examining the structure of the program.

2. The data level: iterating over a data structure means examining the data managed by the program.


Making iteration over properties the default would mean mixing those levels, which would have two disadvantages:

* You can’t iterate over the properties of data structures.

* Once you iterate over the properties of an object, turning that object into a data structure would break your code.

If engines were to implement iterability via a method

Object.prototype[Symbol.iterator]() then there would be an additional caveat(警告): Objects created via Object.create(null) wouldn’t be iterable, because Object.prototype is not in their prototype chain.

It is important to remember that iterating over the properties of an object is mainly interesting if you use objects as Maps1. But we only do that in ES5 because we have no better alternative. In ECMAScript 6, we have the built-in data structure Map.

Plain objects (as created by object literals) are not iterable:

for (const x of {}) { // TypeError
    console.log(x);
}
Why aren’t objects iterable over properties, by default? The reasoning is as follows. There are two levels at which you can iterate in JavaScript:

The program level: iterating over properties means examining the structure of the program.
The data level: iterating over a data structure means examining the data managed by the program.
Making iteration over properties the default would mean mixing those levels, which would have two disadvantages:

You can’t iterate over the properties of data structures.
Once you iterate over the properties of an object, turning that object into a data structure would break your code.
If engines were to implement iterability via a method Object.prototype[Symbol.iterator]() then there would be an additional caveat: Objects created via Object.create(null) wouldn’t be iterable, because Object.prototype is not in their prototype chain.

It is important to remember that iterating over the properties of an object is mainly interesting if you use objects as Maps1. But we only do that in ES5 because we have no better alternative. In ECMAScript 6, we have the built-in data structure Map.

### 21.3.8.1 How to iterate over properties

The proper (and safe) way to iterate over prope[ties is via a tool function. For example, 【via objectEntries()](http://exploringjs.com/es6/ch_iteration.html#objectEntries), whose implementation is shown later (future ECMAScript versions may have something similar built in):

          const obj = { first: 'Jane', last: 'Doe' };

          for (const [key,value] of objectEntries(obj)) {
              console.log(`${key}: ${value}`);
          }

          // Output:
          // first: Jane
          // last: Doe


### 21.4 Iterating language constructs

The following ES6 language constructs make use of the iteration protocol:

* Destructuring via an Array pattern
* for-of loop
* Array.from()
* Spread operator (...)
* Constructors of Maps and Sets
* Promise.all(), Promise.race()
* yield*

### 21.4.1 Destructuring via an Array pattern
### 通过数组格式解构

Destructuring via Array patterns works for any iterable:

const set = new Set().add('a').add('b').add('c');

        const [x,y] = set;
            // x='a'; y='b'

        const [first, ...rest] = set;
            // first='a'; rest=['b','c'];

### 21.4.2 The for-of loop

for-of is a new loop in ECMAScript 6. It’s basic form looks like this:

        for (const x of iterable) {
            ···
        }

Note that the iterability of iterable is required, otherwise for-of can’t loop over a value. That means that non-iterable values must be converted to something iterable. For example, via Array.from().

### 21.4.3 Array.from()

Array.from() converts iterable and Array-like values to Arrays. It is also available for typed Arrays.

        > Array.from(new Map().set(false, 'no').set(true, 'yes'))
        [[false,'no'], [true,'yes']]
        > Array.from({ length: 2, 0: 'hello', 1: 'world' })
        ['hello', 'world']


For more information on Array.from(), consult the chapter on Arrays.

### 21.4.4 The spread operator (...)

The spread operator inserts the values of an iterable into an Array:

        > const arr = ['b', 'c'];
        > ['a', ...arr, 'd']
        ['a', 'b', 'c', 'd']


That means that it provides you with a compact way to convert any iterable to an Array:

         const arr = [...iterable];

The spread operator also turns an iterable into the arguments of a function, method or constructor call:

          > Math.max(...[-1, 8, 3])
          8


### 21.4.5 Maps and Sets

The constructor of a Map turns an iterable over [key, value] pairs into a Map:

          > const map = new Map([['uno', 'one'], ['dos', 'two']]);
          > map.get('uno')
          'one'
          > map.get('dos')
          'two'


The constructor of a Set turns an iterable over elements into a Set:

          > const set = new Set(['red', 'green', 'blue']);
          > set.has('red')
          true
          > set.has('yellow')
          false


The constructors of WeakMap and WeakSet work similarly. Furthermore, Maps and Sets are iterable themselves (WeakMaps and WeakSets aren’t), which means that you can use their constructors to clone them.

### 21.4.6 Promises

Promise.all() and Promise.race() accept iterables over Promises:

          Promise.all(iterableOverPromises).then(···);
          Promise.race(iterableOverPromises).then(···);


### 21.4.7 yield*

yield* is an operator that is only available inside generators. It yields all items iterated over by an iterable.

              function* yieldAllValuesOf(iterable) {
                  yield* iterable;
              }

The most important use case for yield* is to recursively call a generator (which produces something iterable).

### 21.5 Implementing iterables

In this section, I explain in detail how to implement iterables. Note that ES6 generators are usually much more convenient for this task than doing so “manually”.

The iteration protocol looks as follows.

<img src="./iteration----iteration_protocol.jpg" width=500 />

An object becomes iterable (“implements” the interface Iterable) if it has a method (own or inherited) whose key is Symbol.iterator. That method must return an iterator, an object that iterates over the items “inside” the iterable via its method next().

In TypeScript notation, the interfaces for iterables and iterators look as follows2.

            interface Iterable {
                [Symbol.iterator]() : Iterator;
            }
            interface Iterator {
                next() : IteratorResult;
                return?(value? : any) : IteratorResult;
            }
            interface IteratorResult {
                value: any;
                done: boolean;
            }

return() is an optional method that we’ll get to later3. Let’s first implement a dummy iterable to get a feeling for how iteration works.

          const iterable = {
              [Symbol.iterator]() {
                  let step = 0;
                  const iterator = {
                      next() {
                          if (step <= 2) {
                              step++;
                          }
                          switch (step) {
                              case 1:
                                  return { value: 'hello', done: false };
                              case 2:
                                  return { value: 'world', done: false };
                              default:
                                  return { value: undefined, done: true };
                          }
                      }
                  };
                  return iterator;
              }
          };

Let’s check that iterable is, in fact, iterable:

          for (const x of iterable) {
              console.log(x);
          }
          // Output:
          // hello
          // world


The code executes three steps, with the counter step ensuring that everything happens in the right order. First, we return the value 'hello', then the value 'world' and then we indicate that the end of the iteration has been reached. Each item is wrapped in an object with the properties:

* value which holds the actual item and
* done which is a boolean flag that indicates whether the end has been reached, yet.

You can omit done if it is false and value if it is undefined. That is, the switch statement could be written as follows.

          switch (step) {
              case 1:
                  return { value: 'hello' };
              case 2:
                  return { value: 'world' };
              default:
                  return { done: true };
          }

As is explained in the the chapter on generators, there are cases where you want even the last item with done: true to have a value. Otherwise, next() could be simpler and return items directly (without wrapping them in objects). The end of iteration would then be indicated via a special value (e.g., a symbol).

Let’s look at one more implementation of an iterable. The function iterateOver() returns an iterable over the arguments that are passed to it:

          function iterateOver(...args) {
              let index = 0;
              const iterable = {
                  [Symbol.iterator]() {
                      const iterator = {
                          next() {
                              if (index < args.length) {
                                  return { value: args[index++] };
                              } else {
                                  return { done: true };
                              }
                          }
                      };
                      return iterator;
                  }
              }
              return iterable;
          }

          // Using `iterateOver()`:
          for (const x of iterateOver('fee', 'fi', 'fo', 'fum')) {
              console.log(x);
          }

          // Output:
          // fee
          // fi
          // fo
          // fum

### 21.5.1 Iterators that are iterable

The previous function can be simplified if the iterable and the iterator are the same object:

              function iterateOver(...args) {
                  let index = 0;
                  const iterable = {
                      [Symbol.iterator]() {
                          return this;
                      },
                      next() {
                          if (index < args.length) {
                              return { value: args[index++] };
                          } else {
                              return { done: true };
                          }
                      },
                  };
                  return iterable;
              }

Even if the original iterable and the iterator are not the same object, it is still occasionally useful if an iterator has the following method (which also makes it an iterable):

          [Symbol.iterator]() {
              return this;
          }

All built-in ES6 iterators follow this pattern (via a common prototype, see the chapter on generators). For example, the default iterator for Arrays:

          > const arr = [];
          > const iterator = arr[Symbol.iterator]();
          > iterator[Symbol.iterator]() === iterator
          true


Why is it useful if an iterator is also an iterable? for-of only works for iterables, not for iterators. Because Array iterators are iterable, you can continue an iteration in another loop:

          const arr = ['a', 'b'];
          const iterator = arr[Symbol.iterator]();

          for (const x of iterator) {
              console.log(x); // a
              break;
          }

          // Continue with same iterator:
          for (const x of iterator) {
              console.log(x); // b
          }

One use case for continuing an iteration is that you can remove initial items (e.g. a header) before processing the actual content via for-of.


### 21.5.2 Optional iterator methods: return() and throw()

Two iterator methods are optional:

* return() gives an iterator the opportunity to clean up if an iteration ends prematurely.

* throw() is about forwarding a method call to a generator that is iterated over via yield*. It is explained in the chapter on generators.


### 21.5.2.1 Closing iterators via return()
### 终止循环通过return()

As mentioned before, the optional iterator method return() is about letting an iterator clean up if it wasn’t iterated over until the end.

It closes an iterator. In for-of loops, premature (or abrupt, in spec language) termination can be caused by:

* break
* continue (if you continue an outer loop, continue acts like a break)
* throw
* return


In each of these cases, for-of lets the iterator know that the loop won’t finish.

Let’s look at an example, a function readLinesSync that returns an iterable of text lines in a file and would like to close that file no matter what happens:

          function readLinesSync(fileName) {
              const file = ···;
              return {
                  ···
                  next() {
                      if (file.isAtEndOfFile()) {
                          file.close();
                          return { done: true };
                      }
                      ···
                  },
                  return() {
                      file.close();
                      return { done: true };
                  },
              };
          }

Due to return(), the file will be properly closed in the following loop:

        // Only print first line
        for (const line of readLinesSync(fileName)) {
            console.log(x);
            break;
        }

The return() method must return an object. That is due to how generators handle the return statement and will be explained in the chapter on generators.

The following constructs close iterators that aren’t completely “drained”:

1. for-of
2. yield*
3. Destructuring
4. Array.from()
5. Map(), Set(), WeakMap(), WeakSet()
6. Promise.all(), Promise.race()

A later section has more information on closing iterators

### 21.6 More examples of iterables

In this section, we look at a few more examples of iterables. Most of these iterables are easier to implement via generators. The chapter on generators shows how.

### 21.6.1 Tool functions that return iterables

Tool functions and methods that return iterables are just as important as iterable data structures. The following is a tool function for iterating over the own properties of an object.

        function objectEntries(obj) {
            let index = 0;

            // In ES6, you can use strings or symbols as property keys,
            // Reflect.ownKeys() retrieves both
            const propKeys = Reflect.ownKeys(obj);

            return {
                [Symbol.iterator]() {
                    return this;
                },
                next() {
                    if (index < propKeys.length) {
                        const key = propKeys[index];
                        index++;
                        return { value: [key, obj[key]] };
                    } else {
                        return { done: true };
                    }
                }
            };
        }

        const obj = { first: 'Jane', last: 'Doe' };
        for (const [key,value] of objectEntries(obj)) {
            console.log(`${key}: ${value}`);
        }

        // Output:
        // first: Jane
        // last: Doe


Another option is to use an iterator instead of an index to traverse the Array with the property keys:

        function objectEntries(obj) {
            let iter = Reflect.ownKeys(obj)[Symbol.iterator]();

            return {
                [Symbol.iterator]() {
                    return this;
                },
                next() {
                    let { done, value: key } = iter.next();
                    if (done) {
                        return { done: true };
                    }
                    return { value: [key, obj[key]] };
                }
            };
        }


### 21.6.2 Combinators for iterables

Combinators4 are functions that combine existing iterables to create new ones.

### 21.6.2.1 take(n, iterable)

Let’s start with the combinator function take(n, iterable), which returns an iterable over the first n items of iterable.

        function take(n, iterable) {
            const iter = iterable[Symbol.iterator]();
            return {
                [Symbol.iterator]() {
                    return this;
                },
                next() {
                    if (n > 0) {
                        n--;
                        return iter.next();
                    } else {
                        return { done: true };
                    }
                }
            };
        }
        const arr = ['a', 'b', 'c', 'd'];
        for (const x of take(2, arr)) {
            console.log(x);
        }
        // Output:
        // a
        // b

### 21.6.2.2 zip(...iterables)

zip turns n iterables into an iterable of n-tuples (encoded as Arrays of length n).

        function zip(...iterables) {
            const iterators = iterables.map(i => i[Symbol.iterator]());
            let done = false;
            return {
                [Symbol.iterator]() {
                    return this;
                },
                next() {
                    if (!done) {
                        const items = iterators.map(i => i.next());
                        done = items.some(item => item.done);
                        if (!done) {
                            return { value: items.map(i => i.value) };
                        }
                        // Done for the first time: close all iterators
                        for (const iterator of iterators) {
                            if (typeof iterator.return === 'function') {
                                iterator.return();
                            }
                        }
                    }
                    // We are done
                    return { done: true };
                }
            }
        }

As you can see, the shortest iterable determines the length of the result:

        const zipped = zip(['a', 'b', 'c'], ['d', 'e', 'f', 'g']);
        for (const x of zipped) {
            console.log(x);
        }
        // Output:
        // ['a', 'd']
        // ['b', 'e']
        // ['c', 'f']


### 21.6.3 Infinite iterables

Some iterable may never be done.

            function naturalNumbers() {
                let n = 0;
                return {
                    [Symbol.iterator]() {
                        return this;
                    },
                    next() {
                        return { value: n++ };
                    }
                }
            }

With an infinite iterable, you must not iterate over “all” of it. For example, by breaking from a for-of loop:

            for (const x of naturalNumbers()) {
                if (x > 2) break;
                console.log(x);
            }

Or by only accessing the beginning of an infinite iterable:

            const [a, b, c] = naturalNumbers();
            // a=0; b=1; c=2;

Or by using a combinator. take() is one possibility:

            for (const x of take(3, naturalNumbers())) {
                console.log(x);
            }
            // Output:
            // 0
            // 1
            // 2


The “length” of the iterable returned by zip() is determined by its shortest input iterable. That means that zip() and naturalNumbers() provide you with the means to number iterables of arbitrary (finite) length:

        const zipped = zip(['a', 'b', 'c'], naturalNumbers());
        for (const x of zipped) {
            console.log(x);
        }
        // Output:
        // ['a', 0]
        // ['b', 1]
        // ['c', 2]


### 21.7 FAQ: iterables and iterators

### 21.7.1 Isn’t the iteration protocol slow?

You may be worried about the iteration protocol being slow, because a new object is created for each invocation of next(). However, memory management for small objects is fast in modern engines and in the long run, engines can optimize iteration so that no intermediate objects need to be allocated. A thread on es-discuss has more information.

### 21.7.2 Can I reuse the same object several times?

In principle, nothing prevents an iterator from reusing the same iteration result object several times – I’d expect most things to work well. However, there will be problems if a client caches iteration results:

            const iterationResults = [];
            const iterator = iterable[Symbol.iterator]();
            let iterationResult;
            while (!(iterationResult = iterator.next()).done) {
                iterationResults.push(iterationResult);
            }

If an iterator reuses its iteration result object, iterationResults will, in general, contain the same object multiple times.

### 21.7.3 Why doesn’t ECMAScript 6 have iterable combinators?

You may be wondering why ECMAScript 6 does not have iterable combinators, tools for working with iterables or for creating iterables. That is because the plans are to proceed in two steps:

1. Step 1: standardize an iteration protocol.
2. Step 2: wait for libraries based on that protocol.

Eventually, one such library or pieces from several libraries will be added to the JavaScript standard library.

If you want to get an impression of what such a library could look like, take a look at the standard Python module itertools.

### 21.7.4 Aren’t iterables difficult to implement?

Yes, iterables are difficult to implement – if you implement them manually. The next chapter will introduce generators that help with this task (among other things).

### 21.8 The ECMAScript 6 iteration protocol in depth

The iteration protocol comprises the following interfaces (I have omitted throw() from Iterator, which is only supported by yield* and optional there):

        interface Iterable {
            [Symbol.iterator]() : Iterator;
        }
        interface Iterator {
            next() : IteratorResult;
            return?(value? : any) : IteratorResult;
        }
        interface IteratorResult {
            value : any;
            done : boolean;
        }

### 21.8.1 Iteration

Rules for next():

* As long as the iterator still has values x to produce, next() returns objects { value: x, done: false }.

* After the last value was iterated over, next() should always return an object whose property done is true.


### 21.8.1.1 The IteratorResult

The property done of an iterator result doesn’t have to be true or false, truthy or falsy is enough. All built-in language mechanisms let you omit done: false.

### 21.8.1.2 Iterables that return fresh iterators versus those that always return the same iterator

Some iterables produce a new iterator each time they are asked for one. For example, Arrays:

          function getIterator(iterable) {
              return iterable[Symbol.iterator]();
          }

          const iterable = ['a', 'b'];
          console.log(getIterator(iterable) === getIterator(iterable)); // false

Other iterables return the same iterator each time. For example, generator objects:

          function* elements() {
              yield 'a';
              yield 'b';
          }
          const iterable = elements();
          console.log(getIterator(iterable) === getIterator(iterable)); // true

Whether an iterable produces a fresh iterators or not matter when you iterate over the same iterable multiple times. For example, via the following function:

            function iterateTwice(iterable) {
                for (const x of iterable) {
                    console.log(x);
                }
                for (const x of iterable) {
                    console.log(x);
                }
            }

With fresh iterators, you can iterate over the same iterable multiple times:

            iterateTwice(['a', 'b']);
            // Output:
            // a
            // b
            // a
            // b

If the same iterator is returned each time, you can’t:

            iterateTwice(elements());
            // Output:
            // a
            // b

Note that each iterator in the standard library is also an iterable. Its method [Symbol.iterator]() return this, meaning that it always returns the same iterator (itself).

### 21.8.2 Closing iterators

The iteration protocol distinguishes two ways of finishing an iterator:

Exhaustion: the regular way of finishing an iterator is by retrieving all of its values. That is, one calls next() until it returns an object whose property done is true.
Closing: by calling return(), you tell the iterator that you don’t intend to call next(), anymore.
Rules for calling return():

return() is an optional method, not all iterators have it. Iterators that do have it are called closable.

return() should only be called if an iterator hasn’t be exhausted.

For example, for-of calls return() whenever it is left “abruptly” (before it is finished). The following operations cause abrupt exits: break, continue (with a label of an outer block), return, throw.

Rules for implementing return():

The method call return(x) should normally produce the object { done: true, value: x }, but language mechanisms only throw an error (source in spec) if the result isn’t an object.

After return() was called, the objects returned by next() should be done, too.

The following code illustrates that the for-of loop calls return() if it is aborted before it receives a done iterator result.

That is, return() is even called if you abort after receiving the last value. This is subtle and you have to be careful to get it right when you iterate manually or implement iterators.

            function createIterable() {
                let done = false;
                const iterable = {
                    [Symbol.iterator]() {
                        return this;
                    },
                    next() {
                        if (!done) {
                            done = true;
                            return { done: false, value: 'a' };
                        } else {
                            return { done: true, value: undefined };
                        }
                    },
                    return() {
                        console.log('return() was called!');
                    },
                };
                return iterable;
            }
            for (const x of createIterable()) {
                console.log(x);
                // There is only one value in the iterable and
                // we abort the loop after receiving it
                break;
            }
            // Output:
            // a
            // return() was called!


### 21.8.2.1 Closable iterators

An iterator is closable if it has a method return(). Not all iterators are closable. For example, Array iterators are not:

          > let iterable = ['a', 'b', 'c'];
          > const iterator = iterable[Symbol.iterator]();
          > 'return' in iterator
          false


Generator objects are closable by default. For example, the ones returned by the following generator function:

          function* elements() {
              yield 'a';
              yield 'b';
              yield 'c';
          }

If you invoke return() on the result of elements(), iteration is finished:

          > const iterator = elements();
          > iterator.next()
          { value: 'a', done: false }
          > iterator.return()
          { value: undefined, done: true }
          > iterator.next()
          { value: undefined, done: true }


If an iterator is not closable, you can continue iterating over it after an abrupt exit (such as the one in line A) from a for-of loop:

            function twoLoops(iterator) {
                for (const x of iterator) {
                    console.log(x);
                    break; // (A)
                }
                for (const x of iterator) {
                    console.log(x);
                }
            }
            function getIterator(iterable) {
                return iterable[Symbol.iterator]();
            }

            twoLoops(getIterator(['a', 'b', 'c']));
            // Output:
            // a
            // b
            // c

Conversely, elements() returns a closable iterator and the second loop inside twoLoops() doesn’t have anything to iterate over:

            twoLoops(elements());
            // Output:
            // a

### 21.8.2.2 Preventing iterators from being closed

The following class is a generic solution for preventing iterators from being closed. It does so by wrapping the iterator and forwarding all method calls except return().

          class PreventReturn {
              constructor(iterator) {
                  this.iterator = iterator;
              }
              /** Must also be iterable, so that for-of works */
              [Symbol.iterator]() {
                  return this;
              }
              next() {
                  return this.iterator.next();
              }
              return(value = undefined) {
                  return { done: false, value };
              }
              // Not relevant for iterators: `throw()`
          }

If we use PreventReturn, the result of the generator elements() won’t be closed after the abrupt exit in the first loop of twoLoops().

            function* elements() {
                yield 'a';
                yield 'b';
                yield 'c';
            }
            function twoLoops(iterator) {
                for (const x of iterator) {
                    console.log(x);
                    break; // abrupt exit
                }
                for (const x of iterator) {
                    console.log(x);
                }
            }
            twoLoops(elements());
            // Output:
            // a

            twoLoops(new PreventReturn(elements()));
            // Output:
            // a
            // b
            // c

There is another way of making generators unclosable: All generator objects produced by the generator function elements() have the prototype object elements.prototype. Via elements.prototype, you can hide the default implementation of return() (which resides in a prototype of elements.prototype) as follows:

            // Make generator object unclosable
            // Warning: may not work in transpilers
            elements.prototype.return = undefined;

            twoLoops(elements());
            // Output:
            // a
            // b
            // c

### 21.8.2.3 Handling clean-up in generators via try-finally

Some generators need to clean up (release allocated resources, close open files, etc.) after iteration over them is finished. Naively, this is how we’d implement it:

            function* genFunc() {
                yield 'a';
                yield 'b';

                console.log('Performing cleanup');
            }
            In a normal for-of loop, everything is fine:

            for (const x of genFunc()) {
                console.log(x);
            }
            // Output:
            // a
            // b
            // Performing cleanup

However, if you exit the loop after the first yield, execution seemingly pauses there forever and never reaches the cleanup step:

            for (const x of genFunc()) {
                console.log(x);
                break;
            }
            // Output:
            // a

What actually happens is that, whenever one leaves a for-of loop early, for-of sends a return() to the current iterator. That means that the cleanup step isn’t reached because the generator function returns beforehand.

Thankfully, this is easily fixed, by performing the cleanup in a finally clause:

          function* genFunc() {
              try {
                  yield 'a';
                  yield 'b';
              } finally {
                  console.log('Performing cleanup');
              }
          }
          Now everything works as desired:

          for (const x of genFunc()) {
              console.log(x);
              break;
          }
          // Output:
          // a
          // Performing cleanup

The general pattern for using resources that need to be closed or cleaned up in some manner is therefore:

        function* funcThatUsesResource() {
            const resource = allocateResource();
            try {
                ···
            } finally {
                resource.deallocate();
            }
        }


### 21.8.2.4 Handling clean-up in manually implemented iterators

          const iterable = {
              [Symbol.iterator]() {
                  function hasNextValue() { ··· }
                  function getNextValue() { ··· }
                  function cleanUp() { ··· }
                  let returnedDoneResult = false;
                  return {
                      next() {
                          if (hasNextValue()) {
                              const value = getNextValue();
                              return { done: false, value: value };
                          } else {
                              if (!returnedDoneResult) {
                                  // Client receives first `done` iterator result
                                  // => won’t call `return()`
                                  cleanUp();
                                  returnedDoneResult = true;
                              }
                              return { done: true, value: undefined };
                          }
                      },
                      return() {
                          cleanUp();
                      }
                  };
              }
          }

Note that you must call cleanUp() when you are going to return a done iterator result for the first time. You must not do it earlier, because then return() may still be called. This can be tricky to get right.

### 21.8.2.5 Closing iterators you use

If you use iterators, you should close them properly. In generators, you can let for-of do all the work for you:

          /**
           * Converts a (potentially infinite) sequence of
           * iterated values into a sequence of length `n`
           */
          function* take(n, iterable) {
              for (const x of iterable) {
                  if (n <= 0) {
                      break; // closes iterable
                  }
                  n--;
                  yield x;
              }
          }

If you manage things manually, more work is required:

          function* take(n, iterable) {
              const iterator = iterable[Symbol.iterator]();
              while (true) {
                  const {value, done} = iterator.next();
                  if (done) break; // exhausted
                  if (n <= 0) {
                      // Abrupt exit
                      maybeCloseIterator(iterator);
                      break;
                  }
                  yield value;
                  n--;
              }
          }
          function maybeCloseIterator(iterator) {
              if (typeof iterator.return === 'function') {
                  iterator.return();
              }
          }


Even more work is necessary if you don’t use generators:

          function take(n, iterable) {
              const iter = iterable[Symbol.iterator]();
              return {
                  [Symbol.iterator]() {
                      return this;
                  },
                  next() {
                      if (n > 0) {
                          n--;
                          return iter.next();
                      } else {
                          maybeCloseIterator(iter);
                          return { done: true };
                      }
                  },
                  return() {
                      n = 0;
                      maybeCloseIterator(iter);
                  }
              };
          }

### 21.8.3 Checklist

* Documenting an iterable: provide the following information.

  * Does it return fresh iterators or the same iterator each time?
  * Are its iterators closable?

* Implementing an iterator:
  * Clean-up activity must happen if either an iterator is exhausted or if return() is called.
    * In generators, try-finally lets you handle both in a single location.
  * After an iterator was closed via return(), it should not produce any more iterator results via next().

* Using an iterator manually (versus via for-of etc.):
  * Don’t forget to close the iterator via return, if – and only if – you don’t exhaust it. Getting this right can be tricky.

* Continuing to iterate over an iterator after an abrupt exit: The iterator must either be unclosable or made unclosable (e.g. via a tool class).

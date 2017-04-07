### 17. The for-of loop

---

* 17.1. Overview
* 17.2. Introducing the for-of loop
* 17.3. Pitfall: for-of only works with iterable values
* 17.4. Iteration variables: const declarations versus var declarations
* 17.5. Iterating with existing variables, object properties and Array elements
* 17.6. Iterating with a destructuring pattern

---

### 17.1 Overview

for-of is a new loop in ES6 that replaces both for-in and forEach() and supports the new iteration protocol.

for-of是新的ES6循环---为了替代for-in和forEach并且支持新的迭代方法

Use it to loop over iterable objects (Arrays, strings, Maps, Sets, etc.; see Chap. “Iterables and iterators”):

for-of可以迭代对象是 数组 字符串 Maps Sets

        const iterable = ['a', 'b'];
        for (const x of iterable) {
            console.log(x);
        }

        // Output:
        // a
        // b

break and continue work inside for-of loops:

break和continue可以在for-of循环中使用

        for (const x of ['a', '', 'b']) {
            if (x.length === 0) break;
            console.log(x);
        }

        // Output:
        // a

Access both elements and their indices while looping over an Array (the square brackets before of mean that we are using destructuring):

          const arr = ['a', 'b'];
          for (const [index, element] of arr.entries()) {
              console.log(`${index}. ${element}`);
          }

          // Output:
          // 0. a
          // 1. b

Looping over the [key, value] entries in a Map (the square brackets before of mean that we are using destructuring):

        const map = new Map([
            [false, 'no'],
            [true, 'yes'],
        ]);

        for (const [key, value] of map) {
            console.log(`${key} => ${value}`);
        }

        // Output:
        // false => no
        // true => yes

### 17.2 Introducing the for-of loop

for-of lets you loop over data structures that are iterable: Arrays, strings, Maps, Sets and others. How exactly iterability works is explained in Chap. “Iterables and iterators”. But you don’t have to know the details if you use the for-of loop:

        const iterable = ['a', 'b'];
        for (const x of iterable) {
            console.log(x);
        }

        // Output:
        // a
        // b

for-of goes through the items of iterable and assigns them, one at a time, to the loop variable x, before it executes the body. The scope of x is the loop, it only exists inside it.

        You can use break and continue:

        for (const x of ['a', '', 'b']) {
            if (x.length === 0) break;
            console.log(x);
        }

        // Output:
        // a

for-of combines the advantages of:

* Normal for loops: break/continue; usable in generators

* break/continue可以正常使用

* forEach() methods: concise syntax

* forEach简洁语法

### 17.3 Pitfall: for-of only works with iterable values 

The operand of the of clause must be iterable. That means that you need a helper function if you want to iterate over plain objects (see “Plain objects are not iterable”). If a value is Array-like, you can convert it to an Array via Array.from():

// Array-like, but not iterable!
const arrayLike = { length: 2, 0: 'a', 1: 'b' };

for (const x of arrayLike) { // TypeError
    console.log(x);
}

for (const x of Array.from(arrayLike)) { // OK
    console.log(x);
}

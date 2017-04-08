### 19. Maps and Sets

---

* 19.1. Overview
  * 19.1.1. Maps
  * 19.1.2. Sets
  * 19.1.3. WeakMaps
* 19.2. Map
  * 19.2.1. Basic operations
  * 19.2.2. Setting up a Map
  * 19.2.3. Keys
  * 19.2.4. Iterating over Maps
  * 19.2.5. Looping over Map entries
  * 19.2.6. Mapping and filtering Maps
  * 19.2.7. Combining Maps
  * 19.2.8. Arbitrary Maps as JSON via Arrays of pairs
  * 19.2.9. String Maps as JSON via objects
  * 19.2.10. Map API
* 19.3. WeakMap
  * 19.3.1. WeakMap keys are objects
  * 19.3.2. WeakMap keys are weakly held
  * 19.3.3. You can’t get an overview of a WeakMap or clear it
  * 19.3.4. Use cases for WeakMaps
  * 19.3.5. WeakMap API
* 19.4. Set
  * 19.4.1. Basic operations
  * 19.4.2. Setting up a Set
  * 19.4.3. Comparing Set elements
  * 19.4.4. Iterating
  * 19.4.5. Mapping and filtering
  * 19.4.6. Union, intersection, difference
  * 19.4.7. Set API
* 19.5. WeakSet
  * 19.5.1. Use cases for WeakSets
  * 19.5.2. WeakSet API
* 19.6. FAQ: Maps and Sets
  * 19.6.1. Why do Maps and Sets have the property size and not length?
  * 19.6.2. Why can’t I configure how Maps and Sets compare keys and values?
  * 19.6.3. Is there a way to specify a default value when getting something out of a Map?
  * 19.6.4. When should I use a Map, when an object?
  * 19.6.5. When would I use an object as a key in a Map?

---

### 19.1 Overview

Among others, the following four data structures are new in ECMAScript 6: Map, WeakMap, Set and WeakSet.

ECMAScript 6中新数据结构Map, WeakMap, Set and WeakSet.

19.1.1 Maps

The keys of a Map can be arbitrary values:

Map的属性名可以是任意值

Map有set get has delete 方法  增 查 删

        > const map = new Map(); // create an empty Map
        > const KEY = {};

        > map.set(KEY, 123);
        > map.get(KEY)
        123
        > map.has(KEY)
        true
        > map.delete(KEY);
        true
        > map.has(KEY)
        false


You can use an Array (or any iterable) with [key, value] pairs to set up the initial data in the Map:

可以数组用[key, value]对来填充数据

      const map = new Map([
          [ 1, 'one' ],
          [ 2, 'two' ],
          [ 3, 'three' ], // trailing comma is ignored
      ]);

### 19.1.2 Sets

A Set is a collection of unique elements:

Set是唯一元素的集合

            const arr = [5, 1, 5, 7, 7, 5];
            const unique = [...new Set(arr)]; // [ 5, 1, 7 ]

As you can see, you can initialize a Set with elements if you hand the constructor an iterable (arr in the example) over those elements.

### 19.1.3 WeakMaps 

A WeakMap is a Map that doesn’t prevent its keys from being garbage-collected. That means that you can associate data with objects without having to worry about memory leaks. For example:

//----- Manage listeners

const _objToListeners = new WeakMap();

function addListener(obj, listener) {
    if (! _objToListeners.has(obj)) {
        _objToListeners.set(obj, new Set());
    }
    _objToListeners.get(obj).add(listener);
}

function triggerListeners(obj) {
    const listeners = _objToListeners.get(obj);
    if (listeners) {
        for (const listener of listeners) {
            listener();
        }
    }
}

//----- Example: attach listeners to an object

const obj = {};
addListener(obj, () => console.log('hello'));
addListener(obj, () => console.log('world'));

//----- Example: trigger listeners

triggerListeners(obj);

// Output:
// hello
// world

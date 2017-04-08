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

A WeakMap is a Map that doesn’t prevent its keys from being garbage-collected. That means that you can associate data with objects without having to worry about memory leaks.

weakMap不会禁止键的垃圾回收 这样你可以将数据与对象关联 不需要担心内存泄漏

weakMap的键会检查变量引用 只要其中任意一个引用值被解除 则该键值对就被删除

For example:

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


### 19.2 Map

JavaScript has always had a very spartan standard library. Sorely missing was a data structure for mapping values to values.
The best you can get in ECMAScript 5 is a Map from strings to arbitrary values, by abusing objects. Even then there are [several pitfalls](http://speakingjs.com/es5/ch17.html#_pitfalls_using_an_object_as_a_map) that can trip you up.

trip up 绊倒

The Map data structure in ECMAScript 6 lets you use arbitrary values as keys and is highly welcome.

Map可以使用任用值作为属性名

### 19.2.1 Basic operations

Working with single entries:

            > const map = new Map();

            > map.set('foo', 123);
            > map.get('foo')
            123

            > map.has('foo')
            true
            > map.delete('foo')
            true
            > map.has('foo')
            false

Determining the size of a Map and clearing it:

            > const map = new Map();
            > map.set('foo', true);
            > map.set('bar', false);

            > map.size
            2
            > map.clear();
            > map.size
            0

MAP 操作 new set get has delete size clear()

### 19.2.2 Setting up a Map

You can set up a Map via an iterable over key-value “pairs” (Arrays with 2 elements). One possibility is to use an Array (which is iterable):

              const map = new Map([
                  [ 1, 'one' ],
                  [ 2, 'two' ],
                  [ 3, 'three' ], // trailing comma is ignored
              ]);

Alternatively, the set() method is chainable:

              const map = new Map()
              .set(1, 'one')
              .set(2, 'two')
              .set(3, 'three');

MAP可以通过可迭代的键值对生成 set支持链式做法

### 19.2.3 Keys

Any value can be a key, even an object:

属性名可以是任意值 对象也是可以

          const map = new Map();

          const KEY1 = {};
          map.set(KEY1, 'hello');
          console.log(map.get(KEY1)); // hello

          const KEY2 = {};
          map.set(KEY2, 'world');
          console.log(map.get(KEY2)); // world

### 19.2.3.1 What keys are considered equal?
### 任意属性名被认为相等的

Most Map operations need to check whether a value is equal to one of the keys. They do so via the internal operation SameValueZero, which works like ===, but considers NaN to be equal to itself.

很大Map操作需要检查是否一个属性值与一个属性名相等的 这个过程是通过内部SameValueZero操作类似于=== 但NaN等于自己

Let’s first see how === handles NaN:

          > NaN === NaN
          false

Conversely, you can use NaN as a key in Maps, just like any other value:


            > const map = new Map();

            > map.set(NaN, 123);
            > map.get(NaN)
            123

Like ===, -0 and +0 are considered the same value. That is normally the best way to handle the two zeros (details are explained in “Speaking JavaScript”).

-0和+0被认为相同值  

            > map.set(-0, 123);
            > map.get(+0)
            123

Different objects are always considered different.

不同对象被认为不同

That is something that can’t be configured (yet), as explained later, in the FAQ.

            > new Map().set({}, 1).set({}, 2).size
            2

Getting an unknown key produces undefined:

没有的属性名获得undefined

            > new Map().get('asfddfsasadf')
            undefined

### 19.2.4 Iterating over Maps

Let’s set up a Map to demonstrate how one can iterate over it.

            const map = new Map([
                [false, 'no'],
                [true,  'yes'],
            ]);

Maps record the order in which elements are inserted and honor that order when iterating over keys, values or entries.

### 19.2.4.1 Iterables for keys and values

keys() returns an iterable over the keys in the Map:

Map的key()方法获得一个迭代的属性名

          for (const key of map.keys()) {
              console.log(key);
          }
          // Output:
          // false
          // true


values() returns an iterable over the values in the Map:

Map的values()方法获得一个迭代的属性值

            for (const value of map.values()) {
                console.log(value);
            }
            // Output:
            // no
            // yes

### 19.2.4.2 Iterables for entries

entries() returns the entries of the Map as an iterable over [key,value] pairs (Arrays).

Map的entries()方法获得一个迭代的属性名/值对的数组

          for (const entry of map.entries()) {
              console.log(entry[0], entry[1]);
          }
          // Output:
          // false no
          // true yes

Destructuring enables you to access the keys and values directly:

              for (const [key, value] of map.entries()) {
                  console.log(key, value);
              }

The default way of iterating over a Map is entries():

            > map[Symbol.iterator] === map.entries
            true

Map有Symbol.iterator属性并且与Map.entries相同操作

Thus, you can make the previous code snippet even shorter:

            for (const [key, value] of map) {
                console.log(key, value);
            }

所以对Map的迭代用for-of

### 19.2.4.3 Converting iterables (incl. Maps) to Arrays
### 可迭代转为数组

The spread operator (...) can turn an iterable into an Array. That lets us convert the result of Map.prototype.keys() (an iterable) into an Array:

          > const map = new Map().set(false, 'no').set(true, 'yes');
          > [...map.keys()]
          [ false, true ]

Maps are also iterable, which means that the spread operator can turn Maps into Arrays:

          > const map = new Map().set(false, 'no').set(true, 'yes');
          > [...map]
          [ [ false, 'no' ],
            [ true, 'yes' ] ]

### 19.2.5 Looping over Map entries

The Map method forEach has the following signature:

Map.prototype.forEach((value, key, map) => void, thisArg?) : void

Map的forEach((value, key, map) => void, thisArg?) : void

The signature of the first parameter mirrors the signature of the callback of Array.prototype.forEach, which is why the value comes first.

              const map = new Map([
                  [false, 'no'],
                  [true,  'yes'],
              ]);

              map.forEach((value, key) => {
                  console.log(key, value);
              });
              // Output:
              // false no
              // true yes

i.e 换言之 即

### 19.2.6 Mapping and filtering Maps

You can map() and filter() Arrays, but there are no such operations for Maps. The solution is:

Maps没有map()和 filter()方法

1.Convert the Map into an Array of [key,value] pairs.

2. Map or filter the Array.

3. Convert the result back to a Map.

I’ll use the following Map to demonstrate how that works.

          const originalMap = new Map()
          .set(1, 'a')
          .set(2, 'b')
          .set(3, 'c');

Mapping originalMap:

          const mappedMap = new Map( // step 3
              [...originalMap] // step 1
              .map(([k, v]) => [k * 2, '_' + v]) // step 2
          );
          // Resulting Map: {2 => '_a', 4 => '_b', 6 => '_c'}

Filtering originalMap:

          const filteredMap = new Map( // step 3
              [...originalMap] // step 1
              .filter(([k, v]) => k < 3) // step 2
          );
          // Resulting Map: {1 => 'a', 2 => 'b'}

Step 1 is performed by the spread operator (...) which I have explained previously.

虽然Map没有map filter方法 不过过度方法 先将Map通过扩展操作符转为数组

### 19.2.7 Combining Maps
### 合并Map

There are no methods for combining Maps, which is why the approach from the previous section must be used to do so.

Let’s combine the following two Maps:

          const map1 = new Map()
          .set(1, 'a1')
          .set(2, 'b1')
          .set(3, 'c1');

          const map2 = new Map()
          .set(2, 'b2')
          .set(3, 'c2')
          .set(4, 'd2');

To combine map1 and map2, I turn them into Arrays via the spread operator (...) and concatenate those Arrays. Afterwards, I convert the result back to a Map. All of that is done in the first line.

          > const combinedMap = new Map([...map1, ...map2])
          > [...combinedMap] // convert to Array to display
          [ [ 1, 'a1' ],
            [ 2, 'b2' ],
            [ 3, 'c2' ],
            [ 4, 'd2' ] ]

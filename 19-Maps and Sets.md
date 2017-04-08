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

想将Map通过扩展操作符转为数组 然后将数组生成合并 然后将合并后的数组再转为Map 但是存在一个问题如果属性名相同 后面值覆盖前值

          > const combinedMap = new Map([...map1, ...map2])
          > [...combinedMap] // convert to Array to display
          [ [ 1, 'a1' ],
            [ 2, 'b2' ],
            [ 3, 'c2' ],
            [ 4, 'd2' ] ]


### 19.2.8 Arbitrary Maps as JSON via Arrays of pairs
### 任意Map作为JSON通过数组对

If a Map contains arbitrary (JSON-compatible) data, we can convert it to JSON by encoding it as an Array of key-value pairs (2-element Arrays). Let’s examine first how to achieve that encoding.

Map可以包含任意数据包括json 我们可以转换JSON通过数组键值对的编码方式


### 19.2.8.1 Converting Maps to and from Arrays of pairs
### Maps转为数组键值对

The spread operator lets you convert a Map to an Array of pairs:
通过扩展操作符转Maps为数组对

            > const myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
            > [...myMap]
            [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]

The Map constructor lets you convert an Array of pairs to a Map:

            > new Map([[true, 7], [{foo: 3}, ['abc']]])
            Map {true => 7, Object {foo: 3} => ['abc']}

### 19.2.8.2 The conversion to and from JSON
### JSON转换

Let’s use this knowledge to convert any Map with JSON-compatible data to JSON and back:

            function mapToJson(map) {
                return JSON.stringify([...map]);
            }

**通过JSON.stringify([...map])方法**


            function jsonToMap(jsonStr) {
                return new Map(JSON.parse(jsonStr));
            }

**new Map(JSON.parse(jsonStr))**

The following interaction demonstrates how these functions are used:

            > const myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);

            > mapToJson(myMap)
            '[[true,7],[{"foo":3},["abc"]]]'

            > jsonToMap('[[true,7],[{"foo":3},["abc"]]]')
            Map {true => 7, Object {foo: 3} => ['abc']}


### 19.2.9 String Maps as JSON via objects

Whenever a Map only has strings as keys, you can convert it to JSON by encoding it as an object. Let’s examine first how to achieve that encoding.

### 19.2.9.1 Converting a string Map to and from an object

The following two function convert string Maps to and from objects:

                function strMapToObj(strMap) {
                    const obj = Object.create(null);
                    for (const [k,v] of strMap) {
                        // We don’t escape the key '__proto__'
                        // which can cause problems on older engines
                        obj[k] = v;
                    }
                    return obj;
                }

                function objToStrMap(obj) {
                    const strMap = new Map();
                    for (const k of Object.keys(obj)) {
                        strMap.set(k, obj[k]);
                    }
                    return strMap;
                }

Let’s use these two functions:

                > const myMap = new Map().set('yes', true).set('no', false);

                > strMapToObj(myMap)
                { yes: true, no: false }

                > objToStrMap({yes: true, no: false})
                [ [ 'yes', true ], [ 'no', false ] ]


### 19.2.9.2 The conversion to and from JSON

With these helper functions, the conversion to JSON works as follows:

                function strMapToJson(strMap) {
                    return JSON.stringify(strMapToObj(strMap));
                }

                function jsonToStrMap(jsonStr) {
                    return objToStrMap(JSON.parse(jsonStr));
                }

This is an example of using these functions:

                > const myMap = new Map().set('yes', true).set('no', false);

                > strMapToJson(myMap)
                '{"yes":true,"no":false}'

                > jsonToStrMap('{"yes":true,"no":false}');
                Map {'yes' => true, 'no' => false}

### 19.2.10 Map API

Constructor:

        new Map(entries? : Iterable<[any,any]>)

If you don’t provide the parameter iterable then an empty Map is created.

If you do provide an iterable over [key, value] pairs then those pairs are used to add entries to the Map.

For example:
                  const map = new Map([
                      [ 1, 'one' ],
                      [ 2, 'two' ],
                      [ 3, 'three' ], // trailing comma is ignored
                  ]);

**Handling single entries:**

1. Map.prototype.get(key) : any

Returns the value that key is mapped to in this Map. If there is no key key in this Map, undefined is returned.

2. Map.prototype.set(key, value) : this

Maps the given key to the given value. If there is already an entry whose key is key, it is updated. Otherwise, a new entry is created. This method returns this, which means that you can chain it.

3. Map.prototype.has(key) : boolean

Returns whether the given key exists in this Map.

4. Map.prototype.delete(key) : boolean

If there is an entry whose key is key, it is removed and true is returned. Otherwise, nothing happens and false is returned.

**Handling all entries:**

1. get Map.prototype.size : number

Returns how many entries there are in this Map.

2. Map.prototype.clear() : void

Removes all entries from this Map.


**Iterating and looping:** happens in the order in which entries were added to a Map.

1. Map.prototype.entries() : Iterable<[any,any]>

Returns an iterable with one [key,value] pair for each entry in this Map. The pairs are Arrays of length 2.

2. Map.prototype.forEach((value, key, collection) => void, thisArg?) : void

The first parameter is a callback that is invoked once for each entry in this Map. If thisArg is provided, this is set to it for each invocation. Otherwise, this is set to undefined.

3. Map.prototype.keys() : Iterable<any>

Returns an iterable over all keys in this Map.

4. Map.prototype.values() : Iterable<any>

Returns an iterable over all values in this Map.

5. Map.prototype[Symbol.iterator]() : Iterable<[any,any]>

The default way of iterating over Maps. Refers to Map.prototype.entries.

### 19.3 WeakMap

WeakMaps work mostly like Maps, with the following differences:

WeakMaps与Maps的区别:

1. WeakMap keys are objects (values can be arbitrary values)

WeakMap属性名是对象 但是属性值可以是任意值

2. WeakMap keys are weakly held

eakMap属性名是很脆弱存在

3. You can’t get an overview of the contents of a WeakMap

你不可以看到WeakMap的数据

4. You can’t clear a WeakMap

你不可以清除WeakMap

The following sections explain each of these differences.

### 19.3.1 WeakMap keys are objects
### WeakMap的属性名必须是对象 否则报出TypeError

If you add an entry to a WeakMap then the key must be an object:

          const wm = new WeakMap()

          wm.set('abc', 123); // TypeError
          wm.set({}, 123); // OK

### 19.3.2 WeakMap keys are weakly held

The keys in a WeakMap are weakly held: Normally, an object that isn’t referred to by any storage location (variable, property, etc.) can be garbage-collected.

WeakMap的属性名是脆弱的保持 通常 如果一个对象被设置为null 这个对象可以被垃圾回收

etc 等等及其他; 诸如此类

WeakMap keys do not count as storage locations in that sense. In other words: an object being a key in a WeakMap does not prevent the object being garbage-collected.

WeakMapd的属性名在一定意义上作为内存地址不考虑 换言之 一个对象作为key在WeakMap不能阻止这个对象被回收

Additionally, once a key is gone, its entry will also disappear (eventually, but there is no way to detect when, anyway).

加之,一旦一个属性消失了 这个属性所对用实体也就消失了 并且这个过程无法察觉到


### 19.3.3 You can’t get an overview of a WeakMap or clear it

It is impossible to inspect the innards of a WeakMap, to get an overview of them.

不能查看到WeakMap内部 他们所有的内容

That includes not being able to iterate over keys, values or entries. Put differently: to get content out of a WeakMap, you need a key.

这也包括无法遍历keys, values , entries 换言之你可以通过key获得value

There is no way to clear a WeakMap, either (as a work-around, you can create a completely new instance).

无法清除WeakMap 作为一个变通方法可以创建一个新实例

These restrictions enable a security property.

这些限制使更安全

Quoting Mark Miller: “The mapping from weakmap/key pair value can only be observed or affected by someone who has both the weakmap and the key.

With clear(), someone with only the WeakMap would’ve been able to affect the WeakMap-and-key-to-value mapping.”

Additionally, iteration would be difficult to implement, because you’d have to guarantee that keys remain weakly held.

此外 迭代是很难实现 因为你不得不保证keys的脆弱

### 19.3.4 Use cases for WeakMaps
### WeakMaps使用场景

WeakMaps are useful for associating data with objects whose life cycle you can’t (or don’t want to) control.

 WeakMaps是非常有用的对于一个数据与对象结合,这个生命周期不受控制

In this section, we look at two examples:

1. Caching computed results

缓存计算后结果

2. Managing listeners

管理监听事件

3. Keeping private data

保持私有数据

### 19.3.4.1 Caching computed results via WeakMaps

With WeakMaps, you can associate previously computed results with objects, without having to worry about memory management.

The following function countOwnKeys is an example: it caches previous results in the WeakMap cache.

        const cache = new WeakMap();

        function countOwnKeys(obj) {
            if (cache.has(obj)) {
                console.log('Cached');
                return cache.get(obj);
            } else {
                console.log('Computed');
                const count = Object.keys(obj).length;
                cache.set(obj, count);
                return count;
            }
        }

If we use this function with an object obj, you can see that the result is only computed for the first invocation, while a cached value is used for the second invocation:

          > const obj = { foo: 1, bar: 2};
          > countOwnKeys(obj)
          Computed
          2
          > countOwnKeys(obj)
          Cached
          2

### 19.3.4.2 Managing listeners

Let’s say we want to attach listeners to objects without changing the objects. You’d be able to add listeners to an object obj:

          const obj = {};
          addListener(obj, () => console.log('hello'));
          addListener(obj, () => console.log('world'));

And you’d be able to trigger the listeners:

          triggerListeners(obj);
          // Output:
          // hello
          // world

The two functions addListener() and triggerListeners() can be implemented as follows.

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

The advantage of using a WeakMap here is that, once an object is garbage-collected, its listeners will be garbage-collected, too. In other words: there won’t be any memory leaks.

WeakMap不需要担心内存泄漏

### 19.3.4.3 Keeping private data via WeakMaps

In the following code, the WeakMaps _counter and _action are used to store the data of virtual properties of instances of Countdown:


          const _counter = new WeakMap();
          const _action = new WeakMap();

          class Countdown {
              constructor(counter, action) {
                  _counter.set(this, counter);
                  _action.set(this, action);
              }
              dec() {
                  let counter = _counter.get(this);
                  if (counter < 1) return;
                  counter--;
                  _counter.set(this, counter);
                  if (counter === 0) {
                      _action.get(this)();
                  }
              }
          }

More information on this technique is given in the chapter on classes.

### 19.3.5 WeakMap API

The constructor and the four methods of WeakMap work the same as their Map equivalents:

1. new WeakMap(entries? : Iterable<[any,any]>)

2. WeakMap.prototype.get(key) : any

3. WeakMap.prototype.set(key, value) : this

4. WeakMap.prototype.has(key) : boolean

5. WeakMap.prototype.delete(key) : boolean

### 19.4 Set

ECMAScript 5 doesn’t have a Set data structure, either. There are two possible work-arounds:

ECMAScript 5没有set 但是有连个变通方法:

1. Use the keys of an object to store the elements of a set of strings.

使用对象的键来存储一组字符串的元素。

2. Store (arbitrary) set elements in an Array: Check whether it contains an element via indexOf(), remove elements via filter(), etc.

在数组中存储（任意）集元素：通过indexOf（）包含元素，通过filter（）等删除元素。

This is not a very fast solution, but it’s easy to implement. One issue to be aware of is that indexOf() can’t find the value NaN.

这不是很快的方案 但是很容易实现 但是一个问题是indexOf不能正确处理NaN

ECMAScript 6 has the data structure Set which works for arbitrary values, is fast and handles NaN correctly.

ECMAScript 6的Set可以赋值任意值 速度快 并且能正确处理NaN

### 19.4.1 Basic operations

Managing single elements:

          > const set = new Set();
          > set.add('red')

          > set.has('red')
          true
          > set.delete('red')
          true
          > set.has('red')
          false

Determining the size of a Set and clearing it:

          > const set = new Set();
          > set.add('red')
          > set.add('green')

          > set.size
          2
          > set.clear();
          > set.size
          0

### 19.4.2 Setting up a Set

You can set up a Set via an iterable over the elements that make up the Set. For example, via an Array:

            const set = new Set(['red', 'green', 'blue']);
            Alternatively, the add method is chainable:

            const set = new Set().add('red').add('green').add('blue');

### 19.4.2.1 Pitfall: new Set() has at most one argument
### 易犯的错误 new Set() 最多一个参数

The Set constructor has zero or one arguments:

Zero arguments: an empty Set is created.

零个参数是空set

One argument: the argument needs to be iterable; the iterated items define the elements of the Set.

一个参数 这个参数是可迭代

Further arguments are ignored, which may lead to unexpected results:

如果更多参数将被忽略

          > Array.from(new Set(['foo', 'bar']))
          [ 'foo', 'bar' ]
          > Array.from(new Set('foo', 'bar'))
          [ 'f', 'o' ]

For the second Set, only 'foo' is used (which is iterable) to define the Set.

### 19.4.3 Comparing Set elements

As with Maps, elements are compared similarly to ===, with the exception of NaN being like any other value.

对于映射元素比较类似=== 但是意外是NaN被等待其他值一样

          > const set = new Set([NaN]);
          > set.size
          1
          > set.has(NaN)
          true

Adding an element a second time has no effect:

          > const set = new Set();

          > set.add('foo');
          > set.size
          1

          > set.add('foo');
          > set.size
          1

Similarly to ===, two different objects are never considered equal (which can’t currently be customized, as explained later, in the FAQ, later):

两个不同对象是不认为相等的 类似于===  比较对象的内存地址

          > const set = new Set();

          > set.add({});
          > set.size
          1

          > set.add({});
          > set.size
          2

### 19.4.4 Iterating

Sets are iterable and the for-of loop works as you’d expect:

Sets是可迭代的 通过for-of

              const set = new Set(['red', 'green', 'blue']);
              for (const x of set) {
                  console.log(x);
              }
              // Output:
              // red
              // green
              // blue

As you can see, Sets preserve iteration order. That is, elements are always iterated over in the order in which they were inserted.

Sets保持迭代顺序

[The previously explained spread operator (...)](http://exploringjs.com/es6/ch_maps-sets.html#sec_spreading-maps) works with iterables and thus lets you convert a Set to an Array:

可以通过扩展操作符将Sets转为数组

          const set = new Set(['red', 'green', 'blue']);
          const arr = [...set]; // ['red', 'green', 'blue']

We now have a concise way to convert an Array to a Set and back, which has the effect of eliminating duplicates from the Array:

          const arr = [3, 5, 2, 2, 5, 5];
          const unique = [...new Set(arr)]; // [3, 5, 2]

### 19.4.5 Mapping and filtering
### 映射与过滤

In contrast to Arrays, Sets don’t have the methods map() and filter(). A work-around is to convert them to Arrays and back.

与数组相比 Sets没有map() and filter()方法 变通方法可以先将Sets转为数组

Mapping:

            const set = new Set([1, 2, 3]);
            set = new Set([...set].map(x => x * 2));
            // Resulting Set: {2, 4, 6}

Filtering:

            const set = new Set([1, 2, 3, 4, 5]);
            set = new Set([...set].filter(x => (x % 2) == 0));
            // Resulting Set: {2, 4}

### 19.4.6 Union, intersection, difference

ECMAScript 6 Sets have no methods for computing the union (e.g. addAll), intersection (e.g. retainAll) or difference (e.g. removeAll).

ECMAScript 6集合没有求并集 交集 差集的方法

This section explains how to work around that limitation.

下面将解释如何解决这些限制的变通方法


### 19.4.6.1 Union
### 并集

Union (a ∪ b): create a Set that contains the elements of both Set a and Set b.

              const a = new Set([1,2,3]);
              const b = new Set([4,3,2]);
              const union = new Set([...a, ...b]);
              // {1,2,3,4}

The pattern is always the same:

1. Convert one or both Sets to Arrays.
2. Perform the operation.
3. Convert the result back to a Set.

The spread operator (...) inserts the elements of something iterable (such as a Set) into an Array. Therefore, [...a, ...b] means that a and b are converted to Arrays and concatenated. It is equivalent to [...a].concat([...b]).


### 19.4.6.2 Intersection
### 交集

Intersection (a ∩ b): create a Set that contains those elements of Set a that are also in Set b.

            const a = new Set([1,2,3]);
            const b = new Set([4,3,2]);

            const intersection = new Set([...a].filter(x => b.has(x)));
            // {2,3}

Steps: Convert a to an Array, filter the elements, convert the result to a Set.
通过数组的filter方法和Sets.has()方法

### 19.4.6.3 Difference
### 差集

Difference (a \ b): create a Set that contains those elements of Set a that are not in Set b. This operation is also sometimes called minus (-).

            const a = new Set([1,2,3]);
            const b = new Set([4,3,2]);[...a].filter(x => !b.has(x)));
            // {1}


### 19.4.7 Set API

Constructor:

            new Set(elements? : Iterable<any>)

If you don’t provide the parameter iterable then an empty Set is created. If you do then the iterated values are added as elements to the Set.

如果没有参数 就是空Sets 如果这时候参数是可迭代的值 值将被添加到Sets中

For example:
              const set = new Set(['red', 'green', 'blue']);

**Single Set elements:*8

1. Set.prototype.add(value) : this

Adds value to this Set. This method returns this, which means that it can be chained.

2. Set.prototype.has(value) : boolean

Checks whether value is in this Set.

3. Set.prototype.delete(value) : boolean

Removes value from this Set.

**All Set elements:**

1. get Set.prototype.size : number

Returns how many elements there are in this Set.

2. Set.prototype.clear() : void

Removes all elements from this Set.

Iterating and looping:

1. Set.prototype.values() : Iterable<any>

Returns an iterable over all elements of this Set.

2. Set.prototype[Symbol.iterator]() : Iterable<any>

The default way of iterating over Sets. Points to Set.prototype.values.

3. Set.prototype.forEach((value, key, collection) => void, thisArg?)

Loops over the elements of this Set and invokes the callback (first parameter) for each one. value and key are both set to the element, so that this method works similarly to Map.prototype.forEach. If thisArg is provided, this is set to it for each call. Otherwise, this is set to undefined.

Symmetry(整齐) with Map: The following two methods only exist so that the interface of Sets is similar to the interface of Maps. Each Set element is handled as if it were a Map entry whose key and value are the element.

* Set.prototype.entries() : Iterable<[any,any]>


entries() allows you to convert a Set to a Map:

                const set = new Set(['a', 'b', 'c']);
                const map = new Map(set.entries());
                // Map { 'a' => 'a', 'b' => 'b', 'c' => 'c' }

###19.5 WeakSet

A WeakSet is a Set that doesn’t prevent its elements from being garbage-collected. Consult the section on WeakMap for an explanation of why WeakSets don’t allow iteration, looping and clearing.

WeakSet是不阻止垃圾回收的set WeakSet是不支持迭代 循环 清除.

### 19.5.1 Use cases for WeakSets
### 使用WeakSets情景

Given that you can’t iterate over their elements, there are not that many use cases for WeakSets. They do enable you to mark objects.

Given that ....鉴于

鉴于WeakSets不可以迭代 使用WeakSets的场景很少

### 19.5.1.1 Marking objects created by a factory function
### 通过工厂函数创建对象

For example, if you have a factory function for proxies, you can use a WeakSet to record which objects were created by that factory:

          const _proxies = new WeakSet();

          function createProxy(obj) {
              const proxy = ···;
              _proxies.add(proxy);
              return proxy;
          }

          function isProxy(obj) {
              return _proxies.has(obj);
          }

The complete example is shown [in the chapter on proxies.](http://exploringjs.com/es6/ch_proxies.html#sec_detect-proxies)

_proxies must be a WeakSet, because a normal Set would prevent a proxy from being garbage-collected once it isn’t referred to, anymore.

### 19.5.1.2 Marking objects as safe to use with a method

[Domenic Denicola ](https://mail.mozilla.org/pipermail/es-discuss/2015-June/043027.html)shows how a class Foo can ensure that its methods are only applied to instances that were created by it:

          const foos = new WeakSet();

          class Foo {
              constructor() {
                  foos.add(this);
              }

              method() {
                  if (!foos.has(this)) {
                      throw new TypeError('Incompatible object!');
                  }
              }
          }


### 19.5.2 WeakSet API

The constructor and the three methods of WeakSet work the same as their Set equivalents:

1. new WeakSet(elements? : Iterable<any>)

2. WeakSet.prototype.add(value)

3. WeakSet.prototype.has(value)

4. WeakSet.prototype.delete(value)



### 19.6 FAQ: Maps and Sets

### 19.6.1 Why do Maps and Sets have the property size and not length?

Arrays have the property length to count the number of entries. Maps and Sets have a different property, size.

The reason for this difference is that length is for sequences, data structures that are indexable – like Arrays. size is for collections that are primarily unordered – like Maps and Sets.

### 19.6.2 Why can’t I configure how Maps and Sets compare keys and values?

It would be nice if there were a way to configure what Map keys and what Set elements are considered equal. But that feature has been postponed, as it is difficult to implement properly and efficiently.

### 19.6.3 Is there a way to specify a default value when getting something out of a Map?

If you use a key to get something out of a Map, you’d occasionally like to specify a default value that is returned if the key is not in the Map. ES6 Maps don’t let you do this directly. But you can use the Or operator (||), as demonstrated in the following code. countChars returns a Map that maps characters to numbers of occurrences.

            function countChars(chars) {
                const charCounts = new Map();
                for (const ch of chars) {
                    ch = ch.toLowerCase();
                    const prevCount = charCounts.get(ch) || 0; // (A)
                    charCounts.set(ch, prevCount+1);
                }
                return charCounts;
            }

In line A, the default 0 is used if ch is not in the charCounts and get() returns undefined.

### 19.6.4 When should I use a Map, when an object?

If you map anything other than strings to any kind of data, you have no choice: you must use a Map.

If, however, you are mapping strings to arbitrary data, you must decide whether or not to use an object. A rough general guideline is:

* Is there a fixed set of keys (known at development time)?
Then use an object and access the values via fixed keys: obj.key

* Can the set of keys change at runtime?
Then use a Map and access the values via keys stored in variables: map.get(theKey)

### 19.6.5 When would I use an object as a key in a Map?

Map keys mainly make sense if they are compared by value (the same “content” means that two values are considered equal, not the same identity). That excludes objects. There is one use case – externally attaching data to objects, but that use case is better served by WeakMaps where an entry goes away when the key disappears.

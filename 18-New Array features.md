### 18. New Array features
---
* 18.1. Overview
* 18.2. New static Array methods
  * 18.2.1. Array.from(arrayLike, mapFunc?, thisArg?)
  * 18.2.2. Array.of(...items)
* 18.3. New Array.prototype methods
  * 18.3.1. Iterating over Arrays
  * 18.3.2. Searching for Array elements
  * 18.3.3. Array.prototype.copyWithin()
  * 18.3.4. Array.prototype.fill()
* 18.4. ES6 and holes in Arrays
  * 18.4.1. ECMAScript 6 treats holes like undefined elements
  * 18.4.2. Array operations and holes
  * 18.4.3. Creating Arrays filled with values
  * 18.4.4. Removing holes from Arrays
* 18.5. Configuring which objects are spread by concat() (Symbol.isConcatSpreadable)
  * 18.5.1. Default for Arrays: spreading
  * 18.5.2. Default for non-Arrays: no spreading
  * 18.5.3. Detecting Arrays
  * 18.5.4. Symbol.isConcatSpreadable in the standard library
* 18.6. The numeric range of Array indices

---

### 18.1 Overview

New static Array methods:

* Array.from(arrayLike, mapFunc?, thisArg?)
* Array.of(...items)

New Array.prototype methods:

Iterating:

  * Array.prototype.entries()
  * Array.prototype.keys()
  * Array.prototype.values()

Searching for elements:

  * Array.prototype.find(predicate, thisArg?)
  * Array.prototype.findIndex(predicate, thisArg?)
  * Array.prototype.copyWithin(target, start, end=this.length)
  * Array.prototype.fill(value, start=0, end=this.length)

总结:
from of entries keys values find findIndex copyWithin fill

### 8.2 New static Array methods

The object Array has new methods.

### 18.2.1 Array.from(arrayLike, mapFunc?, thisArg?)

Array.from()’s basic functionality is to convert two kinds of values to Arrays:

Array.from()可以将类数组转为数组

Array-like values, which have a property length and indexed elements. Examples include the results of DOM operations such as document.getElementsByClassName().

类数组 --- document.getElementsByClassName()

Iterable values, whose contents can be retrieved one element at a time. Strings and Arrays are iterable, as are ECMAScript’s new data structures Map and Set.

可迭代值 数组 字符串 Map Set

The following is an example of converting an Array-like object to an Array:

类数组 索引是0... 必须由lengths属性的对象 for-of可迭代的值

        const arrayLike = { length: 2, 0: 'a', 1: 'b' };

        // for-of only works with iterable values
        for (const x of arrayLike) { // TypeError
            console.log(x);
        }

        const arr = Array.from(arrayLike);
        for (const x of arr) { // OK, iterable
            console.log(x);
        }
        // Output:
        // a
        // b


### 18.2.1.1 Mapping via Array.from()

Array.from() is also a convenient alternative to using map() generically:

        const spans = document.querySelectorAll('span.name');

        // map(), generically:
        const names1 = Array.prototype.map.call(spans, s => s.textContent);

        // Array.from():
        const names2 = Array.from(spans, s => s.textContent);

In this example, the result of document.querySelectorAll() is again an Array-like object, not an Array, which is why we couldn’t invoke map() on it.

Previously, we converted the Array-like object to an Array in order to call forEach(). Here, we skipped that intermediate step via a generic method call and via the two-parameter version of Array.from().


### 18.2.1.2 from() in subclasses of Array

Another use case for Array.from() is to convert an Array-like or iterable value to an instance of a subclass of Array. For example, if you create a subclass MyArray of Array and want to convert such an object to an instance of MyArray, you simply use MyArray.from(). The reason that that works is because constructors inherit from each other in ECMAScript 6 (a super-constructor is the prototype of its sub-constructors).

        class MyArray extends Array {
            ···
        }
        const instanceOfMyArray = MyArray.from(anIterable);

You can also combine this functionality with mapping, to get a map operation where you control the result’s constructor:

        // from() – determine the result’s constructor via the receiver
        // (in this case, MyArray)
        const instanceOfMyArray = MyArray.from([1, 2, 3], x => x * x);

        // map(): the result is always an instance of Array
        const instanceOfArray   = [1, 2, 3].map(x => x * x);

The species pattern lets you configure what instances non-static built-in methods (such as slice(), filter() and map()) return. It is explained in Sect. “The species pattern” in Chap. “Classes”.

### 18.2.2 Array.of(...items)

Array.of(item_0, item_1, ···) creates an Array whose elements are item_0, item_1, etc.

创建一个数组新方法

### 18.2.2.1 Array.of() as an Array literal for subclasses of Array

If you want to turn several values into an Array, you should always use an Array literal, especially since the Array constructor doesn’t work properly if there is a single value that is a number (more information on this quirk):

          > new Array(3, 11, 8)
          [ 3, 11, 8 ]
          > new Array(3)
          [ , ,  ,]
          > new Array(3.1)
          RangeError: Invalid array length


But how are you supposed to turn values into an instance of a sub-constructor of Array then?

This is where Array.of() helps (remember that sub-constructors of Array inherit all of Array’s methods, including of()).

          class MyArray extends Array {
              ···
          }
          console.log(MyArray.of(3, 11, 8) instanceof MyArray); // true
          console.log(MyArray.of(3).length === 1); // true

### 18.3 New Array.prototype methods

Several new methods are available for Array instances.

18.3.1 Iterating over Arrays

The following methods help with iterating over Arrays:

          Array.prototype.entries()
          Array.prototype.keys()
          Array.prototype.values()

The result of each of the aforementioned methods is a sequence of values, but they are not returned as an Array; they are revealed one by one, via an iterator.

Let’s look at an example. I’m using Array.from() to put the iterators’ contents into Arrays:

          > Array.from(['a', 'b'].keys())
          [ 0, 1 ]
          > Array.from(['a', 'b'].values())
          [ 'a', 'b' ]
          > Array.from(['a', 'b'].entries())
          [ [ 0, 'a' ],
            [ 1, 'b' ] ]

I could also have used the spread operator (...) to convert iterators to Arrays:

          > [...['a', 'b'].keys()]
          [ 0, 1 ]

### 18.3.1.1 Iterating over [index, element] pairs

You can combine entries() with ECMAScript 6’s for-of loop and destructuring to conveniently iterate over [index, element] pairs:

          for (const [index, element] of ['a', 'b'].entries()) {
              console.log(index, element);
          }

### 18.3.2 Searching for Array elements

Array.prototype.find(predicate, thisArg?)

Returns the first Array element for which the callback predicate returns true. If there is no such element, it returns undefined. Example:

          > [6, -5, 8].find(x => x < 0)
          -5
          > [6, 5, 8].find(x => x < 0)
          undefined

Array.prototype.findIndex(predicate, thisArg?)

Returns the index of the first element for which the callback predicate returns true. If there is no such element, it returns -1. Example:

          > [6, -5, 8].findIndex(x => x < 0)
          1
          > [6, 5, 8].findIndex(x => x < 0)
          -1

The full signature of the callback predicate is:

          predicate(element, index, array)

### 18.3.2.1 Finding NaN via findIndex()

A well-known limitation of Array.prototype.indexOf() is that it can’t find NaN, because it searches for elements via ===:

          > [NaN].indexOf(NaN)
          -1

With findIndex(), you can use Object.is() (explained in the chapter on OOP) and will have no such problem:

          > [NaN].findIndex(y => Object.is(NaN, y))
          0

You can also adopt a more general approach, by creating a helper function elemIs():

          > function elemIs(x) { return Object.is.bind(Object, x) }
          > [NaN].findIndex(elemIs(NaN))
          0

### 18.3.3 Array.prototype.copyWithin()

The signature of this method is:

          Array.prototype.copyWithin(target : number,
              start : number, end = this.length) : This

It copies the elements whose indices are in the range [start,end) to index target and subsequent indices. If the two index ranges overlap, care is taken that all source elements are copied before they are overwritten.

Example:

          > const arr = [0,1,2,3];
          > arr.copyWithin(2, 0, 2)
          [ 0, 1, 0, 1 ]
          > arr
          [ 0, 1, 0, 1 ]

### 18.3.4 Array.prototype.fill()

The signature of this method is:

Array.prototype.fill(value : any, start=0, end=this.length) : This

It fills an Array with the given value:

          > const arr = ['a', 'b', 'c'];
          > arr.fill(7)
          [ 7, 7, 7 ]
          > arr
          [ 7, 7, 7 ]

Optionally, you can restrict where the filling starts and ends:

          > ['a', 'b', 'c'].fill(7, 1, 2)
          [ 'a', 7, 'c' ]

### 18.4 ES6 and holes in Arrays

Holes are indices “inside” an Array that have no associated element.

In other words: An Array arr is said to have a hole at index i if:

              0 ≤ i < arr.length
              !(i in arr)

For example: The following Array has a hole at index 1.

              > const arr = ['a',,'b']
              'use strict'
              > 0 in arr
              true
              > 1 in arr
              false
              > 2 in arr
              true
              > arr[1]
              undefined

You’ll see lots of examples involving holes in this section. Should anything ever be unclear, you can consult Sect. “Holes in Arrays” in “Speaking JavaScript” for more information.


ES6 pretends that holes don’t exist (as much as it can while being backward-compatible). And so should you – especially if you consider that holes can also affect performance negatively. Then you don’t have to burden your brain with the numerous and inconsistent rules around holes.


### 18.4.1 ECMAScript 6 treats holes like undefined elements

The general rule for Array methods that are new in ES6 is: each hole is treated as if it were the element undefined. Examples:

          > Array.from(['a',,'b'])
          [ 'a', undefined, 'b' ]
          > [,'a'].findIndex(x => x === undefined)
          0
          > [...[,'a'].entries()]
          [ [ 0, undefined ], [ 1, 'a' ] ]


The idea is to steer people away from holes and to simplify long-term.

Unfortunately that means that things are even more inconsistent now.

### 18.4.2 Array operations and holes

### 18.4.2.1 Iteration

The iterator created by Array.prototype[Symbol.iterator] treats each hole as if it were the element undefined. Take, for example, the following iterator iter:

        > var arr = [, 'a'];
        > var iter = arr[Symbol.iterator]();


If we invoke next() twice, we get the hole at index 0 and the element 'a' at index 1. As you can see, the former produces undefined:

          > iter.next()
          { value: undefined, done: false }
          > iter.next()
          { value: 'a', done: false }


Among others, two operations are based on the iteration protocol.

Therefore, these operations also treat holes as undefined elements.

First, the spread operator (...):

        > [...[, 'a']]
        [ undefined, 'a' ]

Second, the for-of loop:

          for (const x of [, 'a']) {
            console.log(x);
          }
          // Output:
          // undefined
          // a

Note that the Array prototype methods (filter() etc.) do not use the iteration protocol.

### 18.4.2.2 Array.from()

If its argument is iterable, Array.from() uses iteration to convert it to an Array. Then it works exactly like the spread operator:

        > Array.from([, 'a'])
        [ undefined, 'a' ]

But Array.from() can also convert Array-like objects to Arrays. Then holes become undefined, too:

        > Array.from({1: 'a', length: 2})
        [ undefined, 'a' ]

With a second argument, Array.from() works mostly like Array.prototype.map().

However, Array.from() treats holes as undefined:

          > Array.from([,'a'], x => x)
          [ undefined, 'a' ]
          > Array.from([,'a'], (value,index) => index)
          [ 0, 1 ]


Array.prototype.map() skips them, but preserves them:

          > [,'a'].map(x => x)
          [ , 'a' ]
          > [,'a'].map((x,i) => i)
          [ , 1 ]

### 18.4.2.3 Array.prototype methods

* In ECMAScript 5, behavior already varied slightly. For example:

  1. forEach(), filter(), every() and some() ignore holes.

  2. map() skips but preserves holes.

  3. join() and toString() treat holes as if they were undefined elements, but interprets both null and undefined as empty strings.

* ECMAScript 6 adds new kinds of behaviors:

  1. copyWithin() creates holes when copying holes (i.e., it deletes elements if necessary).

  2. entries(), keys(), values() treat each hole as if it was the element undefined.

  3. find() and findIndex() do the same.

  4. fill() doesn’t care whether there are elements at indices or not.


The following table describes how Array.prototype methods handle holes.

<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Holes are</th>
      <th>&nbsp;</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>concat</code></td>
      <td>Preserved</td>
      <td><code>['a',,'b'].concat(['c',,'d']) → ['a',,'b','c',,'d']</code></td>
    </tr>
    <tr>
      <td>
<code>copyWithin</code><sup>ES6</sup>
</td>
      <td>Preserved</td>
      <td><code>[,'a','b',,].copyWithin(2,0) → [,'a',,'a']</code></td>
    </tr>
    <tr>
      <td>
<code>entries</code><sup>ES6</sup>
</td>
      <td>Elements</td>
      <td><code>[...[,'a'].entries()] → [[0,undefined], [1,'a']]</code></td>
    </tr>
    <tr>
      <td><code>every</code></td>
      <td>Ignored</td>
      <td><code>[,'a'].every(x =&gt; x==='a') → true</code></td>
    </tr>
    <tr>
      <td>
<code>fill</code><sup>ES6</sup>
</td>
      <td>Filled</td>
      <td><code>new Array(3).fill('a') → ['a','a','a']</code></td>
    </tr>
    <tr>
      <td><code>filter</code></td>
      <td>Removed</td>
      <td><code>['a',,'b'].filter(x =&gt; true) → ['a','b']</code></td>
    </tr>
    <tr>
      <td>
<code>find</code><sup>ES6</sup>
</td>
      <td>Elements</td>
      <td><code>[,'a'].find(x =&gt; true) → undefined</code></td>
    </tr>
    <tr>
      <td>
<code>findIndex</code><sup>ES6</sup>
</td>
      <td>Elements</td>
      <td><code>[,'a'].findIndex(x =&gt; true) → 0</code></td>
    </tr>
    <tr>
      <td><code>forEach</code></td>
      <td>Ignored</td>
      <td><code>[,'a'].forEach((x,i) =&gt; log(i)); → 1</code></td>
    </tr>
    <tr>
      <td><code>indexOf</code></td>
      <td>Ignored</td>
      <td><code>[,'a'].indexOf(undefined) → -1</code></td>
    </tr>
    <tr>
      <td><code>join</code></td>
      <td>Elements</td>
      <td><code>[,'a',undefined,null].join('#') → '#a##'</code></td>
    </tr>
    <tr>
      <td>
<code>keys</code><sup>ES6</sup>
</td>
      <td>Elements</td>
      <td><code>[...[,'a'].keys()] → [0,1]</code></td>
    </tr>
    <tr>
      <td><code>lastIndexOf</code></td>
      <td>Ignored</td>
      <td><code>[,'a'].lastIndexOf(undefined) → -1</code></td>
    </tr>
    <tr>
      <td><code>map</code></td>
      <td>Preserved</td>
      <td><code>[,'a'].map(x =&gt; 1) → [,1]</code></td>
    </tr>
    <tr>
      <td><code>pop</code></td>
      <td>Elements</td>
      <td><code>['a',,].pop() → undefined</code></td>
    </tr>
    <tr>
      <td><code>push</code></td>
      <td>Preserved</td>
      <td><code>new Array(1).push('a') → 2</code></td>
    </tr>
    <tr>
      <td><code>reduce</code></td>
      <td>Ignored</td>
      <td><code>['#',,undefined].reduce((x,y)=&gt;x+y) → '#undefined'</code></td>
    </tr>
    <tr>
      <td><code>reduceRight</code></td>
      <td>Ignored</td>
      <td><code>['#',,undefined].reduceRight((x,y)=&gt;x+y) → 'undefined#'</code></td>
    </tr>
    <tr>
      <td><code>reverse</code></td>
      <td>Preserved</td>
      <td><code>['a',,'b'].reverse() → ['b',,'a']</code></td>
    </tr>
    <tr>
      <td><code>shift</code></td>
      <td>Elements</td>
      <td><code>[,'a'].shift() → undefined</code></td>
    </tr>
    <tr>
      <td><code>slice</code></td>
      <td>Preserved</td>
      <td><code>[,'a'].slice(0,1) → [,]</code></td>
    </tr>
    <tr>
      <td><code>some</code></td>
      <td>Ignored</td>
      <td><code>[,'a'].some(x =&gt; x !== 'a') → false</code></td>
    </tr>
    <tr>
      <td><code>sort</code></td>
      <td>Preserved</td>
      <td><code>[,undefined,'a'].sort() → ['a',undefined,,]</code></td>
    </tr>
    <tr>
      <td><code>splice</code></td>
      <td>Preserved</td>
      <td><code>['a',,].splice(1,1) → [,]</code></td>
    </tr>
    <tr>
      <td><code>toString</code></td>
      <td>Elements</td>
      <td><code>[,'a',undefined,null].toString() → ',a,,'</code></td>
    </tr>
    <tr>
      <td><code>unshift</code></td>
      <td>Preserved</td>
      <td><code>[,'a'].unshift('b') → 3</code></td>
    </tr>
    <tr>
      <td>
<code>values</code><sup>ES6</sup>
</td>
      <td>Elements</td>
      <td><code>[...[,'a'].values()] → [undefined,'a']</code></td>
    </tr>
  </tbody>

</table>

Notes:
* ES6 methods are marked via the superscript “ES6”.
* JavaScript ignores a trailing comma in an Array literal: ['a',,].length → 2

JavaScript数组中忽略最后一个分号

* Helper function used in the table: const log = console.log.bind(console);

### 18.4.3 Creating Arrays filled with values

Holes being treated as undefined elements by the new ES6 operations helps with creating Arrays that are filled with values.

### 18.4.3.1 Filling with a fixed value

Array.prototype.fill() replaces all Array elements (incl. holes) with a fixed value:

          > new Array(3).fill(7)
          [ 7, 7, 7 ]

new Array(3) creates an Array with three holes and fill() replaces each hole with the value 7.

### 18.4.3.2 Filling with ascending numbers

Array.prototype.keys() reports keys even if an Array only has holes. It returns an iterable, which you can convert to an Array via the spread operator:

          > [...new Array(3).keys()]
          [ 0, 1, 2 ]

### 18.4.3.3 Filling with computed values

The mapping function in the second parameter of Array.from() is notified of holes. Therefore, you can use Array.from() for more sophisticated filling:

          > Array.from(new Array(5), (value,index) => index*2)
          [ 0, 2, 4, 6, 8 ]

### 18.4.3.4 Filling with undefined

If you need an Array that is filled with undefined, you can use the fact that iteration (as triggered by the spread operator) converts holes to undefineds:

          > [...new Array(3)]
          [ undefined, undefined, undefined ]

### 18.4.4 Removing holes from Arrays

The ES5 method filter() lets you remove holes:

          > ['a',,'c'].filter(() => true)
          [ 'a', 'c' ]

ES6 iteration (triggered via the spread operator) lets you convert holes to undefined elements:

          > [...['a',,'c']]
          [ 'a', undefined, 'c' ]

### 18.5 Configuring which objects are spread by concat() (Symbol.isConcatSpreadable)

You can configure how Array.prototype.concat() treats objects by adding an (own or inherited) property whose key is the well-known symbol Symbol.isConcatSpreadable and whose value is a boolean.

Symbol.isConcatSpreadable这个值设定Array.prototype.concat()如何工作

### 18.5.1 Default for Arrays: spreading

By default, Array.prototype.concat() spreads Arrays into its result: their indexed elements become elements of the result:

Array.prototype.concat()默认扩散数组到数组

          const arr1 = ['c', 'd'];
          ['a', 'b'].concat(arr1, 'e');
          // ['a', 'b', 'c', 'd', 'e']

With Symbol.isConcatSpreadable, you can override the default and avoid spreading for Arrays:

通过Symbol.isConcatSpreadable可以重写

          const arr2 = ['c', 'd'];
          arr2[Symbol.isConcatSpreadable] = false;
          ['a', 'b'].concat(arr2, 'e');
          // ['a', 'b', ['c','d'], 'e']

### 18.5.2 Default for non-Arrays: no spreading

For non-Arrays, the default is not to spread:

          const arrayLike = {length: 2, 0: 'c', 1: 'd'};

          console.log(['a', 'b'].concat(arrayLike, 'e'));
          // ['a', 'b', arrayLike, 'e']

          console.log(Array.prototype.concat.call(arrayLike, ['e','f'], 'g'));
          // [arrayLike, 'e', 'f', 'g']

You can use Symbol.isConcatSpreadable to force spreading:

          arrayLike[Symbol.isConcatSpreadable] = true;

          console.log(['a', 'b'].concat(arrayLike, 'e'));
          // ['a', 'b', 'c', 'd', 'e']

          console.log(Array.prototype.concat.call(arrayLike, ['e','f'], 'g'));
          // ['c', 'd', 'e', 'f', 'g']

### 18.5.3 Detecting Arrays
### 判断数组 Array.isArray()

How does concat() determine if a parameter is an Array?

It uses the same algorithm as Array.isArray().

Whether or not Array.prototype is in the prototype chain makes no difference for that algorithm.

That is important, because, in ES5 and earlier, hacks were used to subclass Array and those must continue to work (see the section on __proto__ in this book):

Array.isArray()不是通过原型来判断

            > const arr = [];
            > Array.isArray(arr)
            true

            > Object.setPrototypeOf(arr, null);
            > Array.isArray(arr)
            true

### 18.5.4 Symbol.isConcatSpreadable in the standard library

No object in the ES6 standard library has a property with the key Symbol.isConcatSpreadable. This mechanism therefore exists purely for browser APIs and user code.

Consequences:

* Subclasses of Array are spread by default (because their instances are Array objects).

* A subclass of Array can prevent its instances from being spread by setting a property to false whose key is Symbol.isConcatSpreadable. That property can be a prototype property or an instance property.

* Other Array-like objects are spread by concat() if property [Symbol.isConcatSpreadable] is true. That would enable one, for example, to turn on spreading for some Array-like DOM collections.

* Typed Arrays are not spread. They don’t have a method concat(), either.

Typed Arrays是不能扩展 Typed Arrays也没有concat()方法

### Symbol.isConcatSpreadable in the ES6 spec

* In the[description of Array.prototype.concat()](http://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.concat), you can see that spreading requires an object to be Array-like (property length plus indexed elements).

* Whether or not to spread an object is determined via [the spec operation IsConcatSpreadable()](http://www.ecma-international.org/ecma-262/6.0/#sec-isconcatspreadable). The last step is the default (equivalent to Array.isArray()) and the property [Symbol.isConcatSpreadable] is retrieved via a normal Get() operation, meaning that it doesn’t matter whether it is own or inherited.

### 18.6 The numeric range of Array indices

For Arrays, ES6 still has the same rules as ES5:

* Array lengths l are in the range 0 ≤ l ≤ 2**32−1.
* Array indices i are in the range 0 ≤ i < 2**32−1.

However, Typed Arrays have a larger range of indices: 0 ≤ i < 2**32−1 (253−1 is the largest integer that JavaScript’s floating point numbers can safely represent).

That’s why generic Array methods such as push() and unshift() allow a larger range of indices. Range checks appropriate for Arrays are performed elsewhere, whenever length is set.

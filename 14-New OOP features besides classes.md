### 14. New OOP features besides classes

Classes (which are explained in the next chapter) are the major new OOP feature in ECMAScript 6. However, it also includes new features for object literals and new utility methods in Object. This chapter describes them.

---

* 14.1. Overview
  * 14.1.1. New object literal features
  * 14.1.2. New methods in Object
* 14.2. New features of object literals
  * 14.2.1. Method definitions
  * 14.2.2. Property value shorthands
  * 14.2.3. Computed property keys
* 14.3. New methods of Object
  * 14.3.1. Object.assign(target, source_1, source_2, ···)
  * 14.3.2. Object.getOwnPropertySymbols(obj)
  * 14.3.3. Object.is(value1, value2)
  * 14.3.4. Object.setPrototypeOf(obj, proto)
* 14.4. Traversing properties in ES6
  * 14.4.1. Five operations that traverse properties
  * 14.4.2. Traversal order of properties
* 14.5. Assigning versus defining properties
  * 14.5.1. Overriding inherited read-only properties
* 14.6. __proto__ in ECMAScript 6
  * 14.6.1. __proto__ prior to ECMAScript 6
  * 14.6.2. The two kinds of __proto__ in ECMAScript 6
  * 14.6.3. Avoiding the magic of __proto__
  * 14.6.4. Detecting support for ES6-style __proto__
  * 14.6.5. __proto__ is pronounced “dunder proto”
  * 14.6.6. Recommendations for __proto__
* 14.7. Enumerability in ECMAScript 6
  * 14.7.1. Property attributes
  * 14.7.2. Constructs affected by enumerability
  * 14.7.3. Use cases for enumerability
  * 14.7.4. Naming inconsistencies
  * 14.7.5. Looking ahead
* 14.8. Customizing basic language operations via well-known symbols
  * 14.8.1. Property key Symbol.hasInstance (method)
  * 14.8.2. Property key Symbol.toPrimitive (method)
  * 14.8.3. Property key Symbol.toStringTag (string)
  * 14.8.4. Property key Symbol.unscopables (Object)
* 14.9. FAQ: object literals
  * 14.9.1. Can I use super in object literals?

---

### 14.1 Overview

### 14.1.1 New object literal features

Method definitions:

方法定义

      const obj = {
          myMethod(x, y) {
              ···
          }
      };

Property value shorthands:

      const first = 'Jane';
      const last = 'Doe';

      const obj = { first, last };

      // Same as:
      const obj = { first: first, last: last };

Computed property keys:

      const propKey = 'foo';
      const obj = {
          [propKey]: true,
          ['b'+'ar']: 123
      };

This new syntax can also be used for method definitions:

        const obj = {
            ['h'+'ello']() {
                return 'hi';
            }
        };
        console.log(obj.hello()); // hi

The main use case for computed property keys is to make it easy to use symbols as property keys.

对象计算属性主要为了symbols作为属性名字

### 14.1.2 New methods in Object

The most important new method of **Object is assign()**.

Traditionally, this functionality was called extend() in the JavaScript world.

In contrast to how this classic operation works, Object.assign() only considers own (non-inherited) properties.

          const obj = { foo: 123 };
          Object.assign(obj, { bar: true });
          console.log(JSON.stringify(obj));
          // {"foo":123,"bar":true}

Object.assign(target, ...sources)

Object.assign() 方法用于将所有可枚举的属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。

### 14.2 New features of object literals

### 14.2.1 Method definitions

In ECMAScript 5, methods are properties whose values are functions:

          var obj = {
              myMethod: function (x, y) {
                  ···
              }
          };

In ECMAScript 6, methods are still function-valued properties, but there is now a more compact way of defining them:

        const obj = {
            myMethod(x, y) {
                ···
            }
        };

Getters and setters continue to work as they did in ECMAScript 5 (note how syntactically similar they are to method definitions):

        const obj = {
            get foo() {
                console.log('GET foo');
                return 123;
            },
            set bar(value) {
                console.log('SET bar to '+value);
                // return value is ignored
            }
        };
        Let’s use obj:

        > obj.foo
        GET foo
        123
        > obj.bar = true
        SET bar to true
        true


There is also a way to concisely define properties whose values are generator functions:

        const obj = {
            * myGeneratorMethod() {
                ···
            }
        };

        This code is equivalent to:

        const obj = {
            myGeneratorMethod: function* () {
                ···
            }
        };


### 14.2.2 Property value shorthands

Property value shorthands let you abbreviate the definition of a property in an object literal: If the name of the variable that specifies the property value is also the property key then you can omit the key. This looks as follows.

        const x = 4;
        const y = 1;
        const obj = { x, y };

The last line is equivalent to:

        const obj = { x: x, y: y };

Property value shorthands work well together with destructuring:

        const obj = { x: 4, y: 1 };
        const {x,y} = obj;
        console.log(x); // 4
        console.log(y); // 1

One use case for property value shorthands are multiple return values (which are explained in the chapter on destructuring).

### 14.2.3 Computed property keys

Remember that there are two ways of specifying a key when you set a property.

1. Via a fixed name: obj.foo = true;
2. Via an expression: obj['b'+'ar'] = 123;

In object literals, you only have option #1 in ECMAScript 5. ECMAScript 6 additionally provides option #2:

        const propKey = 'foo';
        const obj = {
            [propKey]: true,
            ['b'+'ar']: 123
        };

This new syntax can also be used for method definitions:

        const obj = {
            ['h'+'ello']() {
                return 'hi';
            }
        };
        console.log(obj.hello()); // hi

The main use case for computed property keys are symbols: you can define a public symbol and use it as a special property key that is always unique. One prominent example is the symbol stored in Symbol.iterator.

If an object has a method with that key, it becomes iterable: The method must return an iterator, which is used by constructs such as the for-of loop to iterate over the object. The following code demonstrates how that works.

        const obj = {
            * [Symbol.iterator]() { // (A)
                yield 'hello';
                yield 'world';
            }
        };

        for (const x of obj) {
            console.log(x);
        }
        // Output:
        // hello
        // world

Line A starts a generator method definition with a computed key (the symbol stored in Symbol.iterator).


### 14.3 New methods of Object

### 14.3.1 Object.assign(target, source_1, source_2, ···)

This method merges the sources into the target: It modifies target, first copies all enumerable own (non-inherited) properties of source_1 into it, then all own properties of source_2, etc. At the end, it returns the target.

        const obj = { foo: 123 };
        Object.assign(obj, { bar: true });
        console.log(JSON.stringify(obj));
            // {"foo":123,"bar":true}


Let’s look more closely at how Object.assign() works:

Both kinds of property keys: Object.assign() is aware of both strings and symbols as property keys.
Only enumerable own properties: Object.assign() ignores inherited properties and properties that are not enumerable.

Reading a value from a source: normal “get” operation (const value = source[propKey]). That means that if the source has a getter whose key is propKey then it will be invoked. All properties created by Object.assign() are data properties, it won’t transfer getters to the target.

Writing a value to the target: normal “set” operation (target[propKey] = value). That means that if the target has a setter whose key is propKey then it will be invoked with value.

This is how you’d copy all properties (not just enumerable ones), while correctly transferring getters and setters, without invoking setters on the target:

      function copyAllProperties(target, ...sources) {
          for (const source of sources) {
              for (const key of Reflect.ownKeys(source)) {
                  const desc = Object.getOwnPropertyDescriptor(source, key);
                  Object.defineProperty(target, key, desc);
              }
          }
          return target;
      }


### 14.3.1.1 Caveat: Object.assign() doesn’t work well for moving methods

On one hand, you can’t move a method that uses super: Such a method has the internal slot [[HomeObject]] that ties it to the object it was created in. If you move it via Object.assign(), it will continue to refer to the super-properties of the original object. Details are explained in a section in the chapter on classes.


On the other hand, enumerability is wrong if you move methods created by an object literal into the prototype of a class. The former methods are all enumerable (otherwise Object.assign() wouldn’t see them, anyway), but the prototype only has non-enumerable methods by default.

### 14.3.1.2 Use cases for Object.assign()

Let’s look at a few use cases.

### 14.3.1.2.1 Adding properties to this

You can use Object.assign() to add properties to this in a constructor:

          class Point {
              constructor(x, y) {
                  Object.assign(this, {x, y});
              }
          }

### 14.3.1.2.2 Providing default values for object properties

Object.assign() is also useful for filling in defaults for missing properties. In the following example, we have an object DEFAULTS with default values for properties and an object options with data.

          const DEFAULTS = {
              logLevel: 0,
              outputFormat: 'html'
          };

          function processContent(options) {
              options = Object.assign({}, DEFAULTS, options); // (A)
              ···
          }

In line A, we created a fresh object, copied the defaults into it and then copied options into it, overriding the defaults. Object.assign() returns the result of these operations, which we assign to options.

### 14.3.1.2.3 Adding methods to objects

Another use case is adding methods to objects:

          Object.assign(SomeClass.prototype, {
              someMethod(arg1, arg2) {
                  ···
              },
              anotherMethod() {
                  ···
              }
          });

You could also manually assign functions, but then you don’t have the nice method definition syntax and need to mention SomeClass.prototype each time:

          SomeClass.prototype.someMethod = function (arg1, arg2) {
              ···
          };
          SomeClass.prototype.anotherMethod = function () {
              ···
          };

### 14.3.1.2.4 Cloning objects

One last use case for Object.assign() is a quick way of cloning objects:

          function clone(orig) {
              return Object.assign({}, orig);
          }

This way of cloning is also somewhat dirty, because it doesn’t preserve the property attributes of orig. If that is what you need, you have to use property descriptors.

If you want the clone to have the same prototype as the original, you can use Object.getPrototypeOf() and Object.create():

          function clone(orig) {
              const origProto = Object.getPrototypeOf(orig);
              return Object.assign(Object.create(origProto), orig);
          }

### 14.3.2 Object.getOwnPropertySymbols(obj)

Object.getOwnPropertySymbols(obj) retrieves all own (non-inherited) symbol-valued property keys of obj.

It complements **Object.getOwnPropertyNames()**, which retrieves all string-valued own property keys. Consult a later section for more details on traversing properties.


### 14.3.3 Object.is(value1, value2)

The strict equals operator (===) treats two values differently than one might expect.

绝对等于

First, NaN is not equal to itself.

首先 NaN 不等于自己

        > NaN === NaN
        false

That is unfortunate, because it often prevents us from detecting NaN:

这也是不能检查NaN的原因

          > [0,NaN,2].indexOf(NaN)
          -1

Second, JavaScript has two zeros, but strict equals treats them as if they were the same value:

JavaScript有两个零 -0 +0 但是绝对相等对于这两个值是相等的

          > -0 === +0
          true

Doing this is normally a good thing.

Object.is() provides a way of comparing values that is a bit more precise than ===. It works as follows:

Object.is()与===简洁版 只有下面两个是不同

          > Object.is(NaN, NaN)
          true

          > Object.is(-0, +0)
          false


Everything else is compared as with ===.

其他与===相同的

### 14.3.3.1 Using Object.is() to find Array elements
### Object.is()发现数组元素

If we combine Object.is() with the new ES6 Array method findIndex(), we can find NaN in Arrays:

Object.is()与数组的findIndex()的方法 可以发现数组中NaN元素

          function myIndexOf(arr, elem) {

              return arr.findIndex(x => Object.is(x, elem));
          }

          myIndexOf([0,NaN,2], NaN); // 1

In contrast, indexOf() does not handle NaN well:

相反 indexOf()不能好的处理

          > [0,NaN,2].indexOf(NaN)
          -1


### 14.3.4 Object.setPrototypeOf(obj, proto)

This method sets the prototype of obj to proto.

设置对象的原型

The non-standard way of doing so in ECMAScript 5, that is supported by many engines, is via assigning to the special property __proto__.

在ECMAScript 5有非标准方法通过设置__proto__属性来完成

The recommended way of setting the prototype remains the same as in ECMAScript 5: during the creation of an object, via Object.create().

ECMAScript 5通过设置Object.create()原型

That will always be faster than first creating an object and then setting its prototype. Obviously, it doesn’t work if you want to change the prototype of an existing object.

这是更快创建一个对象并同时设置原型 如果你想改变已经存在的对象的原型就可以不进行设置

        Object.create(proto[, propertiesObject])


### 14.4 Traversing properties in ES6
### ES6的遍历属性

### 14.4.1 Five operations that traverse properties
### 5种遍历属性方法

In ECMAScript 6, the key of a property can be either a string or a symbol. The following are five operations that traverse the property keys of an object obj:

ECMAScript 6的属性名字可以是字符串或symbol. 下面5种遍历对象的属性名字操作

1. Object.keys(obj) : Array<string>

  Object.keys(obj) 返回字符串数组

retrieves all string keys of all enumerable own (non-inherited) properties.

返回可枚举非继承字符串属性名

2. Object.getOwnPropertyNames(obj) : Array<string>

  Object.getOwnPropertyNames(obj) 返回字符串数组

retrieves all string keys of all own properties.

遍历所有自己的字符串属性名字

3. Object.getOwnPropertySymbols(obj) : Array<symbol>

  Object.getOwnPropertySymbols 返回symbol数组

retrieves all symbol keys of all own properties.

返回自己的symbol的属性

4. Reflect.ownKeys(obj) : Array<string|symbol>

  返回对象的字符串或symbol的属性名字

retrieves all keys of all own properties.

返回对象所有属性名字

5. for (const key in obj)

retrieves all string keys of all enumerable properties (inherited and own).

返回所有可枚举的无论继承还是自己的字符串属性名字

### 14.4.2 Traversal order of properties

ES6 defines two traversal orders for properties.

ES6定义两种遍历属性的次序

**Own Property Keys**:
**自己属性名字**

* Retrieves the keys of all own properties of an object, in the following order:
* 遍历一个对象所有属性的下面步骤

  * First, the string keys that are integer indices (what these are is explained in the next section), in ascending numeric order.

  * 首先 字符串名字如果是数字索引是按照数字升序

  * Then all other string keys, in the order in which they were added to the object.

  * 然后再是字符串属性

  * Lastly, all symbol keys, in the order in which they were added to the object.

  * 最后是symbol属性

* Used by: Object.assign(), Object.defineProperties(), Object.getOwnPropertyNames(), Object.getOwnPropertySymbols(), Reflect.ownKeys()

* 通过Object.assign(), Object.defineProperties(), Object.getOwnPropertyNames(), Object.getOwnPropertySymbols(), Reflect.ownKeys() 这些方法来实现

**Enumerable Own Names:**
**自己枚举属性名**

* Retrieves the string keys of all enumerable own properties of an object. The order is not defined by ES6, but it must be the same order in which for-in traverses properties.

* 遍历所有枚举字符串属性这个在ES6没有定义 必须通过for-in遍历

* Used by: JSON.parse(), JSON.stringify(), Object.keys()


The order in which for-in traverses properties is not defined. [Quoting Allen Wirfs-Brock](https://mail.mozilla.org/pipermail/es-discuss/2015-August/043998.html):

Historically, the for-in order was not defined and there has been variation among browser implementations in the order they produce (and other specifics).

在历史for-in没有定义 客户端也没有实现这个遍历结果

ES5 added Object.keys and the requirement that it should order the keys identically to for-in.

ES5添加Object.keys方法 并且要为了替换带for-in

During development of both ES5 and ES6, the possibility of defining a specific for-in order was considered but not adopted because of web legacy compatibility concerns and uncertainty about the willingness of browsers to make changes in the ordering they currently produce.

### 14.4.2.1 Integer indices
### 数字索引

Many engines treat integer indices specially, even though they are still strings (at least as far as the ES6 spec is concerned). Therefore, it makes sense to treat them as a separate category of keys.

很多解析器对待数字索引很特别 尽管依然是字符串到ES6为止依然这么认为  

Roughly, an integer index is a string that, if converted to a 53-bit non-negative integer and back is the same value. Therefore:

  * '10' and '2' are integer indices. 整数索引
  * '02' is not an integer index. Converting it to an integer and back results in the different string '2'. 02不是索引
  * '3.141' is not an integer index, because 3.141 is not an integer. '3.141'不是数字索引 因为'3.141'不是整数

In ES6, instances of String and Typed Arrays have integer indices. The indices of normal Arrays are a subset of integer indices: they have a smaller range of 32 bits. For more information on [Array indices](http://speakingjs.com/es5/ch18.html#_array_indices_in_detail), consult “Array Indices in Detail” in “Speaking JavaScript”.

在ES6中字符串和Typed Arrays也有整数索引 数组的索引是一系列整数 范围小于32位

Integer indices have a 53-bit range, because thats the largest range of integers that JavaScript can handle. For details, see Sect. [“Safe integers”.](http://exploringjs.com/es6/ch_numbers.html#sec_safe-integers)

### 14.4.2.2 Example

The following code demonstrates the traversal order “Own Property Keys”:

        const obj = {
            [Symbol('first')]: true,
            '02': true,
            '10': true,
            '01': true,
            '2': true,
            [Symbol('second')]: true,
        };

        Reflect.ownKeys(obj);
            // [ '2', '10', '02', '01',
            //   Symbol('first'), Symbol('second') ]

Explanation:

'2' and '10' are integer indices, come first and are sorted numerically (not in the order in which they were added).

整数索引首先出现并且按照数字大小排序

'02' and '01' are normal string keys, come next and appear in the order in which they were added to obj.

接着是字符串属性

Symbol('first') and Symbol('second') are symbols and come last, in the order in which they were added to obj.

Symbol属性最后出现


### 14.4.2.3 Why does the spec standardize in which order property keys are returned?
### 属性返回的标准的原因

[Answer by Tab Atkins Jr.:](https://esdiscuss.org/topic/nailing-object-property-order)

Because, for objects at least, all implementations used approximately the same order (matching the current spec), and lots of code was inadvertently written that depended on that ordering, and would break if you enumerated it in a different order. Since browsers have to implement this particular ordering to be web-compatible, it was specced as a requirement.

There was some discussion about breaking from this in Maps/Sets, but doing so would require us to specify an order that is impossible for code to depend on; in other words, we’d have to mandate that the ordering be random, not just unspecified. This was deemed too much effort, and creation-order is reasonable valuable (see OrderedDict in Python, for example), so it was decided to have Maps and Sets match Objects.

### 14.4.2.4 The order of properties in the spec

The following parts of the spec are relevant for this section:

* The section on Array exotic objects has a note on what Array indices are.

* The internal method [[OwnPropertyKeys]] is used by Reflect.ownKeys() and others.

* 返回对象的自己属性名通过用Reflect.ownKeys()

* The operation EnumerableOwnNames is used by Object.keys() and others.

* 返回对象的自己枚举属性名通过用Object.keys()

* The internal method [[Enumerate]] is used by for-in.

* 内部方法可枚举的通过for-in

### 14.5 Assigning versus defining properties
### 分配与定义属性

There are two similar ways of adding a property prop to an object obj:

        Assigning: obj.prop = 123
        Defining: Object.defineProperty(obj, 'prop', 123)

There are three cases in which assigning does not create an own property prop, even if it doesn’t exist, yet:

* A read-only property prop exists in the prototype chain. Then the assignment causes a TypeError in strict mode.

原型链中的只读属性 在严格模式赋值就会引起TypeError

* A setter for prop exists in the prototype chain. Then that setter is called.

原型链中的setter属性 这样就可以调用

* A getter for prop without a setter exists in the prototype chain. Then a TypeError is thrown in strict mode. This case is similar to the first one.

如果getter属性但没有setter 在严格模式会引起TypeError

None of these cases prevent Object.defineProperty() from creating an own property. The next section looks at case #3 in more detail.

Object.defineProperty()不受上面的限制来定义一个自有属性

### 14.5.1 Overriding inherited read-only properties
### 重写继承的只读属性

If an object obj inherits a property prop that is read-only then you can’t assign to that property:

        const proto = Object.defineProperty({}, 'prop', {
            writable: false,
            configurable: true,
            value: 123,
        });

        const obj = Object.create(proto);

        obj.prop = 456;
        // TypeError: Cannot assign to read-only property


This is similar to how an inherited property works that has a getter, but no setter. It is in line with viewing assignment as changing the value of an inherited property. It does so non-destructively: the original is not modified, but overridden by a newly created own property. Therefore, an inherited read-only property and an inherited setter-less property both prevent changes via assignment. You can, however, force the creation of an own property by defining a property:

const proto = Object.defineProperty({}, 'prop', {
    writable: false,
    configurable: true,
    value: 123,
});
const obj = Object.create(proto);
Object.defineProperty(obj, 'prop', {value: 456});
console.log(obj.prop); // 456

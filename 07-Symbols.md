### 7. Symbols
---

* 7.1. Overview
  * 7.1.1. Use case 1: unique property keys
  * 7.1.2. Use case 2: constants representing concepts
  * 7.1.3. Pitfall: you can’t coerce symbols to strings
  * 7.1.4. Which operations related to property keys are aware of symbols?
* 7.2. A new primitive type
  * 7.2.1. Symbols as property keys
  * 7.2.2. Enumerating own property keys
* 7.3. Using symbols to represent concepts
* 7.4. Symbols as keys of properties
  * 7.4.1. Symbols as keys of non-public properties
  * 7.4.2. Symbols as keys of meta-level properties
  * 7.4.3. Examples of name clashes in JavaScript’s standard library
* 7.5. Converting symbols to other primitive types
  * 7.5.1. Pitfall: coercion to string
  * 7.5.2. Making sense of the coercion rules
  * 7.5.3. Explicit and implicit conversion in the spec
* 7.6. Wrapper objects for symbols
  * 7.6.1. Accessing properties via [ ] and wrapped keys
* 7.7. Crossing realms with symbols
* 7.8. FAQ: symbols
  * 7.8.1. Can I use symbols to define private properties?
  * 7.8.2. Are symbols primitives or objects?
  * 7.8.3. Do we really need symbols? Aren’t strings enough?
  * 7.8.4. Are JavaScript’s symbols like Ruby’s symbols?
* 7.9. The spelling of well-known symbols: why Symbol.iterator and not Symbol.ITERATOR (etc.)?
* 7.10. The symbol API
  * 7.10.1. The function Symbol
  * 7.10.2. Methods of symbols
  * 7.10.3. Converting symbols to other values
  * 7.10.4. Well-known symbols
  * 7.10.5. Global symbol registry

---

### 7.1 Overview

Symbols are a new primitive type in ECMAScript 6. They are created via a factory function:

Symbols是ES6新的字面量类型 Symbols是创建通过工厂函数

        const mySymbol = Symbol('mySymbol');

Every time you call the factory function, a new and unique symbol is created. The optional parameter is a descriptive string that is shown when printing the symbol (it has no other purpose):

每一次调用工厂函数就会创建一个唯一的symbol 在创建symbol的工厂函数可以加一个字符串描述 在输出symbol的就会输出字符串

        > mySymbol
        Symbol(mySymbol)

### 7.1.1 Use case 1: unique property keys

Symbols are mainly used as unique property keys – a symbol never clashes with any other property key (symbol or string). For example, you can make an object iterable (usable via the for-of loop and other language mechanisms), by using the symbol stored in Symbol.iterator as the key of a method

Symbols是被用来描述一个唯一属性key 永远不会其他Symbols或者字符串属性重复

举个例子 如果对象可以遍历通过for-of 用Symbols存储Symbol.iterator作为这个方法的key


        const iterableObject = {
            [Symbol.iterator]() { // (A)
                ···
            }
        }
        for (const x of iterableObject) {
            console.log(x);
        }
        // Output:
        // hello
        // world

In line A, a symbol is used as the key of the method. This unique marker makes the object iterable and enables us to use the for-of loop.

### 7.1.2 Use case 2: constants representing concepts

In ECMAScript 5, you may have used strings to represent concepts such as colors. In ES6, you can use symbols and be sure that they are always unique:

        const COLOR_RED    = Symbol('Red');
        const COLOR_ORANGE = Symbol('Orange');
        const COLOR_YELLOW = Symbol('Yellow');
        const COLOR_GREEN  = Symbol('Green');
        const COLOR_BLUE   = Symbol('Blue');
        const COLOR_VIOLET = Symbol('Violet');

        function getComplement(color) {
            switch (color) {
                case COLOR_RED:
                    return COLOR_GREEN;
                case COLOR_ORANGE:
                    return COLOR_BLUE;
                case COLOR_YELLOW:
                    return COLOR_VIOLET;
                case COLOR_GREEN:
                    return COLOR_RED;
                case COLOR_BLUE:
                    return COLOR_ORANGE;
                case COLOR_VIOLET:
                    return COLOR_YELLOW;
                default:
                    throw new Exception('Unknown color: '+color);
            }
        }

Every time you call Symbol('Red'), a new symbol is created. Therefore, COLOR_RED can never be mistaken for another value. That would be different if it were the string 'Red'.

### 7.1.3 Pitfall: you can’t coerce symbols to strings
### 易犯错误: 不能将symbols转为字符串

Coercing (implicitly converting) symbols to strings throws exceptions:

symbols转为字符串会抛出错误TypeError

        const sym = Symbol('desc');

        const str1 = '' + sym; // TypeError
        const str2 = `${sym}`; // TypeError

The only solution is to convert explicitly:

仅有一个显式的转换为的方法

        const str2 = String(sym); // 'Symbol(desc)'
        const str3 = sym.toString(); // 'Symbol(desc)'

Forbidding coercion prevents some errors, but also makes working with symbols more complicated.

### 7.1.4 Which operations related to property keys are aware of symbols?

The following operations are aware of symbols as property keys:

下面的操作将认为symbols属性关键字是属性


        Reflect.ownKeys()
        Property access via []
        Object.assign()

The following operations ignore symbols as property keys:

下面的操作将忽略symbols属性关键字

        Object.keys()
        Object.getOwnPropertyNames()
        for-in loop


### 7.2 A new primitive type

ECMAScript 6 introduces a new primitive type: symbols. They are tokens that serve as unique IDs. You create symbols via the factory function Symbol() (which is loosely similar to String returning strings if called as a function):

symbols生成唯一ID

          const symbol1 = Symbol();

Symbol() has an optional string-valued parameter that lets you give the newly created Symbol a description. That description is used when the symbol is converted to a string (via toString() or String()):

Symbol()有字符串参数 可以创建Symbol()的字符串描述 这个描述通常用来通过toString()的方法或String()

          > const symbol2 = Symbol('symbol2');
          > String(symbol2)
          'Symbol(symbol2)'


Every symbol returned by Symbol() is unique, every symbol has its own identity:

每一个symbol生成唯一个ID

          > Symbol() === Symbol()
          false


You can see that symbols are primitive if you apply the typeof operator to one of them – it will return a new symbol-specific result:

        > typeof Symbol()
        'symbol'

### 7.2.1 Symbols as property keys

Symbols can be used as property keys:

        const MY_KEY = Symbol();
        const obj = {};

        obj[MY_KEY] = 123;
        console.log(obj[MY_KEY]); // 123


Classes and object literals have a feature called computed property keys: You can specify the key of a property via an expression, by putting it in square brackets. In the following object literal, we use a computed property key to make the value of MY_KEY the key of a property.

可以方括号使用symbol

        const MY_KEY = Symbol();
        const obj = {
            [MY_KEY]: 123
        };


A method definition can also have a computed key:

        const FOO = Symbol();
        const obj = {
            [FOO]() {
                return 'bar';
            }
        };
        console.log(obj[FOO]()); // bar


### 7.2.2 Enumerating own property keys

Given that there is now a new kind of value that can become the key of a property, the following terminology is used for ECMAScript 6:

* Property keys are either strings or symbols.

* 属性可以字符串或symbols

* String-valued property keys are called property names.

* 字符串值属性名可以调用

* Symbol-valued property keys are called property symbols.

* Symbol值属性名可以调用

Let’s examine the APIs for enumerating own property keys by first creating an object.

            const obj = {
                [Symbol('my_key')]: 1,
                enum: 2,
                nonEnum: 3
            };

* Object.defineProperty(obj,'nonEnum', { enumerable: false });
* 定义一个属性 添加的对象  属性名 属性配置对象{}

* Object.getOwnPropertyNames()  
* 只返回字符串属性 忽略symbol-valued属性名 ignores symbol-valued property keys:

            > Object.getOwnPropertyNames(obj)
            ['enum', 'nonEnum']

* Object.getOwnPropertySymbols() ignores string-valued property keys:
* Object.getOwnPropertySymbols() 只返回symbol名字的属性

            > Object.getOwnPropertySymbols(obj)
            [Symbol(my_key)]

* Reflect.ownKeys() considers all kinds of keys:
* Reflect.ownKeys()返回 字符串 symbol为名所有属性

            > Reflect.ownKeys(obj)
            [Symbol(my_key), 'enum', 'nonEnum']

* Object.keys() only considers enumerable property keys that are strings:
* Object.keys()返回可枚举的字符串属性

            > Object.keys(obj)
            ['enum']


The name Object.keys clashes with the new terminology (only string keys are listed). Object.names or Object.getEnumerableOwnPropertyNames would be a better choice now.



### 7.3 Using symbols to represent concepts

In ECMAScript 5, one often represents concepts (think enum constants) via strings. For example:

          var COLOR_RED    = 'Red';
          var COLOR_ORANGE = 'Orange';
          var COLOR_YELLOW = 'Yellow';
          var COLOR_GREEN  = 'Green';
          var COLOR_BLUE   = 'Blue';
          var COLOR_VIOLET = 'Violet';

However, strings are not as unique as we’d like them to be. To see why, let’s look at the following function.

        function getComplement(color) {
            switch (color) {
                case COLOR_RED:
                    return COLOR_GREEN;
                case COLOR_ORANGE:
                    return COLOR_BLUE;
                case COLOR_YELLOW:
                    return COLOR_VIOLET;
                case COLOR_GREEN:
                    return COLOR_RED;
                case COLOR_BLUE:
                    return COLOR_ORANGE;
                case COLOR_VIOLET:
                    return COLOR_YELLOW;
                default:
                    throw new Exception('Unknown color: '+color);
            }
        }

It is noteworthy that you can use arbitrary expressions as switch cases, you are not limited in any way. For example:

        function isThree(x) {
            switch (x) {
                case 1 + 1 + 1:
                    return true;
                default:
                    return false;
            }
        }

We use the flexibility that switch offers us and refer to the colors via our constants (COLOR_RED etc.) instead of hard-coding them ('RED' etc.).

Interestingly, even though we do so, there can still be mix-ups. For example, someone may define a constant for a mood:

        var MOOD_BLUE = 'BLUE';

Now the value of BLUE is not unique anymore and MOOD_BLUE can be mistaken for it. If you use it as a parameter for getComplement(), it returns 'ORANGE' where it should throw an exception.

Let’s use symbols to fix this example. Now we can also use the ES6 feature const, which lets us declare actual constants (you can’t change what value is bound to a constant, but the value itself may be mutable).

        const COLOR_RED    = Symbol('Red');
        const COLOR_ORANGE = Symbol('Orange');
        const COLOR_YELLOW = Symbol('Yellow');
        const COLOR_GREEN  = Symbol('Green');
        const COLOR_BLUE   = Symbol('Blue');
        const COLOR_VIOLET = Symbol('Violet');

Each value returned by Symbol is unique, which is why no other value can be mistaken for BLUE now. Intriguingly, the code of getComplement() doesn’t change at all if we use symbols instead of strings, which shows how similar they are.

### 7.4 Symbols as keys of properties

Being able to create properties whose keys never clash with other keys is useful in two situations:

用symbols做为属性两种情况:

* For non-public properties in inheritance hierarchies.

* 对继承的非公开属性

* To keep meta-level properties from clashing with base-level properties.

* 防止meta-level属性与基本属性的冲突


### 7.4.1 Symbols as keys of non-public properties
### Symbols用来创建私有属性

Whenever there are inheritance hierarchies in JavaScript (e.g. created via classes, mixins or a purely prototypal approach), you have two kinds of properties:

Public properties are seen by clients of the code.

Private properties are used internally within the pieces (e.g. classes, mixins or objects) that make up the inheritance hierarchy. (Protected properties are shared between several pieces and face the same issues as private properties.)

For usability’s sake, public properties usually have string keys. But for private properties with string keys, accidental name clashes can become a problem. Therefore, symbols are a good choice. For example, in the following code, symbols are used for the private properties _counter and _action.

          const _counter = Symbol('counter');
          const _action = Symbol('action');
          class Countdown {
              constructor(counter, action) {
                  this[_counter] = counter;
                  this[_action] = action;
              }
              dec() {
                  let counter = this[_counter];
                  if (counter < 1) return;
                  counter--;
                  this[_counter] = counter;
                  if (counter === 0) {
                      this[_action]();
                  }
              }
          }


Note that symbols only protect you from name clashes, not from unauthorized access, because you can find out all own property keys – including symbols – of an object via Reflect.ownKeys(). If you want protection there, as well, you can use one of the approaches listed in Sect

### 7.4.2 Symbols as keys of meta-level properties

Symbols having unique identities makes them ideal as keys of public properties that exist on a different level than “normal” property keys, because meta-level keys and normal keys must not clash. One example of meta-level properties are methods that objects can implement to customize how they are treated by a library. Using symbol keys protects the library from mistaking normal methods as customization methods.

ES6 Iterability is one such customization. An object is iterable if it has a method whose key is the symbol (stored in) Symbol.iterator. In the following code, obj is iterable.

        const obj = {
            data: [ 'hello', 'world' ],
            [Symbol.iterator]() {
                ···
            }
        };

The iterability of obj enables you to use the for-of loop and similar JavaScript features:

        for (const x of obj) {
            console.log(x);
        }

        // Output:
        // hello
        // world

### 7.4.3 Examples of name clashes in JavaScript’s standard library

In case you think that name clashes don’t matter, here are three examples of where name clashes caused problems in the evolution of the JavaScript standard library:

* When the new method Array.prototype.values() was created, it broke existing code where with was used with an Array and shadowed a variable values in an outer scope (bug report 1, bug report 2). Therefore, a mechanism was introduced to hide properties from with (Symbol.unscopables).

* Array.prototype.values()

* String.prototype.contains clashed with a method added by MooTools and had to be renamed to String.prototype.includes (bug report).

* String.prototype.includes


* The ES2016 method Array.prototype.contains also clashed with a method added by MooTools and had to be renamed to Array.prototype.includes (bug report).

* Array.prototype.includes

In contrast, adding iterability to an object via the property key Symbol.iterator can’t cause problems, because that key doesn’t clash with anything.


### 7.5 Converting symbols to other primitive types

The following table shows what happens if you explicitly or implicitly convert symbols to other primitive types:

| Conversion to 转换方法     | 	Explicit conversion 显式转换    | 	Coercion (implicit conversion) 隐式转换 强制转换    |
| :------------- | :------------- |:------------- |
| boolean       | 	Boolean(sym) → OK      |!sym → OK       |
| number      | 	Number(sym) → TypeError       |sym*2 → TypeError     |
| string      | 	String(sym) → OK       |''+sym → TypeError       |
| string      | 	sym.toString() → OK       |	`${sym}` → TypeError      |

布尔 无论显式还是隐式都可以
数字 无论显式还是隐式都不可以
字符串 只有显式转换可以 隐式不可以

### 7.5.1 Pitfall: coercion to string
### 易犯错误 强制转为字符串

Coercion to string being forbidden can easily trip you up:

trip up 挑剔 绊倒

          const sym = Symbol();

          console.log('A symbol: '+sym); // TypeError
          console.log(`A symbol: ${sym}`); // TypeError

To fix these problems, you need an explicit conversion to string:

          console.log('A symbol: '+String(sym)); // OK
          console.log(`A symbol: ${String(sym)}`); // OK

### 7.5.2 Making sense of the coercion rules

Coercion (implicit conversion) is often forbidden for symbols. This section explains why.

### 7.5.2.1 Truthiness checks are allowed

Coercion to boolean is always allowed, mainly to enable truthiness checks in if statements and other locations:

          if (value) { ··· }

          param = param || 0;

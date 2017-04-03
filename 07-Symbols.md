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

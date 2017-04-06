### 15. Classes

---
* 15.1. Overview
* 15.2. The essentials
  * 15.2.1. Base classes
  * 15.2.2. Inside the body of a class definition
  * 15.2.3. Subclassing
* 15.3. Private data for classes
  * 15.3.1. Private data via constructor environments
  * 15.3.2. Private data via a naming convention
  * 15.3.3. Private data via WeakMaps
  * 15.3.4. Private data via symbols
  * 15.3.5. Further reading
* 15.4. Simple mixins
* 15.5. The details of classes
  * 15.5.1. Various checks
  * 15.5.2. Attributes of properties
  * 15.5.3. Classes have inner names
* 15.6. The details of subclassing
  * 15.6.1. Prototype chains
  * 15.6.2. Allocating and initializing instances
  * 15.6.3. Why can’t you subclass built-in constructors in ES5?
  * 15.6.4. Referring to superproperties in methods
* 15.7. The species pattern
  * 15.7.1. Helper methods for examples
  * 15.7.2. The standard species pattern
  * 15.7.3. The species pattern for Arrays
  * 15.7.4. The species pattern in static methods
  * 15.7.5. Overriding the default species in subclasses
* 15.8. The pros and cons of classes
  * 15.8.1. Complaint: ES6 classes obscure the true nature of JavaScript inheritance
  * 15.8.2. Complaint: Classes provide only single inheritance
  * 15.8.3. Complaint: Classes lock you in, due to mandatory new
* 15.9. FAQ: classes
  * 15.9.1. Why can’t classes be function-called?
  * 15.9.2. How do I instantiate a class, given an Array of arguments?
* 15.10. What is next for classes?
* 15.11. Further reading

---

### 15.1 Overview

A class and a subclass:

          class Point {
              constructor(x, y) {
                  this.x = x;
                  this.y = y;
              }
              toString() {
                  return `(${this.x}, ${this.y})`;
              }
          }

          class ColorPoint extends Point {
              constructor(x, y, color) {
                  super(x, y);
                  this.color = color;
              }
              toString() {
                  return super.toString() + ' in ' + this.color;
              }
          }

Using the classes:

        > const cp = new ColorPoint(25, 8, 'green');

        > cp.toString();
        '(25, 8) in green'

        > cp instanceof ColorPoint
        true
        > cp instanceof Point
        true


Under the hood, ES6 classes are not something that is radically new: They mainly provide more convenient syntax to create old-school constructor functions. You can see that if you use typeof:

        > typeof Point
        'function'

### 15.2 The essentials

### 15.2.1 Base classes

A class is defined like this in ECMAScript 6:

          class Point {
              constructor(x, y) {
                  this.x = x;
                  this.y = y;
              }
              toString() {
                  return `(${this.x}, ${this.y})`;
              }
          }

You use this class just like an ES5 constructor function:

          > var p = new Point(25, 8);
          > p.toString()
          '(25, 8)'

In fact, the result of a class definition is a function:

          > typeof Point
          'function'

However, you can only invoke a class via new, not via a function call (the rationale behind this is explained later):

        > Point()
        TypeError: Classes can’t be function-called

In the spec, function-calling classes is prevented in the internal method [[Call]] of function objects.

### 15.2.1.1 No separators between members of class definitions

There is no separating punctuation between the members of a class definition.

For example, the members of an object literal are separated by commas, which are illegal at the top levels of class definitions. Semicolons are allowed, but ignored:

class MyClass {
    foo() {}
    ; // OK, ignored
    , // SyntaxError
    bar() {}
}
Semicolons are allowed in preparation for future syntax which may include semicolon-terminated members. Commas are forbidden to emphasize that class definitions are different from object literals.

不能使用逗号 分号可以但是省略

###15.2.1.2 Class declarations are not hoisted
### 类声明不会预解析

Function declarations are hoisted: When entering a scope, the functions that are declared in it are immediately available – independently of where the declarations happen. That means that you can call a function that is declared later:

          foo(); // works, because `foo` is hoisted

          function foo() {}

In contrast, class declarations are not hoisted. Therefore, a class only exists after execution reached its definition and it was evaluated. Accessing it beforehand leads to a ReferenceError:

          new Foo(); // ReferenceError

          class Foo {}

The reason for this limitation is that classes can have an extends clause whose value is an arbitrary expression. That expression must be evaluated in the proper “location”, its evaluation can’t be hoisted.

Not having hoisting is less limiting than you may think.

For example, a function that comes before a class declaration can still refer to that class, but you have to wait until the class declaration has been evaluated before you can call the function.

          function functionThatUsesBar() {
              new Bar();
          }

          functionThatUsesBar(); // ReferenceError

          class Bar {}
          functionThatUsesBar(); // OK

### 15.2.1.3 Class expressions
### 类表达式

Similarly to functions, there are two kinds of class definitions, two ways to define a class: class declarations and class expressions.

Similarly to function expressions, class expressions can be anonymous:

              const MyClass = class {
                  ···
              };
              const inst = new MyClass();

Also similarly to function expressions, class expressions can have names that are only visible inside them:

              const MyClass = class Me {
                  getClassName() {
                      return Me.name;
                  }
              };

              const inst = new MyClass();

              console.log(inst.getClassName()); // Me

              console.log(Me.name); // ReferenceError: Me is not defined

The last two lines demonstrate that Me does not become a variable outside of the class, but can be used inside it.

### 15.2.2 Inside the body of a class definition

A class body can only contain methods, but not data properties. Prototypes having data properties is generally considered an anti-pattern, so this just enforces a best practice.

### 15.2.2.1 constructor, static methods, prototype methods

Let’s examine three kinds of methods that you often find in class definitions.

          class Foo {
              constructor(prop) {
                  this.prop = prop;
              }
              static staticMethod() {
                  return 'classy';
              }
              prototypeMethod() {
                  return 'prototypical';
              }
          }
          const foo = new Foo(123);

The object diagram for this class declaration looks as follows. Tip for understanding it: [[Prototype]] is an inheritance relationship between objects, while prototype is a normal property whose value is an object.

The property prototype is only special w.r.t. the new operator using its value as the prototype for instances it creates.

<img src="./classes----methods_150dpi.png" />

**First, the pseudo-method constructor. **

This method is special, as it defines the function that represents the class:

      > Foo === Foo.prototype.constructor
      true
      > typeof Foo
      'function'

It is sometimes called a class constructor. It has features that normal constructor functions don’t have (mainly the ability to constructor-call its superconstructor via super(), which is explained later).

**Second, static methods. **

Static properties (or class properties) are properties of Foo itself. If you prefix a method definition with static, you create a class method:

        > typeof Foo.staticMethod
        'function'
        > Foo.staticMethod()
        'classy'

**Third, prototype methods. **

The prototype properties of Foo are the properties of Foo.prototype. They are usually methods and inherited by instances of Foo.

        > typeof Foo.prototype.prototypeMethod
        'function'
        > foo.prototypeMethod()
        'prototypical'

### 15.2.2.2 Static data properties

For the sake of finishing ES6 classes in time, they were deliberately designed to be “maximally minimal”. That’s why you can currently only create static methods, getters, and setters, but not static data properties. There is a proposal for adding them to the language. Until that proposal is accepted, there are two work-arounds that you can use.

First, you can manually add a static property:

            class Point {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                }
            }

            Point.ZERO = new Point(0, 0);

You could use Object.defineProperty() to create a read-only property, but I like the simplicity of an assignment.

Second, you can create a static getter:

        class Point {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }
            static get ZERO() {
                return new Point(0, 0);
            }
        }

In both cases, you get a property Point.ZERO that you can read. In the first case, the same instance is returned every time. In the second case, a new instance is returned every time.

### 15.2.2.3 Getters and setters

The syntax for getters and setters is just like in ECMAScript 5 object literals:

        class MyClass {
            get prop() {
                return 'getter';
            }
            set prop(value) {
                console.log('setter: '+value);
            }
        }

You use MyClass as follows.

        > const inst = new MyClass();
        > inst.prop = 123;
        setter: 123
        > inst.prop
        'getter'

### 15.2.2.4 Computed method names

You can define the name of a method via an expression, if you put it in square brackets. For example, the following ways of defining Foo are all equivalent.

        class Foo {
            myMethod() {}
        }

        class Foo {
            ['my'+'Method']() {}
        }

        const m = 'myMethod';
        class Foo {
            [m]() {}
        }

Several special methods in ECMAScript 6 have keys that are symbols.

Computed method names allow you to define such methods.

For example, if an object has a method whose key is Symbol.iterator, it is iterable.

That means that its contents can be iterated over by the for-of loop and other language mechanisms.

        class IterableClass {
            [Symbol.iterator]() {
                ···
            }
        }

### 15.2.2.5 Generator methods

If you prefix a method definition with an asterisk (*), it becomes a generator method. Among other things, a generator is useful for defining the method whose key is Symbol.iterator. The following code demonstrates how that works.

        class IterableArguments {
            constructor(...args) {
                this.args = args;
            }
            * [Symbol.iterator]() {
                for (const arg of this.args) {
                    yield arg;
                }
            }
        }

        for (const x of new IterableArguments('hello', 'world')) {
            console.log(x);
        }

        // Output:
        // hello
        // world

### 15.2.3 Subclassing

The extends clause lets you create a subclass of an existing constructor (which may or may not have been defined via a class):

              class Point {
                  constructor(x, y) {
                      this.x = x;
                      this.y = y;
                  }
                  toString() {
                      return `(${this.x}, ${this.y})`;
                  }
              }

              class ColorPoint extends Point {
                  constructor(x, y, color) {
                      super(x, y); // (A)
                      this.color = color;
                  }
                  toString() {
                      return super.toString() + ' in ' + this.color; // (B)
                  }
              }

Again, this class is used like you’d expect:

              > const cp = new ColorPoint(25, 8, 'green');
              > cp.toString()
              '(25, 8) in green'

              > cp instanceof ColorPoint
              true
              > cp instanceof Point
              true

There are two kinds of classes:

* Point is a base class, because it doesn’t have an extends clause.
* ColorPoint is a derived class.

There are two ways of using super:

* A class constructor (the pseudo-method constructor in a class definition) uses it like a function call (super(···)), in order to make a superconstructor call (line A).

* Method definitions (in object literals or classes, with or without static) use it like property references (super.prop) or method calls (super.method(···)), in order to refer to superproperties (line B)



### 15.2.3.1 The prototype of a subclass is the superclass

The prototype of a subclass is the superclass in ECMAScript 6:

          > Object.getPrototypeOf(ColorPoint) === Point
          true

That means that static properties are inherited:

**静态属性/方法也会被继承**

          class Foo {
              static classMethod() {
                  return 'hello';
              }
          }

          class Bar extends Foo {
          }
          Bar.classMethod(); // 'hello'

You can even super-call static methods:

          class Foo {
              static classMethod() {
                  return 'hello';
              }
          }

          class Bar extends Foo {
              static classMethod() {
                  return super.classMethod() + ', too';
              }
          }
          Bar.classMethod(); // 'hello, too'

### 15.2.3.2 Superconstructor calls

In a derived class, you must call super() before you can use this:

在子类中使用this前 必须调用super()

              class Foo {}

              class Bar extends Foo {
                  constructor(num) {
                      const tmp = num * 2; // OK
                      this.num = num; // ReferenceError
                      super();
                      this.num = num; // OK
                  }
              }

Implicitly leaving a derived constructor without calling super() also causes an error:

如果子类中没有调用super() 会抛出ReferenceError

          class Foo {}

          class Bar extends Foo {
              constructor() {
              }
          }

          const bar = new Bar(); // ReferenceError

### 15.2.3.3 Overriding the result of a constructor

Just like in ES5, you can override the result of a constructor by explicitly returning an object:

          class Foo {
              constructor() {
                  return Object.create(null);
              }
          }
          console.log(new Foo() instanceof Foo); // false

If you do so, it doesn’t matter whether this has been initialized or not.

In other words: you don’t have to call super() in a derived constructor if you override the result in this manner.

### 15.2.3.4 Default constructors for classes

If you don’t specify a constructor for a base class, the following definition is used:

        constructor() {}

For derived classes, the following default constructor is used:

        constructor(...args) {
            super(...args);
        }

### 15.2.3.5 Subclassing built-in constructors

In ECMAScript 6, you can finally subclass all built-in constructors (there are work-arounds for ES5, but these have significant limitations).

For example, you can now create your own exception classes (that will inherit the feature of having a stack trace in most engines):

            class MyError extends Error {
            }
            throw new MyError('Something happened!');

You can also create subclasses of Array whose instances properly handle length:

            class Stack extends Array {
                get top() {
                    return this[this.length - 1];
                }
            }

            var stack = new Stack();
            stack.push('world');
            stack.push('hello');
            console.log(stack.top); // hello
            console.log(stack.length); // 2

Note that subclassing Array is usually not the best solution. It’s often better to create your own class (whose interface you control) and to delegate to an Array in a private property.

### 5.3 Private data for classes
### 类中私有数据

This section explains four approaches for managing private data for ES6 classes:

1. Keeping private data in the environment of a class constructor
2. Marking private properties via a naming convention (e.g. a prefixed underscore)
3. Keeping private data in WeakMaps
4. Using symbols as keys for private properties

Approaches #1 and #2 were already common in ES5, for constructors. Approaches #3 and #4 are new in ES6. Let’s implement the same example four times, via each of the approaches.

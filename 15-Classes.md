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

### 15.3.1 Private data via constructor environments

Our running example is a class Countdown that invokes a callback action once a counter (whose initial value is counter) reaches zero. The two parameters action and counter should be stored as private data.

In the first implementation, we store action and counter in the environment of the class constructor.

An environment is the internal data structure, in which a JavaScript engine stores the parameters and local variables that come into existence whenever a new scope is entered (e.g. via a function call or a constructor call).

This is the code:

          class Countdown {
              constructor(counter, action) {
                  Object.assign(this, {
                      dec() {
                          if (counter < 1) return;
                          counter--;
                          if (counter === 0) {
                              action();
                          }
                      }
                  });
              }
          }

Using Countdown looks like this:

          > const c = new Countdown(2, () => console.log('DONE'));
          > c.dec();
          > c.dec();
          DONE

Pros: 赞成

1. The private data is completely safe

2. The names of private properties won’t clash with the names of other private properties (of superclasses or subclasses).

Cons: 反对

1. The code becomes less elegant, because you need to add all methods to the instance, inside the constructor (at least those methods that need access to the private data).

2. Due to the instance methods, the code wastes memory. If the methods were prototype methods, they would be shared.

More information on this technique: Sect. “Private Data in the Environment of a Constructor (Crockford Privacy Pattern)” in “Speaking JavaScript”.


### 15.3.2 Private data via a naming convention

The following code keeps private data in properties whose names a marked via a prefixed underscore:

私有属性前面加前缀的下划线 _

            class Countdown {
                constructor(counter, action) {
                    this._counter = counter;
                    this._action = action;
                }
                dec() {
                    if (this._counter < 1) return;
                    this._counter--;
                    if (this._counter === 0) {
                        this._action();
                    }
                }
            }

Pros:

Code looks nice.

We can use prototype methods.

Cons:

Not safe, only a guideline for client code.

The names of private properties can clash.

### 5.3.3 Private data via WeakMaps
### 私有数据与WeakMaps

There is a neat technique involving WeakMaps that combines the advantage of the first approach (safety) with the advantage of the second approach (being able to use prototype methods).

This technique is demonstrated in the following code: we use the WeakMaps _counter and _action to store private data.

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

Each of the two WeakMaps _counter and _action maps objects to their private data.

Due to how WeakMaps work that won’t prevent objects from being garbage-collected.

As long as you keep the WeakMaps hidden from the outside world, the private data is safe.

If you want to be even safer, you can store WeakMap.prototype.get and WeakMap.prototype.set in variables and invoke those (instead of the methods, dynamically):

          const set = WeakMap.prototype.set;
          ···
          set.call(_counter, this, counter);
              // _counter.set(this, counter);

Then your code won’t be affected if malicious code replaces those methods with ones that snoop on our private data.

However, you are only protected against code that runs after your code. There is nothing you can do if it runs before yours.

Pros:

1. We can use prototype methods.
2. Safer than a naming convention for property keys.
3. The names of private properties can’t clash.
4. Relatively elegant.

Con:

Code is not as elegant as a naming convention.

### 15.3.4 Private data via symbols

Another storage location for private data are properties whose keys are symbols:

        const _counter = Symbol('counter');
        const _action = Symbol('action');

        class Countdown {
            constructor(counter, action) {
                this[_counter] = counter;
                this[_action] = action;
            }

            dec() {
                if (this[_counter] < 1) return;
                this[_counter]--;
                if (this[_counter] === 0) {
                    this[_action]();
                }
            }
        }

Each symbol is unique, which is why a symbol-valued property key will never clash with any other property key. Additionally, symbols are somewhat hidden from the outside world, but not completely:

          const c = new Countdown(2, () => console.log('DONE'));

          console.log(Object.keys(c));
              // []
          console.log(Reflect.ownKeys(c));
              // [ Symbol(counter), Symbol(action) ]

Pros:

1. We can use prototype methods.
2. The names of private properties can’t clash.

Cons:

1. Code is not as elegant as a naming convention

2. Not safe: you can list all property keys (including symbols!) of an object via Reflect.ownKeys().

### 15.3.5 Further reading

Sect. “Keeping Data Private” in “Speaking JavaScript” (covers ES5 techniques)


### 15.4 Simple mixins

Subclassing in JavaScript is used for two reasons:

Interface inheritance: Every object that is an instance of a subclass (as tested by instanceof) is also an instance of the superclass.

The expectation is that subclass instances behave like superclass instances, but may do more.

Implementation inheritance: Superclasses pass on functionality to their subclasses.

The usefulness of classes for implementation inheritance is limited, because they only support single inheritance (a class can have at most one superclass).

Therefore, it is impossible to inherit tool methods from multiple sources – they must all come from the superclass.

So how can we solve this problem? Let’s explore a solution via an example.

Consider a management system for an enterprise where Employee is a subclass of Person.

          class Person { ··· }
          class Employee extends Person { ··· }

Additionally, there are tool classes for storage and for data validation:

        class Storage {
            save(database) { ··· }
        }
        class Validation {
            validate(schema) { ··· }
        }

It would be nice if we could include the tool classes like this:

        // Invented ES6 syntax:
        class Employee extends Storage, Validation, Person { ··· }

**子类可以继承多个类**

That is, we want Employee to be a subclass of Storage which should be a subclass of Validation which should be a subclass of Person.

Employee and Person will only be used in one such chain of classes. But Storage and Validation will be used multiple times.

We want them to be templates for classes whose superclasses we fill in. Such templates are called abstract subclasses or mixins.

One way of implementing a mixin in ES6 is to view it as a function whose input is a superclass and whose output is a subclass extending that superclass:

            const Storage = Sup => class extends Sup {
                save(database) { ··· }
            };
            const Validation = Sup => class extends Sup {
                validate(schema) { ··· }
            };

Here, we profit from the operand of the extends clause not being a fixed identifier, but an arbitrary expression. With these mixins, Employee is created like this:

            class Employee extends Storage(Validation(Person)) { ··· }

Acknowledgement. The first occurrence of this technique that I’m aware of is a Gist by Sebastian Markbåge.


### 15.5 The details of classes

What we have seen so far are the essentials of classes. You only need to read on if you are interested how things happen under the hood. Let’s start with the syntax of classes. The following is a slightly modified version of the syntax shown in Sect. A.4 of the ECMAScript 6 specification.

          ClassDeclaration:
              "class" BindingIdentifier ClassTail
          ClassExpression:
              "class" BindingIdentifier? ClassTail

          ClassTail:
              ClassHeritage? "{" ClassBody? "}"
          ClassHeritage:
              "extends" AssignmentExpression
          ClassBody:
              ClassElement+
          ClassElement:
              MethodDefinition
              "static" MethodDefinition
              ";"

MethodDefinition:

          PropName "(" FormalParams ")" "{" FuncBody "}"
          "*" PropName "(" FormalParams ")" "{" GeneratorBody "}"
          "get" PropName "(" ")" "{" FuncBody "}"
          "set" PropName "(" PropSetParams ")" "{" FuncBody "}"

PropertyName:

          LiteralPropertyName
          ComputedPropertyName

LiteralPropertyName:

          IdentifierName  /* foo */
          StringLiteral   /* "foo" */
          NumericLiteral  /* 123.45, 0xFF */


ComputedPropertyName:

    "[" Expression "]"

Two observations:

* The value to be extended can be produced by an arbitrary expression. Which means that you’ll be able to write code such as the following:

        class Foo extends combine(MyMixin, MySuperClass) {}

* Semicolons are allowed between methods.


### 15.5.1 Various checks

* Error checks: the class name cannot be eval or arguments; duplicate class element names are not allowed; the name constructor can only be used for a normal method, not for a getter, a setter or a generator method.

* Classes can’t be function-called. They throw a TypeException if they are.

* Prototype methods cannot be used as constructors:

            class C {
                m() {}
            }
            new C.prototype.m(); // TypeError

### 15.5.2 Attributes of properties

Class declarations create (mutable) let bindings. The following table describes the attributes of properties related to a given class Foo:

<table>
  <thead>
    <tr>
      <th>&nbsp;</th>
      <th>writable</th>
      <th>enumerable</th>
      <th>configurable</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Static properties <code>Foo.*</code>
</td>
      <td><code>true</code></td>
      <td><code>false</code></td>
      <td><code>true</code></td>
    </tr>
    <tr>
      <td><code>Foo.prototype</code></td>
      <td><code>false</code></td>
      <td><code>false</code></td>
      <td><code>false</code></td>
    </tr>
    <tr>
      <td><code>Foo.prototype.constructor</code></td>
      <td><code>false</code></td>
      <td><code>false</code></td>
      <td><code>true</code></td>
    </tr>
    <tr>
      <td>Prototype properties <code>Foo.prototype.*</code>
</td>
      <td><code>true</code></td>
      <td><code>false</code></td>
      <td><code>true</code></td>
    </tr>
  </tbody>

</table>

Notes:

1. Many properties are writable, to allow for dynamic patching.

2. A constructor and the object in its property prototype have an immutable bidirectional link.

3. Method definitions in object literals produce enumerable properties.

15.5.3 Classes have inner names

Classes have lexical inner names, just like named function expressions.

### 15.5.3.1 The inner names of named function expressions

You may know that named function expressions have lexical inner names:

          const fac = function me(n) {
              if (n > 0) {
                  // Use inner name `me` to
                  // refer to function
                  return n * me(n-1);
              } else {
                  return 1;
              }
          };
          console.log(fac(3)); // 6

The name me of the named function expression becomes a lexically bound variable that is unaffected by which variable currently holds the function.


### 15.5.3.2 The inner names of classes

Interestingly, ES6 classes also have lexical inner names that you can use in methods (constructor methods and regular methods):

        class C {
            constructor() {
                // Use inner name C to refer to class
                console.log(`constructor: ${C.prop}`);
            }
            logProp() {
                // Use inner name C to refer to class
                console.log(`logProp: ${C.prop}`);
            }
        }
        C.prop = 'Hi!';

        const D = C;
        C = null;

        // C is not a class, anymore:
        new C().logProp();
        // TypeError: C is not a function

        // But inside the class, the identifier C
        // still works
        new D().logProp();
        // constructor: Hi!
        // logProp: Hi!

**Acknowledgement: Thanks to Michael Ficarra for pointing out that classes have inner names.**

15.6 The details of subclassing

In ECMAScript 6, subclassing looks as follows.

          class Person {
              constructor(name) {
                  this.name = name;
              }
              toString() {
                  return `Person named ${this.name}`;
              }
              static logNames(persons) {
                  for (const person of persons) {
                      console.log(person.name);
                  }
              }
          }

          class Employee extends Person {
              constructor(name, title) {
                  super(name);
                  this.title = title;
              }
              toString() {
                  return `${super.toString()} (${this.title})`;
              }
          }

          const jane = new Employee('Jane', 'CTO');
          console.log(jane.toString()); // Person named Jane (CTO)

The next section examines the structure of the objects that were created by the previous example. The section after that examines how jane is allocated and initialized.

### 15.6.1 Prototype chains

The previous example creates the following objects.

<img src="./classes----subclassing_es6_150dpi.png" />

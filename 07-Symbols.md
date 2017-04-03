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

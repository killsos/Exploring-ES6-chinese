### 1. About ECMAScript 6 (ES6)
---
* 1.1. **TC39 (Ecma Technical Committee 39)**
* 1.2. **How ECMAScript 6 was designed**
    * 1.2.1. The design process after ES6
* 1.3. **JavaScript versus ECMAScript**
* 1.4. **Upgrading to ES6**
* 1.5. **Goals for ES6**
    * 1.5.1. Goal: Be a better language
    * 1.5.2. Goal: Improve interoperation
    * 1.5.3. Goal: Versioning
* 1.6. **Categories of ES6 features**
* 1.7. **A brief history of ECMAScript**
    * 1.7.1. The early years: ECMAScript 1–3
    * 1.7.2. ECMAScript 4 (abandoned in July 2008)
    * 1.7.3. ECMAScript Harmony

---

It took a long time to finish it, but ECMAScript 6, the next version of JavaScript, is finally a reality:

[It became a standard on 17 June 2015.](http://www.ecma-international.org/news/Publication%20of%20ECMA-262%206th%20edition.htm)
Most of its features are already widely available (as documented in [kangax’ ES6 compatibility table](http://kangax.github.io/compat-table/es6/)).
Transpilers (such as [Babel](https://babeljs.io/)) let you compile ES6 to ES5.
The next sections explain concepts that are important in the world of ES6.

2015年6月17完成ES6 绝大部分特色已经可以使用（kangax’ ES6兼容列表） 通过babel将ES6代码转化为ES5

下面讲解一些ES6重要概念

### 1.1 TC39 (Ecma Technical Committee 39)


TC39 (Ecma Technical Committee 39) is the committee that evolves JavaScript. Its members are companies (among others, all major browser vendors). TC39 meets regularly, its meetings are attended by delegates that members send and by invited experts. Minutes of the meetings are available online and give you a good idea of how TC39 works.


TC39(Ecma技术委员会39)委员会,发展JavaScript。其成员企业(其中,所有主要的浏览器厂商)。TC39定期开会,会议出席代表成员发送和邀请的专家。分钟的网上会议,给你一个好主意TC39是如何工作的。

### 1.2 How ECMAScript 6 was designed 

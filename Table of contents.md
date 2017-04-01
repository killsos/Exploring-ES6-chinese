![Exploring ES6 cover](./cover.jpg)

## Exploring ES6 chinese


  第一次翻译 坚持到底

---

### Table of Contents
1. **[What you need to know about this book读书须知](#What-you-need-to-know-about-this-book)**

   * **[Audience: JavaScript programmers](#Audience-JavaScript-programmers)**
   * **[Why should I read th  book?](#Why-should-I-read-this-book)**
   * **[How to read this book](#How-to-read-this-book)**
   * **[Sources of this book](#Sources-of-this-book)**
   * **[Glossary](#Glossary)**
   * **[Conventions](#Conventions)**
   * **[Demo code on GitHub](#Demo-code-on-GitHub)**
   * **[Sidebars](#Sidebars)**
   * **[Footnotes](#Footnotes)**

2. **[Foreword 序](#Foreword)**
3. **[Preface 前言](#Preface)**
4. **[Acknowledgements 致谢](#Acknowledgements)**
5. **[About the author 关于作者](#About-the-author)**








---
### What you need to know about this book
This book is about ECMAScript 6 (whose official name is ECMAScript 2015), a new version of JavaScript.  

本书主要介绍ECMAScript 6(官方称为ECMAScript 2015)是JavaScript的新版本  

### Audience: JavaScript programmers
In order to understand this book, you should already know JavaScript. If you don’t: my other book [“Speaking JavaScript”](http://speakingjs.com/) is free online and teaches programmers all of JavaScript (up to and including ECMAScript 5).  

为了更好学习本书，您最好是具有JavaScript基础。如果你还不具备JavaScript基础，可以先读我的《Speaking JavaScript》这本书--学习javascript基础知识并包含ECMAScript 5。  

### Why should I read this book?

* **You decide how deep to go:** This book covers ECMAScript 6 in depth, but is structured so that you can also quickly get an overview if you want to.  

* **深度学习** 本书在深度上覆盖ECMAScript 6知识，你也可以大概的学习  

* **Not just “what”, also “why”:** This book not only tells you how ES6 works, it also tells you why it works the way it does.  

* **不仅知道是什么 更想知道为什么** 告诉ES6如何做 更告诉为何这么做？

* **Thoroughly researched:**  In order to make sense of ES6, I have consulted many sources:  
* **彻底的研究**  为了搞清ES6，我参考下面六个来源

  * The language specification (to which you’ll occasionally find pointers in this book)  
  * 语言规范 在本书你可以发现给出指引
  * The es-discuss mailing list
  * es-discuss邮件列表
  * The TC39 meeting notes
  * TC39会议记录
  * Scientific papers
  * 研究者论文
  * Documentation on features in other languages that inspired ES6 features
  * 其他语言文档上特色引起ES6特色
  * And more
  * 更多


### How to read this book
This book covers ES6 with three levels of detail:

  * **Quick start:** Begin with the chapter “Core ES6 features”. Additionally, almost every chapter starts with a section giving an overview of what’s in the chapter. The last chapter collects all of these overview sections in a single location.  

  * **速学:** 在ES6核心特色这章可以实现,同时几乎每一章的开始是本章的概述。

  * **Solid foundation:** Each chapter always starts with the essentials and then increasingly goes into details. The headings should give you a good idea of when to stop reading, but I also occasionally give tips in sidebars w.r.t. how important it is to know something.

  * **基础知识:** 每一章从本质开始渐渐渗透到细节。标题给出很好建议如果你不想读,但是我也出小提示在关于侧边栏,某一个细节的重要性

  * with regard to 的缩写，意思是“关于”.

  * **In-depth knowledge:** Read all of a chapter, including the in-depth parts.

  * **知识深度**

  Other things to know:
  其他需要知道的

  * **Recommendations:** I occasionally recommend simple rules. Those are meant as guidelines, to keep you safe without you having to know (or remember) all of the details. I tend to favor mainstream over elegance, because most code doesn’t exist in a vacuum. However, I’ll always give you enough information so that you can make up your own mind.
  * **推荐:** 我偶尔介绍简单规则,这些基本指导为了使您能够正确使用如果没有深入了解和记住这些规则的细节。我倾向于喜欢主流的代码胜于优雅代码。实际上代码是用来完成工作而不是艺术品。但是 我总是给你充足的知识以便于你实现自己的想法。

  * **Forum:** The “Exploring ES6” homepage [links to a forum](http://exploringjs.com/es6.html#forum) where you can discuss questions and ideas related to this book.  

  * **论坛** 在“Exploring ES6”首页给出论坛链接,你可以讨论问题或者涉及到本书的想法

  * **Errata (typos, errors, etc.):** [On the “Exploring ES6” homepage](http://exploringjs.com/es6.html#errata), there are links to a form for submitting errata and to a list with submitted errata.

  * **勘误表** 在“Exploring ES6”首页给出勘误表的链接,您可以提交勘误。

### Sources of this book

I started writing this book long before there were implementations of ES6 features, which required quite a bit of research. Essential sources were:

  * [The es-discuss mailing list](https://mail.mozilla.org/listinfo/es-discuss)
  * [TC39 meeting notes](https://github.com/tc39/tc39-notes/)
  * [The ECMAScript language specification](http://www.ecma-international.org/ecma-262/6.0/)
  * [The old ECMAScript Harmony wiki](http://wiki.ecmascript.org/doku.php?id=harmony:harmony)
  * Scientific papers (e.g. the ones written about ES6 proxies) and other material on the web.
  * Asking around to fill remaining holes (the people who answered are acknowledged throughout the book)

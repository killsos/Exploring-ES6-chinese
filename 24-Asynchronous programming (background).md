### 24. Asynchronous programming (background)
---

* 24.1. The JavaScript call stack
* 24.2. The browser event loop
  * 24.2.1. Timers
  * 24.2.2. Displaying DOM changes
  * 24.2.3. Run-to-completion semantics
  * 24.2.4. Blocking the event loop
  * 24.2.5. Avoiding blocking
* 24.3. Receiving results asynchronously
  * 24.3.1. Asynchronous results via events
  * 24.3.2. Asynchronous results via callbacks
  * 24.3.3. Continuation-passing style
  * 24.3.4. Composing code in CPS
  * 24.3.5. Pros and cons of callbacks
* 24.4. Looking ahead
* 24.5. Further reading

---
### 24.1 The JavaScript call stack
### 调用栈

When a function f calls a function g, g needs to know where to return to (inside f) after it is done. This information is usually managed with a stack, the call stack. Let’s look at an example.

        function h(z) {
            // Print stack trace
            console.log(new Error().stack); // (A)
        }
        function g(y) {
            h(y + 1); // (B)
        }
        function f(x) {
            g(x + 1); // (C)
        }
        f(3); // (D)
        return; // (E)

Initially, when the program above is started, the call stack is empty. After the function call f(3) in line D, the stack has one entry:

   * Location in global scope

After the function call g(x + 1) in line C, the stack has two entries:

   * Location in f
   * Location in global scope

After the function call h(y + 1) in line B, the stack has three entries:

   * Location in g
   * Location in f
   * Location in global scope

The stack trace printed in line A shows you what the call stack looks like:

Error
    at h (stack_trace.js:2:17)  
    at g (stack_trace.js:6:5)  
    at f (stack_trace.js:9:5)  
    at <global> (stack_trace.js:11:1)  

Next, each of the functions terminates and each time the top entry is removed from the stack. After function f is done, we are back in global scope and the call stack is empty. In line E we return and the stack is empty, which means that the program terminates.


### 24.2 The browser event loop

Simplifyingly, each browser tab runs (in) a single process: the event loop.

简单来说 浏览器每打开一个标签页就打开一个进程---事件循环

This loop executes browser-related things (so-called tasks) that it is fed via a task queue. Examples of tasks are:

这个循环执行浏览器端相关的事情---也被称为任务 并且任务通过任务队列不断生成

1. Parsing HTML 解析HTML

2. Executing JavaScript code in script elements 执行js代码

3. Reacting to user input (mouse clicks, key presses, etc.) 响应用户行为

4. Processing the result of an asynchronous network request 异步处理网络请求

Items 2–4 are tasks that run JavaScript code, via the engine built into the browser.

通过浏览器的内置引擎来完成2、4任务进行javascript代码

They terminate when the code terminates.

代码结束时候他们也就结束了

Then the next task from the queue can be executed.

这时候执行任务队列的下一个任务

The following diagram (inspired by a slide by Philip Roberts [1]) gives an overview of how all these
 mechanisms are connected.

 <img src="./async----event_loop.jpg" />

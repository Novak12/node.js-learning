"use strict";  //严格模式，禁用某些有问题的JavaScript语言特性，并使其他人抛出异常。ECMAScript 5中引入的特性。
const fs =require("fs");
fs.watch('target.txt',()=>console.log("file changed!"));//监控文件变化   箭头函数相对于旧语法的优势是：他没有为this创建作用域。
                                                        //当程序运行起来后，EventLoop等待着事件的发生--文件是否被更改。当检测到更改时，回调函数被触发，然后他检测到
                                                        //应用并没有结束,然后继续监测。
console.log('Now watching target.txt for changes...');


//为什么file changes!会出现两次？

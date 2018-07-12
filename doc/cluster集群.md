为什么要用cluster?
------- 
Node.js是一个单线程单进程模型，它是基于事件循环机制来进行调度处理，当有事件发生时，响应的callback就会被触发，
但是在任何时候，只会有一个callback被执行。当callback执行时间过长，这势必会队列其他请求造成影响。更严重的是，
如果处理某个请求时产生一个没有被捕获到的异常导致整个进程的退出，已经接收到的请求都将无法被处理。
如何使node.js支持多线程或多进程？如何使node.js充分利用多核的cpu?

cluster介绍
------
cluster是node.js的内置模块，它在V0.8就已经被引入，它是一种多进程的解决方案。cluster允许node.js应用有效的利用多核的cpu成为可能，它极大提高了应用的性能和可靠性。它只需要一个fork，不需要开发者修改任何代码便能够实现多进程部署。

cluster是如何工作的？
------
cluster对child_process模块提供了一层封装，各个工作子进程都是由child_process.fork()创建的。child_process也是node.js的一个内置模块，child_process.fork()专门用于衍生新的node.js进程，它会返回一个childprocess对象，返回的child_process会有一个额外的内置的通信通道，它允许消息在父进程和子进程之间来回传递。衍生的 Node.js 子进程在其两两之间建立的 IPC 通信信道的异常是独立于父进程的。 每个进程都有自己的内存，使用自己的 V8 实例。 由于需要额外的资源分配，因此不推荐衍生大量的 Node.js 进程。

cluster的属性和方法
*cluster.isMaster	当该进程时主进程时，返回true
*cluster.isWorker	当进程不是主进程时，返回true
*cluster.worker	当前工作进程的引用，对于主进程则无效
*cluster.workers	返回cluster中所有的工作进程对象
*cluster.fork()	衍生一个新的工作进程
*cluster.disconnect([callback])	断开当前的工作进程

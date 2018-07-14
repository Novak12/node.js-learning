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
-----
* cluster.isMaster	当该进程时主进程时，返回true
* cluster.isWorker	当进程不是主进程时，返回true
* cluster.worker	当前工作进程的引用，对于主进程则无效
* cluster.workers	返回cluster中所有的工作进程对象
* cluster.fork()	衍生一个新的工作进程
* cluster.disconnect([callback])	断开当前的工作进程

cluster的事件
------
* Event:’fork’	监听worker创建事件
* Event:’online’	监听worker创建成功事件
* Event:’listening’	监听worker进入监听事件
* Event:’disconnect’	监听worker断开事件
* Event:’exit’	监听worker退出事件
* Event:’mesage’	监听worker进程发送的消息事件

在js代码中使用cluster
------
可以看看官方网站上的实例：
```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid} 正在运行`);

  // 衍生工作进程。
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
  });
} else {
  // 工作进程可以共享任何 TCP 连接。
  // 在本例子中，共享的是一个 HTTP 服务器。
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('你好世界\n');
  }).listen(8000);

  console.log(`工作进程 ${process.pid} 已启动`);
}
```
每一次调用fork()函数时，都会产生一个新的工作进程。在上面的代码示例中，先检查当前的工作进程是否是主工作进程，如果是，则创建子工作进程；如果当前进程不是主进程，fork方法会启动一个新的node.js进程，这些进程的代码都是相同的。
运行代码之后，Node.js 将会在工作进程(指代子进程)之间共享8000端口。

在typescript中使用cluster
------
这里我们使用之前的一个[nest.js](https://github.com/Novak12/nest-app/)的项目为例:
```typescript
import * as cluster from "cluster";
import { AppRun } from './appRun';
import { cpus } from "os";

const numCPUs = cpus().length;
if (cluster.isMaster) {
  console.log(`This machine has ${numCPUs} CPUs.`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("online", (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
    console.log("Starting a new worker...");
    cluster.fork();
  });

} else {
  console.log('else');
  const app = new AppRun(3002);
  app.start();
}
```
appRun.ts就是之前的启动文件main.ts的改造：
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
export class AppRun {
    private port: number;

    constructor(port: number) {
        this.port = port;
    }
    async start() {
        const app = await NestFactory.create(AppModule);
        await app.listen(this.port, () => {
            console.log(`app run :${process.pid} isten on port ${this.port}`)
        });
    }
}
```
在部署时使用PM2来进行管理，这样就是一个简单的node.js的多进程方案

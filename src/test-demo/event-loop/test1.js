const { readFile } = require('fs');
const eventEmitetr = require('events');

class EE extends eventEmitetr { }
const yy = new EE();

yy.on('event', () => {
    console.log('出大事啦！');
});

setTimeout(() => {
    console.log('0 毫秒后定期执行的定时回调器');
}, (0));

setTimeout(() => {
    console.log('100 毫秒后定期执行的定时回调器');
}, (100));

setTimeout(() => {
    console.log('200 毫秒后定期执行的定时回调器');
}, (200));

readFile('../../package.json', 'utf-8', data => {
    console.log('完成文件 1 读操作的回调');
});

readFile('../../package-lock.json', 'utf-8', data => {
    console.log('完成文件 2 读操作的回调');
});

setImmediate(() => {
    console.log('immediate 立即执行回调');
});

process.nextTick(() => {
    console.log('process.nextTick 的第一次回调');
})

Promise.resolve()
    .then(() => {
        yy.emit('event');

        process.nextTick(() => {
            console.log('process.nextTick 的第二次回调');
        });
        console.log('Promise 的第一次回调');
    })
    .then(() => {
        console.log('Promise 的第二次回调');
    });
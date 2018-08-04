const { readFile } = require('fs');

readFile('../../package.json', () => {
    setTimeout(() => {
        console.log('readfile timeout')
    }, 0);

    setImmediate(() => {
        console.log('readfile immediate')
    })
})
setTimeout(() => {
    console.log('阶段1  定时器执行回调1');
    setTimeout(() => {
        console.log('阶段1 timeout=>timeout');
        setTimeout(() => {
            console.log('阶段1 timeout=>timeout=>timeout')
            setTimeout(() => {
                console.log('阶段1 timeout=>timeout=>timeout=>timeout')
            }, 0);
        }, 0);
    }, 0);
}, 0);

Promise.resolve()
    .then(() => {
        console.log('promise执行');
        setTimeout(() => {
            console.log('promise中的timeout')
        }, 0);
        setImmediate(() => {
            console.log('promise中的immediate')
            setImmediate(()=>{
                console.log('promise immediate=>immediate')
            })
            setTimeout(() => {
                console.log('promise immediate=>timeout')
            }, 0);
        })
    })

setImmediate(() => {
    console.log('待切入下一阶段 immeduate执行');
})

console.log('主线程的console');
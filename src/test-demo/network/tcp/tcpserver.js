let net = require('net');
let server = net.createServer(function (socket) {

    socket.on('data', function (data) {
        socket.write('hello');
    });

    socket.on('end', function () {
        console.log('connect is opened')
    });

    socket.write('welcome to my socket!');
});
server.on('connection', function (socket) {
    console.log('connected!!')
})

server.listen(8000, function () {
    console.log('server bound')
})
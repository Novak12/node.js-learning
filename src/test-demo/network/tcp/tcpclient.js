let net =require('net');

let client=net.connect({port:8000},function(data){
    console.log('client connected');
    client.write('world');
})

client.on('data',function(data){
    console.log(data.toString());
    client.end();
});

client.on('end',function(){
    console.log('client disconnected');
})
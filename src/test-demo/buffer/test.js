//buffer是一个典型的js&&c++结合的模块。它的性能部分用c++实现，将非性能部分用js实现
let str = 'node buffer module';
let buf = new Buffer(str, 'utf-8');
console.log(buf);
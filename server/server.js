const net = require('net'),
      JsonSocket = require('json-socket');

var sockets = [];      

const server = net.createServer((socket) => {
    var remoteAddress = socket.remoteAddress + ":" + socket.remotePort;

    socket = new JsonSocket(socket);
    sockets.push(socket);

    socket.on('message', (data) => {
        if(data.id === 'MESSAGE'){
            broadcastMessage(data);
        }
    });

    // socket.once('close', () => {

    // })
})

function broadcastMessage(data){
    sockets.forEach( (socket) => { 
        socket.sendMessage(data);
    });
}

server.on('error', (err) => {
    throw err;
})

server.listen(3000, "127.0.0.1", () => {
    console.log(`Server running...`);
}) 
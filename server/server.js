const net = require('net'),
      JsonSocket = require('json-socket');

var sockets = [];      

const server = net.createServer((socket) => {
    var remoteAddress = socket.remoteAddress + ":" + socket.remotePort;

    socket = new JsonSocket(socket);
    sockets.push(socket);
    socket.loc = sockets.length-1;

    socket.on('message', (data) => {
        console.log(data);
        switch(data.id){
            case 'MESSAGE':
                broadcastMessage(data);
                break;
        }
    });

    socket.on('error', (err) => {
        console.log(err);
    })

    socket.on('close', (err) => {
        sockets.splice(socket.loc, 1);
        console.log(`Socket at location: ${socket.loc} was removed.`)
    })
    // socket.once('close', () => {

    // })
})

function broadcastMessage(data){
    sockets.forEach( (socket) => { 
        socket.sendMessage(data);
    });
}

server.on('error', (err) => {
    console.log(err);
})

server.listen(3000, "127.0.0.1", () => {
    console.log(`Server running...`);
}) 
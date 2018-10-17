const net = require('net'),
      JsonSocket = require('json-socket');

var sockets = [];      

var dir = __dirname.replace('server', '');
require(dir + '/database.js');   
require(dir + '/dbAccount.js');   

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
            case 'REGISTER':
                dbAccount.register(data.username, data.password, '', (success) => {
                    socket.sendMessage({
                        id: 'REGISTER',
                        success: success,
                        username: data.username,
                        password: data.password
                    })
                })
                break;
            case 'LOGIN':
                dbAccount.verify(data.username, data.password, (exists) => {
                    socket.sendMessage({
                        id: 'LOGIN',
                        exists: exists,
                        username: data.username,
                        password: data.password
                    })
                })
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
    dbAccount.verify(data.user, data.pass, (exists) => {
        if(exists){
            sockets.forEach( (socket) => { 
                socket.sendMessage(data);
            });
        }
    })
}

server.on('error', (err) => {
    console.log(err);
})

server.listen(3000, "127.0.0.1", () => {
    console.log(`Server running...`);
}) 
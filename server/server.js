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
                dbAccount.verify(data.username, data.password, (exists, acc) => {
                    socket.sendMessage({
                        id: 'LOGIN',
                        exists: exists,
                        username: data.username,
                        password: data.password,
                        profileImage: acc.profileImage
                    })
                })
                break;
            case 'SETPROFILEIMAGE':
                dbAccount.setProfileImage(data.username, data.password, data.link, (success) => {
                })
                break;
        }
    });

    socket.on('error', (err) => {
        console.log(err);
    })

    socket.on('close', (err) => {
        remove(sockets, socket);
        console.log(`Socket at address: ${remoteAddress} was removed.`)
    })
    // socket.once('close', () => {

    // })
})

function broadcastMessage(data){
    dbAccount.verify(data.user, data.pass, (exists, acc) => {
        if(exists){
            sockets.forEach( (socket) => { 
                socket.sendMessage({
                    id: 'MESSAGE',
                    user: acc.username,
                    pass: acc.password,
                    value: data.value,
                    profileImage: acc.profileImage
                });
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

function remove(array, element) {
    return array.filter(e => e !== element);
}
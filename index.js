const { app, BrowserWindow } = require('electron');

var net = require('net'),
    JsonSocket = require('json-socket');

function initServerConnection(){
  var socket = new JsonSocket(new net.Socket());
  socket.connect(3000, "127.0.0.1");
  socket.on('connect', () => {
    socket.on('message', (data) => {
      console.log(data);
    })
  })
}

function createWindow () {
  //initServerConnection()
  win = new BrowserWindow({ width: 800, height: 600 })
  //win.setMenu(null)
  win.loadFile('./public/homepage.html')
}

app.on('ready', createWindow)
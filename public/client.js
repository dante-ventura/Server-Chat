var messageCount = 1;

var net = require('net'),
    JsonSocket = require('json-socket'),
    store = require('store'),
    storage = require('electron-json-storage');

var socket;
var username = '',
    password = '';

function register(){
  var username = document.getElementById('userBox').value;
  var password = document.getElementById('passwordBox').value;
  socket.sendMessage({
    id: 'REGISTER',
    username: username,
    password: password
  })
}

function login(){
  var username = document.getElementById('userBox').value;
  var password = document.getElementById('passwordBox').value;
  socket.sendMessage({
    id: 'LOGIN',
    username: username,
    password: password
  })
}

document.addEventListener('DOMContentLoaded', () => {
  storage.get('account', function(error, data) {
    if (error) throw error;    

    if(window.location.toString().includes('homepage')){
        if(data.username.length > 0){
          document.getElementById('userBox').value = data.username;
          document.getElementById('passwordBox').value = data.password;
        }
    }
    else if(window.location.toString().includes('index')){
      username = data.username;
      password = data.password;
      document.getElementById('profileImageTextBox').src = data.profileImage;
    }
    
  })
})

function initServerConnection(){
  socket = new JsonSocket(new net.Socket());
  socket.connect(3000, "127.0.0.1");
  socket.on('connect', () => {
    socket.on('message', (data) => {
      switch(data.id){
        case 'MESSAGE':
          receiveMessage(data);
          break;
        case 'REGISTER':
          if(data.success === true){
            storage.set('account', { username: data.username, password: data.password, profileImage: data.profileImage }, (error) => {
              if (error) throw error;
            });
            window.location = './index.html';
          }
          else
            alert('There was an error registering. Please try again at a different time.');
          break;
        case 'LOGIN':
          if(data.exists === true){
            storage.set('account', { username: data.username, password: data.password, profileImage: data.profileImage }, (error) => {
              if (error) throw error;
            });
            window.location = './index.html';
          }
          else
            alert('Login failed... Either your information is wrong or the servers are down.')
          break;
      }
    })
  })
}

function sendMessage(e){
    if(e.keyCode === 13){
        e.preventDefault();

        var text = e.currentTarget.value;

        // storage.get('account', function(error, data) {
        //   if (error) throw error;    
        //alert(username + ":" + password);
          
          if(text.charAt(0) === '/'){
            var command = text.substr(0,text.indexOf(' '));
            var content = text.replace(command, '');
            switch(command.toLowerCase()){
              case '/setprofileimage':
                socket.sendMessage({
                  id: 'SETPROFILEIMAGE',
                  username: username,
                  password: password,
                  link: content
                })
            }
          }
          else if(username.length > 0){         
            socket.sendMessage({
              id: 'MESSAGE',
              user: username,
              pass: password,
              value: text
            });
          }
          else{
            alert('Please register/login before sending messages!');
          }
        //});

        e.currentTarget.value = '';
    }
}

function receiveMessage(data){
  document.getElementById(`m${messageCount}`).insertAdjacentHTML('afterend', 
  `<div class="box" id="m${++messageCount}">
   <article class="media">
     <div class="media-left">
       <figure class="image is-64x64">
         <img class="is-rounded" src="${data.profileImage}" id ="profileImage" alt="Image">
       </figure>
     </div>
     <div class="media-content">
       <div class="content">
         <p>
           <strong>${data.user}</strong>
           <br>
           ${data.value}
         </p>
       </div>
     </div>
   </article>
 </div>`)
 window.scrollTo(0,document.body.scrollHeight);
}

function openUserList(){
  document.getElementById("userList").style.width = 100;
  document.getElementById("main").style.marginLeft = 100;
}

function closeUserList(){
  document.getElementById("userList").style.width = 0;
  document.getElementById("main").style.marginLeft = 0;
}
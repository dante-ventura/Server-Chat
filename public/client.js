var messageCount = 1;

var net = require('net'),
    JsonSocket = require('json-socket'),
    store = require('store')

var socket;

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

function initServerConnection(){
  if(window.location.toString().includes('homepage')){
    document.getElementById('userBox').value = localStorage.getItem('username');
    document.getElementById('passwordBox').value = localStorage.getItem('password');
  }
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
            localStorage.setItem('username', data.username);
            localStorage.setItem('password', data.password);
            window.location = './index.html';
          }
          else
            alert('There was an error registering. Please try again at a different time.');
          break;
        case 'LOGIN':
          if(data.exists === true){
            localStorage.setItem('username', data.username);
            localStorage.setItem('password', data.password);
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

        var username = localStorage.getItem('username');
        var password = localStorage.getItem('password');

        if(text.charAt(0) === '/'){
          var command = text.substr(0,text.indexOf(' '));
          var content = text.replace(command, '');
          switch(command.toLowerCase()){

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

        e.currentTarget.value = '';
    }
}

function receiveMessage(data){
  document.getElementById(`m${messageCount}`).insertAdjacentHTML('afterend', 
  `<div class="box" id="m${++messageCount}">
   <article class="media">
     <div class="media-left">
       <figure class="image is-64x64">
         <img src="https://bulma.io/images/placeholders/128x128.png" alt="Image">
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
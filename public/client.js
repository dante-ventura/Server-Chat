var messageCount = 1;

var net = require('net'),
    JsonSocket = require('json-socket');

var socket;
var username = '';

function initServerConnection(){
  socket = new JsonSocket(new net.Socket());
  socket.connect(3000, "127.0.0.1");
  socket.on('connect', () => {
    socket.on('message', (data) => {
      switch(data.id){
        case 'MESSAGE':
          receiveMessage(data);
      }
    })
  })
}

function sendMessage(e){
    if(e.keyCode === 13){
        e.preventDefault();

        var text = e.currentTarget.value;

        if(text.charAt(0) === '/'){
          var command = text.substr(0,text.indexOf(' '));
          var content = text.replace(command, '');
          switch(command.toLowerCase()){
            case '/setname':
              username = content;
              break;
          }
        }
        else if(username.length > 0){
          socket.sendMessage({
            id: 'MESSAGE',
            user: username,
            value: text
          });
        }
        else{
          alert('Please use /setName before sending a message!');
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
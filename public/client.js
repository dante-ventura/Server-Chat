var messageCount = 1;
var first = true;
var net = require('net'),
    JsonSocket = require('json-socket');

var socket;

function initServerConnection(){
  socket = new JsonSocket(new net.Socket());
  socket.connect(3000, "127.0.0.1");
  socket.on('connect', () => {
    socket.on('message', (data) => {
      console.log(data);
    })
  })
}

function sendMessage(e){
    if(e.keyCode === 13){
        e.preventDefault();

        socket.sendMessage({
          id: 'MESSAGE',
          value: e.currentTarget.value
        });

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
                <strong>John Smith</strong>
                <br>
                ${e.currentTarget.value}
              </p>
            </div>
          </div>
        </article>
      </div>`)

        e.currentTarget.value = '';


        //alert("Your message was sent.");
    }
}
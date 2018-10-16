var messageCount = 1;

function sendMessage(e){
    if(e.keyCode === 13){
        e.preventDefault();

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
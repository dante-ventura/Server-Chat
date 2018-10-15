

function sendMessage(e){
    if(e.keyCode === 13){
        e.preventDefault();
        e.currentTarget.value = '';
        alert("Your message was sent.");
    }
}
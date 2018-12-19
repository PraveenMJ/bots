window.onload = () => {
    console.log('bot loaded');
    let button = document.querySelector('#sendMessageButton');
    
    let clearMessageButton = document.querySelector('#clearMessageButton');
    button.addEventListener('click', sendMessage, false);
    let textBox = document.querySelector('#userTypedMessage');
    
    textBox.addEventListener('keydown', sendMessageOnEnter, false);
    clearMessageButton.addEventListener('click', clearMessageList, false);
};

const ON_MESSAGE = 'ON_MESSAGE'; 
const accessToken='f4b4d576ac1e4653b672d97f552ca3ee'; 
const client = new ApiAi.ApiAiClient({accessToken});

function sendMessage() {
    let textBox = document.querySelector('#userTypedMessage');
    let messageToBeSent = textBox.value;
    console.log(messageToBeSent);
    textBox.value='';	
    if(messageToBeSent==='') return;
    appendMessageInList(messageToBeSent,'user');
    scrollToBottomOfMessageList();
    
    client.textRequest(messageToBeSent)
            .then(onSuccess)
            .catch(handleError);

    function onSuccess(response){ 
            console.log(response);
            const {result:{fulfillment}} = response; 
            appendMessageInList(fulfillment.speech,'bot');
            scrollToBottomOfMessageList();
    }; 

    function handleError(serverError) {
        console.log(serverError);
    }; 

}

function scrollToBottomOfMessageList(){
    let target = document.getElementById('content');
    target.scrollTop = target.scrollHeight;
}

function appendMessageInList(message,user){
    let list = document.querySelector('#messageList');
    let li = document.createElement('li');
    li.innerHTML = '<div class='+user+'>'+message+'</div>'+
    '<div class="messageTimeStamp">'+moment().format('h:mm:ss a')+'</div>';
    list.appendChild(li);
}

function sendMessageOnEnter(event) {
    if (event.keyCode == 13) sendMessage();
    return false;
}

function clearMessageList(){
    console.log('clearing..');
    var list = document.getElementById('messageList');
    while(list.firstChild){
        list.removeChild(list.firstChild);
    }
    console.log('all childs removed');
    let li = document.createElement('li');
    li.setAttribute('class','grey-info');
    li.innerHTML = "start conversation by sending 'Hi'";
    list.appendChild(li);
}
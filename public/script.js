const socket = io();

var userInput;

window.onload = function () {
    do {
        userInput = prompt("Enter Your name");
        socket.emit("joinedusername", userInput)
    } while (userInput === null || userInput === "");

    socket.username = userInput;
}

socket.on("allonlineusers", (myArray) => {
    const fixedDiv = document.querySelector(".fixed");

    fixedDiv.innerHTML = "";

    myArray.forEach((user) => {
        const joinedUserDiv = document.createElement("div");
        joinedUserDiv.className = "joineduser";

        const h2Element = document.createElement("h2");

        const userSpan = document.createElement("span");
        userSpan.textContent = user;

        h2Element.appendChild(userSpan);

        joinedUserDiv.appendChild(h2Element);

        fixedDiv.appendChild(joinedUserDiv);
    });
});

var send = document.getElementById("send");

send.addEventListener('click', () => {
    var writtenmessage = document.getElementById("writtenmessage");

    if (writtenmessage.value != "") {
        socket.emit('messages', writtenmessage.value, socket.id, userInput);
    } else {
        alert("Please Type your Message")
    }

    writtenmessage.value = ""
})

socket.on('printmessage', (writtenmessage, socketid, userInput) => {
    // console.log(writtenmessage)
    // console.log(socketid)

    var chatsmain = document.querySelector('.chatsmain');

    var newMessageDiv = document.createElement('div');
    newMessageDiv.classList.add('mainmessagediv');

    var newMessageContainer = document.createElement('div');
    newMessageContainer.classList.add(socketid === socket.id ? 'printmessage1' : 'printmessage');

    var labelElement = document.createElement('label');
    labelElement.setAttribute('for', ''); // You can set the 'for' attribute value if needed
    labelElement.textContent = userInput;

    newMessageContainer.appendChild(labelElement);

    var messageElement = document.createElement('div');
    messageElement.textContent = writtenmessage;

    newMessageContainer.appendChild(messageElement);

    newMessageDiv.appendChild(newMessageContainer);

    chatsmain.appendChild(newMessageDiv);
    chatsmain.scrollTop = chatsmain.scrollHeight;

    if (socketid === socket.id) {
        const audio = new Audio('/Notification/notification.mp3');
        audio.play();
    } else {
        const audio = new Audio('/Notification/whistle.mp3');
        audio.play();
    }
});

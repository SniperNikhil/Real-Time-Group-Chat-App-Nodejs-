const exp = require("constants");
const express = require("express")
const app = express()
const path = require("path")
const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);
const port = 4001;

const public = path.join(__dirname,"public")
app.use(express.static(public))

app.set("view engine","hbs")
app.get("/",(req,res)=>{
    res.render("index")
})

const onlineUsers = {};

// Socket.IO logic
io.on('connection', (socket) => {
    socket.on("joinedusername", (username) => {
        onlineUsers[socket.id] = username;
        
        io.emit("allonlineusers", Object.values(onlineUsers));
    });

    socket.on('disconnect', () => {
        const username = onlineUsers[socket.id];

        if (username) {
            delete onlineUsers[socket.id];

            io.emit("allonlineusers", Object.values(onlineUsers));
        }
    });

    socket.on('messages', (writtenmessage,socketid,userInput)=>{
        io.emit('printmessage',writtenmessage,socketid,userInput)
    })
});

server.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})
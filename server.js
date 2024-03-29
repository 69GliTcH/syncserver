const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const port =process.env.PORT;

const users = [{}];

app.use(cors());
app.get("/", (req, res) => {
    res.send("Working");
});

const server = http.createServer(app);

const io = socketIO(server);

io.on('connection', (socket) => {


    socket.on('joined', ({ user }) => {
        users[socket.id] = user;
        socket.emit('welcome', { user: "Admin", message: `Welcome to the server, ${users[socket.id]}` });
        socket.broadcast.emit('userJoined', { user: "Admin", message: ` ${users[socket.id]} has joined` });
        console.log(`${user} joined`);
    });


    socket.on('message', ({ message, id }) => {
        io.emit('sendMessage', { user: users[id], message, id });
    });


    socket.on("disconnected", () => {
        socket.broadcast.emit('leave', { user: "Admin", message: `${users[socket.id]} has left` });
        console.log(`${users[socket.id]} left`);
    });



});

server.listen(port, () => {
    console.log(`server is working on http://localhost:${port}`);
});

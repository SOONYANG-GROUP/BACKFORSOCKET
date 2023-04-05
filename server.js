const express = require("express");
const app = express();
const cors = require("cors");
const { instrument } = require("@socket.io/admin-ui");
app.use(cors());

const httpServer = require("http").createServer(app);
const io = require('socket.io')(httpServer, {
    cors: {
        origin: "*"
    }
});

instrument(io, {
    auth: false
});

io.on("connection", socket => {
    socket.onAny((event) => {
        console.log(`[${socket.id}:${socket.rooms}]: event=${event}`);
    });
    socket.on("join_room", (roomName) => {
        socket.join(roomName);
        socket.to(roomName).emit("welcome");
    });
    socket.on("offer", (offer, roomName) => {
        socket.to(roomName).emit("offer", offer);
    });
    socket.on("answer", (answer, roomName) => {
        socket.to(roomName).emit("answer", answer);
    });
    socket.on("ice", (ice, roomName) => {
        socket.to(roomName).emit("ice", ice);
    });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`[+] Server is running on ${PORT}`)
});
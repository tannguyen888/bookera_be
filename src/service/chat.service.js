const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const chatService = require('../service/chat.service');
const user = require("../models/user");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);



io.on("connection", (socket) => {
    const user = {
        user: Model.user.username,
        userId: Model.user.id

    }; // Lấy thông tin user từ token hoặc session
    console.log("New client connected", user);   
   
  socket.on('chat message', (data) => {
    console.log('message: ' + data.msg + ' from user: ' + data.user);
 
    io.emit('chat message', data);
}
)
});


io.on("disconnect", () => {
    console.log("Client disconnected");
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Chat server running on port ${PORT}`));  
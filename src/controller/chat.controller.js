const chatService = require('../services/chat.service');
const jwt = require('jsonwebtoken');

module.exports = (io) => {

    // middleware check JWT cho socket
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
            socket.user = user;
            next();
        } catch {
            next(new Error("Unauthorized"));
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.user.username);

        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
        });

        socket.on('sendMessage', async (data) => {
            const message = await chatService.saveMessage({
                from: socket.user.username,
                roomId: data.roomId,
                text: data.text
            });

            io.to(data.roomId).emit('newMessage', message);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};

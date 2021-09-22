const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { v4: uuidV4 } = require('uuid');
const path = require('path');
const io = require('socket.io')(server, {
    cors: {
        origins: ['http://localhost:3001']
    }
});


io.on("connection", socket => {
    socket.on("join-room", (roomId, userId, messageList) => {
        socket.join(roomId);
        socket.to(roomId);
        let messages = messageList
        socket.broadcast.emit('user-connected', userId);
        console.log(messageList)
        socket.emit('previous-message', messageList)

        socket.on('send-message', message => {
            messages.push(message);
            socket.to(roomId).emit('insert-message', messages);
        })

        socket.on('disconnect', () => {
            messages = messages.length = 0
            console.log('disconnected')
        })
    })
})

server.listen(3000, () => {
    console.log('Server on');
})
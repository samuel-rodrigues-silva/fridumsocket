const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { v4: uuidV4 } = require('uuid');
const path = require('path');
const io = require('socket.io')(server,{
    cors: {
        origins: ['http://localhost:3001']
    }});

let messages = []
    
io.on("connection", socket => {
    socket.on("join-room", (roomId, userId) => {
        console.log(roomId);
        console.log(userId);
        socket.join(roomId);
        socket.to(roomId);
        socket.broadcast.emit('user-connected', userId);

        socket.emit('previous-message', messages)

        socket.on('send-message', message => {
            messages.push(message);
            console.log(message)
            socket.broadcast.emit('insert-message', message);
        })

        socket.on('disconnect', () => {
            messages = messages.length = 0
        })
    })
})

server.listen(3000, () => {
    console.log('Server on');
})
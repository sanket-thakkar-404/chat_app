const { Server } = require('socket.io');
const http = require('http');
const express = require('express')
const app = express();



const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL]
  },
})



// used to store onlineUsers 
const userSocketMap = {} // {userId : socketId}


function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}


io.on('connection', (socket) => {
  console.log('A user Connected', socket.id)

  const userId = socket.handshake.query.userId
  if (userId) userSocketMap[userId] = socket.id

  // this is used to send events to all the connected clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap))

  socket.on("disconnect", () => {
    console.log('A User disconnected', socket.id)
    delete userSocketMap[userId],
      io.emit('getOnlineUsers', Object.keys(userSocketMap))
  })
})
module.exports = { io, app, server, getReceiverSocketId }
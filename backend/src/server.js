const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const path = require('path')
dotenv.config()
// const server = require('./')

const PORT = process.env.PORT
const connectToDB = require('../src/config/db')
const authRoutes = require('../src/Routes/auth.routes')
const userRoutes = require('../src/Routes/user.routes')
const messageRoutes = require('../src/Routes/message.routes');
const { app, server } = require('./lib/Socket');

connectToDB()

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}))
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('server is running')
})



app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/messages', messageRoutes)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`server is running in the port : ${PORT}`)
})
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors')
dotenv.config()
// const server = require('./')

const PORT = process.env.PORT
const connectToDB = require('../src/config/db')
const authRoutes = require('../src/Routes/auth.routes')
const messageRoutes = require('../src/Routes/message.routes')

connectToDB()

const app = express();

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
app.use('/api/message', messageRoutes)

app.listen(PORT, () => {
  console.log(`server is running in the port : ${PORT}`)
})
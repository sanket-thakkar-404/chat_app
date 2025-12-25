const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config()
// const server = require('./')

const PORT = process.env.PORT 
const connectToDB = require('../src/config/db')
const authRoutes = require('../src/Routes/auth.routes')
connectToDB()

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/' , (req,res)=>{
  res.send('server is running')
})



app.use('/api/auth' , authRoutes)

app.listen(PORT , ()=>{
  console.log(`server is running in the port : ${PORT}`)
})
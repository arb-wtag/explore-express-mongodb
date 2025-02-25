const express=require('express');
const mongoose=require('mongoose');
require('dotenv').config();
const todoHandler=require('./routeHandlers/todoHandler');

const app=express();
app.use(express.json());

const port=process.env.PORT || 3000;

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cf1wr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
  .then(()=>console.log('Connection Successful'))
  .catch((error)=>console.log(error));

app.use('/todo',todoHandler);

app.listen(port,()=>{
    console.log(`listening to port no ${port}`);
});
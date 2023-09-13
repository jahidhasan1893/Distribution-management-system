const express =require('express');


const app =express();
const port=3000;

app.use(express.static('views'));

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/views/sign_in.html");
})

app.listen(port,(req,res)=>{
    console.log(`listening at port number ${port}`);
})
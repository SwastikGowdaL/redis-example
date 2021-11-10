const express = require("express");
const fs = require("fs");
const redis = require("redis");

const redisClient = redis.createClient(); 

const app = express();
app.use(express.json());

app.post("/writeData",async (req,res)=>{
    fs.writeFileSync("./testing.txt",req.body.data);
     redisClient.SETEX("text",60000,req.body.data);
     redisClient.LPUSH("text1",req.body.name);
    res.status(200).send({
        status :"data written"
    })
})

app.get("/cachedData",async (req,res)=>{
    // const data = fs.readFileSync("./testing.txt", {encoding:'utf8', flag:'r'});
     redisClient.get("text", async (error,data)=>{
        if(error){
            console.log(error); 
        }
        if(data!=null){
            console.log("cache hit");
            res.status(200).send({
                text:data
            })
        }else{
            console.log("cache miss"); 
            const tempData = fs.readFileSync("./testing.txt", {encoding:'utf8', flag:'r'});
             redisClient.SETEX("text",60000,tempData);
            res.status(200).send({
                text:tempData
            })
        }
    })
   
})

app.listen(3000,()=>{
    console.log("listening on port 3000"); 
})
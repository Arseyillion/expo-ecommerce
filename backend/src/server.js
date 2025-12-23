import express from "express"

const app = express()

app.get("/api/health",(req, res)=>{
    res.status(200).json({message:"success"})
})

app.listen(5000,()=> console.log("server is up and running... "))
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app=express()
 
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    Credential:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))// extended true means object k ander object 
app.use(express.static("public"))// for general use

app.use(cookieParser())

export { app } 
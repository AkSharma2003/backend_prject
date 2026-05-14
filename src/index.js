
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path:'./env'
})
connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERROR is: ",error);
        throw error 
    })
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`server is running at port: ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("mongobd conectin failed",err)
})



// (async()=>{
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME }`)
//     } catch (error) {
//         console.error("ERROR",error)
//         throw err
//     }
// })()
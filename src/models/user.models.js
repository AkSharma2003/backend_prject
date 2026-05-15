import mongoose,{ Schema } from "mongoose";
import jwt from "JsonWebToken"
import bcrypt from "bcrypt"

const userSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index: true // it optimize for searching in database that means when index is true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String, //cloudnaey url uses here
            required:true,
        },
        coverImage:{
            type:String, //cloudnaey url uses here
        },
        password:{
            type:String,
            required:[true,"password is required"]
        },
        watchHistory:{
            type:Schema.Types.ObjectId,
            ref:"Vidio"
        },
        refreshTocken:{
            type:String
        }        

    },{timestamps:true}
)

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
         
    this.password=bcrypt.hash(this.password,10)
    next()
}) // this code incrept password

userSchema.methods.isPasswordCorrect= async function (password){
    return await bcrypt.compare(password,this.password)
    
}

userSchema.methods.generateAccessTocken=function(){
    return jwt.sign(
        {
            _id=this._id,
            email=this.email,
            username=this.username,
            fullName=this.fullName
        },
        process.env.ACCESS_TOCKEN_SECRATE,
        {
            expiresIn:process.env.ACCESS_TOCKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefrashTocken=function(){
    return jwt.sign(
        {
            _id=this._id,
        },
        process.env.REFRESH_TOCKEN_SECRATE,
        {
            expiresIn:process.env.REFRESH_TOCKEN_EXPIRY 
        }
    )
}

export const User=mongoose.model("User",userSchema)
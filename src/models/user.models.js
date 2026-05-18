import mongoose,{ Schema } from "mongoose";
import jwt from "jsonwebtoken"
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
        fullname:{
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
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Vidio"
            }
        ],
        refreshToken:{
            type:String
        }        

    },{timestamps:true}
)

userSchema.pre("save",async function(){
    if(!this.isModified("password")) return
         
    this.password=await bcrypt.hash(this.password,10)
}) // this code incrept password

userSchema.methods.isPasswordCorrect= async function (password){
    return await bcrypt.compare(password,this.password)
    
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRATE,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefrashToken=function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRATE,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model("User",userSchema)
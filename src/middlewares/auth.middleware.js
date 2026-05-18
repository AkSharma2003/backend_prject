import { User } from "../models/user.models.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"



export const verifyJWT=asyncHandler(async(req, res, next)=>{
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new apiError(401,"Unauthorized request, no token provided")
        }
        
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRATE)
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if(!user){
            throw new apiError(401, "Invailid Access Token: user not found")
    
        }
    
        req.user=user;
        next() 
    
    } catch (error) {
        // throw new apiError(401,error?.message || "Inavailid access token")
        next(new apiError(401,error?.message || "Inavailid access token"))
    }
})
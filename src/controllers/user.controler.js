import {asyncHandler} from "../utils/asynchandler.js"
import {apiError} from "../utils/apiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"


// for generateAccessTockenAndRefressToken
const generateAccessAndRefreshTokens=async(userId)=>{
    try {
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefrashToken()

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})

        return { refreshToken, accessToken }

    } catch (error) {
        throw new apiError(500,"somthing went wrong while generate Access And Refress Tokens") 
    }
}

//for registerUser
const registerUser = asyncHandler(async(req,res)=>{
    // get user details from frontent
    // cheack validation that empty or not
    // cheack if user is allready exit or not throw email and username
    // cheack for emage and avtar
    // upload them to cloudinary ,avtar
    // create user object - create entrty in db
    // remove password and refresh tocken field from response
    // cheack for user creation
    // return response 


    const {fullname, email, username, password} = req.body
    // console.log("email: ",email)

    // cheack validation
    if(
        [fullname,email,password,username].some((field)=>field?.trim()==="")
    ){
        throw new apiError(400,"all field are required")
    }


    const existedUser=await User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new apiError(409,"user with username or email allready exists")
    }
    const avtarLocalPath=req.files?.avatar?.[0]?.path;
    const coverImageLocalPath=req.files?.coverImage?.[0]?.path;

    if(!avtarLocalPath){
        throw new apiError (400,"AvatarLocal file is not created")
    }

    const avatar=await uploadOnCloudinary(avtarLocalPath)
    let coverImage=null
    if(coverImageLocalPath){
        coverImage=await uploadOnCloudinary(coverImageLocalPath)
    }

    if(!avatar){
        throw new apiError (400,"Avatar file is requared")
    }

    const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser=await User.findById(user._id).select("-password -refreshToken")

    // console.log(createdUser)
    if(!createdUser){
        throw new apiError(500, "somthing went wrong while registring the user")        
    }

    return res.status(201).json(
        new apiResponse(201, createdUser, "User created successfully")
    )

})

// for login user

const loginUser=asyncHandler(async(req,res)=>{
    //req body->data
    //username email
    // find the user
    // password check 
    // access and refresh token 
    // send coockies

    const{email,username,password}=req.body

    if(!(email || username)){
        throw new apiError(400,"Username or email is requared")
    }

    const user=await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new apiError(404,"User does not existe")
    }

    const isPasswordVailid= await user.isPasswordCorrect(password)

    if(!isPasswordVailid){
        throw new apiError(401,"Inavailid user creadentials")
    }

    const {accessToken, refreshToken}= await generateAccessAndRefreshTokens(user._id)

    const LogdInUser= await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new apiResponse(
            200,
            {
                user:LogdInUser,refreshToken,accessToken
            },
            "User Logged in successfully "
        )
    )
})

// for log out user
const logOutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:true
            }
        },
        {
            new:true
        }
    )

    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options) // removed accessToken from here
    .clearCookie("refreshToken",options) // removed refreshToken from here
    .json(new apiResponse(200,{},"User Logged Out"))
})

export {registerUser,loginUser,logOutUser}
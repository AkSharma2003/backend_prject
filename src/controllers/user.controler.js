import {asyncHandler} from "../utils/asynchandler.js"
import {apiError} from "../utils/apiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js"

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

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // console.log(createdUser)
    if(!createdUser){
        throw new apiError(500, "somthing went wrong while registring the user")        
    }

    return res.status(201).json(
        new apiResponse(201, createdUser, "User created successfully")
    )

})

export {registerUser}
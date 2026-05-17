import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECET
});


const uploadOnCloudinary=async (localFilePath)=>{
    try {
        if(!localFilePath) return null
        //upload file On Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        //file has been upload successfully
        // console.log("file upload successfully on cloudinary",response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.log("!! cloudenary error !!")
        fs.unlinkSync(localFilePath)
        return null
    }
}

export {uploadOnCloudinary}
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: 'CLOUDINARY_NAME', 
  api_key: 'CLOUDINARY_API_KEY', 
  api_secret: 'CLOUDINARY_API_SECET'
});


const uploadOnCloudinary=async (localFilePath)=>{
    try {
        if(!localFilePath) return null
        //upload file On Cloudinary
        const response=await cloudinary.uploader.upload
        (localFilePath,
            {
                resource_type:"auto"
        })
        //file has been upload successfully
        console.log("file upload successfully on cloudinary",
            response.url
        );
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // removed the localy saved temprary file as the upload operation got failed
        return null
    }
}

export {uploadOnCloudinary}
import mongoose,{model, Schema} from "mongoose";

const subsciptionSchima=new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true})


export const Subsciption =mongoose.model("Subscription",subsciptionSchima)
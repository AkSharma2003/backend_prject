import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const vidioSchema= new Schema(
    {
        vidioFile:{
            type:String, //coudenary url
            required:true
        },
        thumbnail:{
            type:String, //coudenary url
            required:true
        },
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        duration:{
            type:Number, //cloudenary url
            required:true
        },
        views:{
            tye:Number,
            default:0
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User" 
        }
    },{timestamps:true}
)

vidioSchema.plugin(mongooseAggregatePaginate)
export const Vidio=mongoose.model("Vidio",vidioSchema)
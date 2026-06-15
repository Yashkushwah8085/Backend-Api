import mongoose from "mongoose";

const mailSchema = new mongoose.Schema(
{
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"UserCollection"
  },

  to:String,
  subject:String,

  status:{
    type:String,
    default:"sent"
  }
},
{
  timestamps:true
});

export default mongoose.model(
  "Mail",
  mailSchema
);
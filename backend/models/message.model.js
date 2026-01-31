import mongoose from "mongoose";

const messageSchema= new mongoose.Schema({
  senderId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiverId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message:{
    type: String,
  },
  voiceNote:{
    type: String, // Base64 encoded audio data - max 5MB
    maxlength: 5000000 // ~5MB in Base64
  },
  isVoiceNote:{
    type: Boolean,
    default: false,
    index: true
  }
},{timestamps:true});

const Message=mongoose.model("Message",messageSchema);
export default Message;

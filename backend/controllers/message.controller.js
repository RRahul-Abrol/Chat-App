import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { io, getReceiverSocketId } from "../socket/socket.js";
export const sendMessage=async (req,res)=>{
  try {
    const { message, voiceNote, isVoiceNote } = req.body;
    const { id:receiverId } = req.params;
    const senderId = req.user._id;

    // Validate voice note size (max 5MB)
    if (isVoiceNote && voiceNote) {
      const voiceNoteSize = Buffer.byteLength(voiceNote, 'utf8');
      if (voiceNoteSize > 5000000) { // 5MB limit
        return res.status(400).json({ error: "Voice note too large. Max size is 5MB" });
      }
    }

    // Validate that message or voice note is provided
    if (!message && !voiceNote) {
      return res.status(400).json({ error: "Message or voice note is required" });
    }

    let conversation=await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      });
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      message: isVoiceNote ? undefined : message,
      voiceNote: isVoiceNote ? voiceNote : undefined,
      isVoiceNote: isVoiceNote || false,
    });

    if (newMessage){
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);
    
    const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

    res.status(201).json({ newMessage });
  } catch (error) {
    console.log("Error in sendMessage controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessages=async(req,res)=>{
  try {
    const{id:userToChatId}= req.params;
    const senderId=req.user._id;

    const conversation=await Conversation.findOne({participants: { $all:[senderId, userToChatId]},}).populate("messages");
    if(!conversation) return res.status(200).json([]);
    const messages=conversation.messages;
    res.status(200).json(messages);
    } catch (error) {
    console.log("Error in getMessages controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
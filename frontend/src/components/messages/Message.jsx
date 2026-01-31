import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import { extractTime } from "../../utils/extractTime";
import { useState } from "react";

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	const [isPlaying, setIsPlaying] = useState(false);
	
	// Ensure IDs compare correctly whether they are strings or ObjectIds
	const fromMe = String(message.senderId) === String(authUser._id);
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
	const bubbleBgColor = fromMe ? "bg-blue-500" : "";

	const shakeClass = message.shouldShake ? "shake" : "";

	const handlePlayVoiceNote = () => {
		if (message.voiceNote) {
			const audio = new Audio(message.voiceNote);
			audio.play();
			setIsPlaying(true);
			audio.onended = () => setIsPlaying(false);
		}
	};

	return (
		<div className={`chat ${chatClassName}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img alt='Tailwind CSS chat bubble component' src={profilePic} />
				</div>
			</div>
			<div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>
				{message.isVoiceNote ? (
					<div className='flex items-center gap-2'>
						<button
							onClick={handlePlayVoiceNote}
							className='flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-white/30'
						>
							<span className='text-lg'>{isPlaying ? "⏸" : "▶"}</span>
						</button>
						<span className='text-sm'>Voice Note</span>
					</div>
				) : (
					message.message
				)}
			</div>
			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>{formattedTime}</div>
		</div>
	);
};
export default Message;
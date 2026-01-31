import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	const sendMessage = async (message, voiceData = null, isVoiceNote = false) => {
		setLoading(true);
		try {
			const payload = isVoiceNote
				? { voiceNote: voiceData, isVoiceNote: true }
				: { message, isVoiceNote: false };

			const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			// backend returns { newMessage } — normalize to the message object
			const newMsg = data.newMessage || data;
			setMessages([...messages, newMsg]);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;
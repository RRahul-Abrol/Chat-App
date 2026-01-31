import { BsSend } from "react-icons/bs";
import { MdMic, MdStop } from "react-icons/md";
import useSendMessage from "../../hooks/useSendMessage";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const [isRecording, setIsRecording] = useState(false);
	const [recordingTime, setRecordingTime] = useState(0);
	const { loading, sendMessage } = useSendMessage();
	const mediaRecorderRef = useRef(null);
	const audioChunksRef = useRef([]);
	const recordingIntervalRef = useRef(null);
	const MAX_RECORDING_TIME = 60; // 60 seconds max

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			audioChunksRef.current = [];

			mediaRecorder.ondataavailable = (event) => {
				audioChunksRef.current.push(event.data);
			};

			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
				
				// Check file size (max 5MB)
				if (audioBlob.size > 5000000) {
					toast.error("Voice note too large. Maximum is 5MB");
					return;
				}

				const reader = new FileReader();
				reader.onload = async () => {
					await sendMessage("", reader.result, true);
				};
				reader.readAsDataURL(audioBlob);
				stream.getTracks().forEach((track) => track.stop());
				setRecordingTime(0);
			};

			mediaRecorder.start();
			setIsRecording(true);
			setRecordingTime(0);

			// Auto stop after max recording time
			recordingIntervalRef.current = setInterval(() => {
				setRecordingTime((prev) => {
					if (prev >= MAX_RECORDING_TIME) {
						mediaRecorder.stop();
						setIsRecording(false);
						toast.warning("Recording limit reached (60 seconds)");
						return 0;
					}
					return prev + 1;
				});
			}, 1000);
		} catch (error) {
			console.error("Error accessing microphone:", error);
			toast.error("Unable to access microphone");
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
			if (recordingIntervalRef.current) {
				clearInterval(recordingIntervalRef.current);
			}
			setRecordingTime(0);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message) return;
		await sendMessage(message, null, false);
		setMessage("");
	};

	return (
		<form className='px-4 my-3' onSubmit={handleSubmit}>
			<div className='w-full relative'>
				<input
					type='text'
					className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
					placeholder='Send a message'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					disabled={isRecording}
				/>
				<div className='absolute inset-y-0 end-0 flex items-center pe-3 gap-2'>
					{!isRecording ? (
						<button
							type='button'
							onClick={startRecording}
							className='flex items-center justify-center text-red-500 hover:text-red-600'
							title='Record voice note'
						>
							<MdMic size={20} />
						</button>
					) : (
						<>
							<span className='text-xs text-red-500 font-semibold'>{recordingTime}s</span>
							<button
								type='button'
								onClick={stopRecording}
								className='flex items-center justify-center text-red-600 animate-pulse'
								title='Stop recording'
							>
								<MdStop size={20} />
							</button>
						</>
					)}
					<button
						type='submit'
						className='flex items-center justify-center'
						disabled={isRecording}
					>
						{loading ? <div className="loading loading-spinner"></div> : <BsSend />}
					</button>
				</div>
			</div>
		</form>
	);
};
export default MessageInput;
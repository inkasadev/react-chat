import {
	CancelRounded,
	CheckCircleRounded,
	MicRounded,
	Send,
} from "@mui/icons-material";
import cs from "classnames";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import recordAudio from "../../helpers/recordAudio";
import { User } from "firebase/auth";
import { audioStorage, createTimestamp, db } from "../../firebase";
import {
	FirestoreError,
	collection,
	doc,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuid } from "uuid";

interface IChatFooterProps {
	input: string;
	image: File | null;
	user: User | null | undefined;
	room:
		| boolean
		| FirestoreError
		| {
				id: string;
				photoURL: any;
		  }
		| null
		| undefined;
	roomId: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	sendMessage: React.MouseEventHandler<HTMLButtonElement>;
	setAudioId: React.Dispatch<React.SetStateAction<string>>;
	className?: string;
}

export const ChatFooter = ({
	input,
	image,
	onChange,
	user,
	room,
	roomId,
	sendMessage,
	setAudioId,
	className,
}: IChatFooterProps) => {
	const [isRecording, setIsRecording] = useState(false);
	const [duration, setDuration] = useState("00:00");

	const inputRef = useRef<HTMLInputElement>(null);
	const recordingElRef = useRef<HTMLDivElement>(null);
	const recordRef = useRef<any>();
	const timerIntervalRef = useRef<any>();

	const startRecording = async (e: any) => {
		if (!inputRef.current) return;

		recordRef.current = await recordAudio();
		inputRef.current?.focus();
		// inputRef.current.style.width = "calc(100% - 56px)";
		setIsRecording(true);
		setAudioId("");

		e.preventDefault();
	};

	const startTimer = () => {
		const start = Date.now();
		timerIntervalRef.current = setInterval(setTime, 100);

		function setTime() {
			const timeElapsed = Date.now() - start;
			const totalSeconds = Math.floor(timeElapsed / 1000);
			const minutes = pad(parseInt((totalSeconds / 60).toString()));
			const seconds = pad(parseInt((totalSeconds % 60).toString()));
			const duration = `${minutes}:${seconds}`;
			setDuration(duration);
		}
	};

	function pad(value: number) {
		return String(value).length < 2 ? `0${value}` : value;
	}

	const stopRecording = async () => {
		inputRef.current?.focus();
		clearInterval(timerIntervalRef.current);
		setIsRecording(false);
		setDuration("00:00");

		const audio = recordRef.current.stop();
		return audio;
	};

	const finishRecording = async () => {
		const audio = await stopRecording();
		const { audioFile, audioName } = await audio;
		sendAudio(audioFile, audioName);
	};

	const handleAudioInputChange = (e: any) => {
		const files = e.target.files;
		if (!files) return;

		const audioFile = files[0];
		if (!audioFile) return;

		const audioName = uuid();
		sendAudio(audioFile, audioName);
	};

	const sendAudio = async (audioFile: any, audioName: string) => {
		// Create a new chat
		const userRef = doc(db, "users", user!.uid);
		const chatsRef = collection(userRef, "chats");
		const chatRef = doc(chatsRef, roomId);
		setDoc(
			chatRef,
			{
				/* @ts-ignore */
				name: room?.name,
				/* @ts-ignore */
				photoURL: room?.photoURL || null,
				timestamp: createTimestamp(),
			},
			{ merge: true },
		);

		// Create audio message
		const roomRef = doc(db, "rooms", roomId);
		const messagesRef = collection(roomRef, "messages");
		const messageRef = doc(messagesRef);
		await setDoc(messageRef, {
			name: user?.displayName,
			uid: user?.uid,
			timestamp: createTimestamp(),
			time: new Date().toUTCString(),
			audioName,
			audioUrl: "uploading",
		});

		// Upload audio file
		const storageRef = ref(audioStorage, audioName);
		const snapshot = await uploadBytes(storageRef, audioFile);
		const downloadURL = await getDownloadURL(snapshot.ref);
		updateDoc(messageRef, {
			audioUrl: downloadURL,
		});
	};

	const btnIcons = (
		<>
			<Send
				style={{
					width: 20,
					height: 20,
					color: "white",
				}}
				className={styles.chatFooterIcon}
			></Send>
			<MicRounded
				style={{
					width: 24,
					height: 24,
					color: "white",
				}}
				className={styles.chatFooterIcon}
			></MicRounded>
		</>
	);

	/* @ts-ignore */
	const canRecord = navigator.mediaDevices.getUserMedia && window.MediaRecorder;

	useEffect(() => {
		const el = recordingElRef.current;
		const record = recordRef.current;

		if (!isRecording || !el || !record) return;

		el.style.opacity = "1";
		startTimer();
		record.start();
	}, [isRecording]);

	return (
		<div className={cs(styles.footer, className)}>
			<form
				className={styles.form}
				onSubmit={(e) => {
					e.preventDefault();
				}}
			>
				<input
					type="text"
					placeholder="Type a message"
					className={styles.footerInput}
					value={input}
					onChange={!isRecording ? onChange : undefined}
					ref={inputRef}
				/>

				{canRecord ? (
					!isRecording && (
						<button
							type="submit"
							className={cs(styles.sendBtn)}
							onClick={
								input.trim() || (input === "" && image)
									? sendMessage
									: startRecording
							}
						>
							{btnIcons}
						</button>
					)
				) : (
					<>
						<label htmlFor="capture" className={styles.sendBtn}>
							{btnIcons}
						</label>
						<input
							type="file"
							accept="audio/*"
							id="capture"
							style={{ display: "none" }}
							capture
							onChange={handleAudioInputChange}
						/>
					</>
				)}
			</form>

			{isRecording && (
				<div className={styles.record} ref={recordingElRef}>
					<CancelRounded
						style={{
							width: 30,
							height: 30,
							color: "#f20519",
							cursor: "pointer",
						}}
						onClick={stopRecording}
					/>
					<div className={styles.recordInfoContainer}>
						<div className={styles.recordRedCircle}></div>
						<div className={styles.recordDuration}>{duration}</div>
					</div>
					<CheckCircleRounded
						style={{
							width: 30,
							height: 30,
							color: "#41bf49",
							cursor: "pointer",
						}}
						onClick={finishRecording}
					/>
				</div>
			)}
		</div>
	);
};

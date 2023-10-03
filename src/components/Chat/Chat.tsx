import { AddPhotoAlternate, ArrowBack, MoreVert } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import cs from "classnames";
import Compressor from "compressorjs";
import { User } from "firebase/auth";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { createTimestamp, db, storage } from "../../firebase";
import useRoom from "../../hooks/useRoom";
import useWindowSize from "../../hooks/useWindowSize";
import { ChatFooter } from "../ChatFooter";
import { ChatMessages } from "../ChatMessages";
import { MediaPreview } from "../MediaPreview";
import styles from "./styles.module.css";
import useChatMessages from "../../hooks/useChatMessages";

interface IChatProps {
	user: User | null | undefined;
	className?: string;
}

export const Chat = ({ user, className }: IChatProps) => {
	const { roomId } = useParams();
	const page = useWindowSize();
	const navigate = useNavigate();
	const [image, setImage] = useState<File | null>(null);
	const [input, setInput] = useState("");
	const [src, setSrc] = useState("");
	const [audioId, setAudioId] = useState("");

	if (!roomId) return null;

	const [room] = useRoom(roomId as string, user?.uid as string);
	const [messages] = useChatMessages(roomId as string);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
		e.preventDefault();
	};

	const sendMessage = async (e: any) => {
		if (input.trim() || (input === "" && image)) {
			setInput("");

			if (image) {
				hidePreview();
			}

			const imageName = uuid();
			const newMessage = image
				? {
						name: user?.displayName,
						message: input,
						uid: user?.uid,
						timestamp: createTimestamp(),
						time: new Date().toUTCString(),
						imageUrl: "uploading",
						imageName,
				  }
				: {
						name: user?.displayName,
						message: input,
						uid: user?.uid,
						timestamp: createTimestamp(),
						time: new Date().toUTCString(),
				  };

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

			const roomRef = doc(db, "rooms", roomId);
			const messagesRef = collection(roomRef, "messages");
			const messageRef = doc(messagesRef);
			await setDoc(messageRef, newMessage);

			if (image) {
				new Compressor(image, {
					quality: 0.8,
					maxWidth: 1920,
					async success(result) {
						setSrc("");
						setImage(null);

						const storageRef = ref(storage, imageName);
						const snapshot = await uploadBytes(storageRef, result);
						const downloadURL = await getDownloadURL(snapshot.ref);
						updateDoc(messageRef, {
							imageUrl: downloadURL,
						});
					},
				});
			}
		}

		e.preventDefault();
	};

	const showPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setImage(file);

		const reader = new FileReader();
		reader.onload = (e) => {
			setSrc(e.target?.result as string);
		};
		reader.readAsDataURL(file);
	};

	const hidePreview = () => {
		setImage(null);
		setSrc("");
	};

	return (
		<div className={cs(styles.chat, className)}>
			<div className={styles.chatBackground} style={{ height: page.height }} />

			<div className={styles.header}>
				{page.isMobile && (
					<IconButton onClick={() => navigate(-1)}>
						<ArrowBack />
					</IconButton>
				)}

				<div className={styles.avatarContainer}>
					{/* @ts-ignore */}
					<Avatar src={room?.photoURL} />
				</div>

				<div className={styles.headerInfo}>
					{/* <h3 style={{ width: page.isMobile && page.width - 165 }}> */}
					<h3>
						{/* @ts-ignore */}
						{room?.name}
					</h3>
				</div>

				<div className={styles.headerRight}>
					<input
						id="image"
						style={{ display: "none" }}
						accept="image/*"
						type="file"
						onChange={showPreview}
					/>

					<IconButton>
						<label style={{ cursor: "pointer", height: 24 }} htmlFor="image">
							<AddPhotoAlternate className={styles.headerRightIcon} />
						</label>
					</IconButton>
					{/* <IconButton onClick={(event) => setOpenMenu(event.currentTarget)}></IconButton> */}
					<IconButton>
						<MoreVert className={styles.headerRightIcon} />
					</IconButton>
					{/*
					<Menu id="menu" open={true} keepMounted>
						<MenuItem>Delete Room</MenuItem>
					</Menu>
					*/}
				</div>
			</div>

			<div className={styles.bodyContainer}>
				{/* <div className="chat__body" style={{ height: page.height - 68 }}> */}
				<div className={styles.body}>
					<ChatMessages
						messages={messages as any[]}
						user={user}
						roomId={roomId}
						audioId={audioId}
						setAudioId={setAudioId}
					/>
				</div>
			</div>

			<MediaPreview src={src} hidePreview={hidePreview} />

			<ChatFooter
				input={input}
				onChange={onChange}
				sendMessage={sendMessage}
				image={image}
				setAudioId={setAudioId}
				user={user}
				room={room}
				roomId={roomId}
			/>
		</div>
	);
};

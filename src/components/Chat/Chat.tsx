import { AddPhotoAlternate, ArrowBack, MoreVert } from "@mui/icons-material";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import cs from "classnames";
import Compressor from "compressorjs";
import { User } from "firebase/auth";
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytes,
} from "firebase/storage";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { audioStorage, createTimestamp, db, storage } from "../../firebase";
import useChatMessages from "../../hooks/useChatMessages";
import useRoom from "../../hooks/useRoom";
import useWindowSize from "../../hooks/useWindowSize";
import { ChatFooter } from "../ChatFooter";
import { ChatMessages } from "../ChatMessages";
import { MediaPreview } from "../MediaPreview";
import { Spinner } from "../Spinner";
import styles from "./styles.module.css";

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
	const [openMenu, setOpenMenu] = useState<null | HTMLElement>(null);
	const [isDeleting, setIsDeleting] = useState(false);
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

	const deleteRoom = async () => {
		setOpenMenu(null);
		setIsDeleting(true);

		try {
			const roomRef = doc(db, "rooms", roomId);
			const messagesRef = collection(roomRef, "messages");
			const roomMessages = await getDocs(messagesRef);

			const userRef = doc(db, "users", user!.uid);
			const chatsRef = collection(userRef, "chats");
			const chatRef = doc(chatsRef, roomId);

			const audioFiles: any[] = [];
			const imageFiles: any[] = [];

			roomMessages.forEach((message) => {
				const { audioName, imageName } = message.data();

				if (audioName) {
					audioFiles.push(audioName);
				}

				if (imageName) {
					imageFiles.push(imageName);
				}
			});

			await Promise.all([
				...roomMessages.docs.map((message) => deleteDoc(message.ref)),
				...audioFiles.map((audioName) =>
					deleteObject(ref(audioStorage, audioName)),
				),
				...imageFiles.map((imageName) => deleteObject(ref(storage, imageName))),
				deleteDoc(chatRef),
				deleteDoc(roomRef),
			]);
		} catch (error) {
			console.log("Error while deleting room: ", error);
		} finally {
			setIsDeleting(false);
			navigate(-1);
		}
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
					<IconButton onClick={(e) => setOpenMenu(e.currentTarget)}>
						<MoreVert className={styles.headerRightIcon} />
					</IconButton>
					<Menu
						id="menu"
						anchorEl={openMenu}
						open={Boolean(openMenu)}
						onClose={() => setOpenMenu(null)}
						keepMounted
					>
						<MenuItem onClick={deleteRoom}>Delete Room</MenuItem>
					</Menu>
				</div>
			</div>

			<div className={styles.bodyContainer}>
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

			{isDeleting && (
				<div className={styles.deleting}>
					<Spinner />
				</div>
			)}
		</div>
	);
};

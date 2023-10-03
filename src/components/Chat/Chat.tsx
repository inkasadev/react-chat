import { AddPhotoAlternate, ArrowBack, MoreVert } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import cs from "classnames";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useRoom from "../../hooks/useRoom";
import useWindowSize from "../../hooks/useWindowSize";
import { ChatMessages } from "../ChatMessages";
import { MediaPreview } from "../MediaPreview";
import styles from "./styles.module.css";
import { ChatFooter } from "../ChatFooter";

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
	if (!roomId) return null;

	const [room] = useRoom(roomId as string, user?.uid as string);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
	};

	const sendMessage = () => {};

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
					<ChatMessages />
				</div>
			</div>

			<MediaPreview src={src} hidePreview={hidePreview} />

			<ChatFooter />
		</div>
	);
};

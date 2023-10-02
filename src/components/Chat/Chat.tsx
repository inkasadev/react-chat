import { AddPhotoAlternate, ArrowBack, MoreVert } from "@mui/icons-material";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import cs from "classnames";
import { User } from "firebase/auth";
import useWindowSize from "../../hooks/useWindowSize";
import { useParams } from "react-router-dom";
import useRoom from "../../hooks/useRoom";
import styles from "./styles.module.css";
import { ChatMessages } from "../ChatMessages";

interface IChatProps {
	user: User | null | undefined;
	className?: string;
}

export const Chat = ({ user, className }: IChatProps) => {
	const { roomId } = useParams();
	const page = useWindowSize();
	if (!roomId) return null;

	const [room] = useRoom(roomId as string, user?.uid as string);

	console.log("rooms => ", room);

	return (
		<div className={cs(styles.chat, className)}>
			<div className={styles.chatBackground} style={{ height: page.height }} />

			<div className={styles.header}>
				{page.isMobile && (
					<IconButton>
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
					{/* <input
						id="image"
						style={{ display: "none" }}
						accept="image/*"
						type="file"
				/> */}
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
		</div>
	);
};

import {
	Add,
	ExitToApp,
	Home,
	Message,
	PeopleAlt,
	SearchOutlined,
} from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import cs from "classnames";
import { User } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { auth, createTimestamp, db } from "../../firebase";
import useChats from "../../hooks/useChats";
import useRooms from "../../hooks/useRooms";
import useUsers from "../../hooks/useUsers";
import useWindowSize from "../../hooks/useWindowSize";
import { SidebarList } from "../SidebarList";
import styles from "./styles.module.css";

interface ISidebarProps {
	user: User | null | undefined;
	className?: string;
}

export const Sidebar = ({ user, className }: ISidebarProps) => {
	const [rooms] = useRooms();
	const [menu, setMenu] = useState(1);
	const page = useWindowSize();
	const [users] = useUsers(user as User);
	const [chats] = useChats(user as User);

	const handleSignOut = () => {
		auth.signOut();
	};

	const createRoom = async () => {
		const roomName = prompt("Enter room name");
		if (roomName?.trim()) {
			const roomsRef = await collection(db, "rooms");
			await setDoc(doc(roomsRef), {
				name: roomName,
				timestamp: createTimestamp(),
			});
		}
	};

	return (
		<div className={cs(styles.sidebar, className)}>
			<div className={styles.header}>
				<div className={styles.headerLeft}>
					<Avatar src={user?.photoURL as string} />
					<h2 className={styles.name}>{user?.displayName}</h2>
				</div>
				<div className={styles.headerRight}>
					<IconButton onClick={handleSignOut}>
						<ExitToApp className={styles.exitToAppIcon} />
					</IconButton>
				</div>
			</div>
			<div className={styles.search}>
				<form className={styles.searchContainer}>
					<SearchOutlined className={styles.searchIcon} />
					<input
						type="text"
						placeholder="Search for users or rooms"
						id="search"
						className={styles.searchInput}
					/>
				</form>
			</div>
			<div className={styles.menu}>
				<NavLink
					to="/chats"
					className={cs({
						[styles.menuSelected]: menu === 1,
					})}
					onClick={() => setMenu(1)}
				>
					<div className={styles.menuHome}>
						<Home className={styles.menuIcon} />
						<div className={styles.menuLine}></div>
					</div>
				</NavLink>
				<NavLink
					to="/rooms"
					className={cs({
						[styles.menuSelected]: menu === 2,
					})}
					onClick={() => setMenu(2)}
				>
					<div className={styles.menuRooms}>
						<Message className={styles.menuIcon} />
						<div className={styles.menuLine}></div>
					</div>
				</NavLink>
				<NavLink
					to="/users"
					className={cs({
						[styles.menuSelected]: menu === 3,
					})}
					onClick={() => setMenu(3)}
				>
					<div className={styles.menuUsers}>
						<PeopleAlt className={styles.menuIcon} />
						<div className={styles.menuLine}></div>
					</div>
				</NavLink>
			</div>

			{page.isMobile && (
				<Routes>
					<Route
						path="/chats"
						element={<SidebarList title="Chats" data={chats as any[]} />}
					/>
					<Route
						path="/rooms"
						element={<SidebarList title="Rooms" data={rooms as any[]} />}
					/>
					<Route
						path="/users"
						element={<SidebarList title="Users" data={users as any[]} />}
					/>
					<Route
						path="/search"
						element={<SidebarList title="Search Results" data={[]} />}
					/>
				</Routes>
			)}

			{!page.isMobile && menu === 1 && (
				<SidebarList title="Chats" data={chats as any[]} />
			)}
			{!page.isMobile && menu === 2 && (
				<SidebarList title="Rooms" data={rooms as any[]} />
			)}
			{!page.isMobile && menu === 3 && (
				<SidebarList title="Users" data={users as any[]} />
			)}
			{!page.isMobile && menu === 4 && (
				<SidebarList title="Search Results" data={[]} />
			)}

			<div className={styles.chatAddRoom}>
				<IconButton
					className={styles.chatAddRoomButton}
					onClick={() => createRoom()}
				>
					<Add className={styles.addIcon} />
				</IconButton>
			</div>
		</div>
	);
};

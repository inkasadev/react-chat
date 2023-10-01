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
import {
	collection,
	doc,
	getDocs,
	query,
	setDoc,
	where,
} from "firebase/firestore";
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
	const [search, setSearch] = useState("");
	const [searchResults, setSearchResults] = useState<any[]>([]);

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

	const searchUserAndRooms = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// const searchInput = document.getElementById("search") as HTMLInputElement;
		const value = search.trim();
		const usersRef = await collection(db, "users");
		const roomsRef = await collection(db, "rooms");
		const q1 = query(usersRef, where("name", "==", value));
		const q2 = query(roomsRef, where("name", "==", value));
		const userSnapshot = await getDocs(q1);
		const roomSnapshot = await getDocs(q2);

		const userResults = userSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		const roomResults = roomSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		const results = [...userResults, ...roomResults];
		console.log("results => ", results);
		setMenu(4);
		setSearchResults(results);
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
				<form onSubmit={searchUserAndRooms} className={styles.searchContainer}>
					<SearchOutlined className={styles.searchIcon} />
					<input
						type="text"
						placeholder="Search for users or rooms"
						id="search"
						className={styles.searchInput}
						onChange={(e) => setSearch(e.target.value)}
						value={search}
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
						element={
							<SidebarList title="Search Results" data={searchResults} />
						}
					/>
					<Route path="*" element={<p>Path not resolved 2</p>} />
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
				<SidebarList title="Search Results" data={searchResults} />
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

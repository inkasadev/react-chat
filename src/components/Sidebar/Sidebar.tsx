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
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { auth } from "../../firebase";
import useWindowSize from "../../hooks/useWindowSize";
import styles from "./styles.module.css";
import { Route, Routes } from "react-router-dom";

interface ISidebarProps {
	user: User | null | undefined;
	className?: string;
}

export const Sidebar = ({ user, className }: ISidebarProps) => {
	const [menu, setMenu] = useState(1);
	const page = useWindowSize();
	/*
    const Nav = page.isMobile
		? NavLink
		: ({ activeClass, onClick, children }: any) => (
				<div
					className={cs({
						[styles.menuSelected]: activeClass,
					})}
					onClick={onClick}
				>
					{children}
				</div>
		  );
    */

	const handleSignOut = () => {
		auth.signOut();
	};

	const createRoom = () => {};

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
					<Route path="/chats" element={<div>Chats</div>} />
					<Route path="/rooms" element={<div>Rooms</div>} />
					<Route path="/users" element={<div>Users</div>} />
					<Route path="/search" element={<div>Search</div>} />
				</Routes>
			)}

			{!page.isMobile && menu === 1 && <div>Chats</div>}
			{!page.isMobile && menu === 2 && <div>Rooms</div>}
			{!page.isMobile && menu === 3 && <div>Users</div>}

			<div className={styles.chatAddRoom}>
				<IconButton className={styles.chatAddRoomButton} onClick={createRoom}>
					<Add className={styles.addIcon} />
				</IconButton>
			</div>
		</div>
	);
};

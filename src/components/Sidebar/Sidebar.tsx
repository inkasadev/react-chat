import { Add, ExitToApp, SearchOutlined } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import cs from "classnames";
import { User } from "firebase/auth";
import { auth } from "../../firebase";
import styles from "./styles.module.css";

interface ISidebarProps {
	user: User | null | undefined;
	className?: string;
}

export const Sidebar = ({ user, className }: ISidebarProps) => {
	const handleSignOut = () => {
		auth.signOut();
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
			<div className={styles.chatAddRoom}>
				<IconButton className={styles.chatAddRoomButton}>
					<Add className={styles.addIcon} />
				</IconButton>
			</div>
		</div>
	);
};

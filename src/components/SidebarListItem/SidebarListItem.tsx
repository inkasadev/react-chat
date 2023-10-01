import React from "react";
import cs from "classnames";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";

interface ISidebarListProps {
	item: any;
	className?: string;
}

export const SidebarListItem = ({ item, className }: ISidebarListProps) => {
	return (
		<Link
			to={`/rooms/${item.id}`}
			className={cs(styles.sidebarListItem, className)}
		>
			<div className={styles.chat}>
				<div className={styles.container}>
					<Avatar
						style={{ width: 45, height: 45 }}
						src={
							item.photoURL ||
							`	https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${item.id}`
						}
					/>
				</div>
				<div className={styles.info}>
					<h2 className={styles.itemName}>{item.name}</h2>
				</div>
			</div>
		</Link>
	);
};

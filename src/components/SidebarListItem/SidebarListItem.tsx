import React from "react";
import cs from "classnames";
import styles from "./styles.module.css";

interface ISidebarListProps {
	className?: string;
}

export const SidebarListItem = ({ className }: ISidebarListProps) => {
	return (
		<div className={cs(styles.sidebarListItem, className)}>SidebarListItem</div>
	);
};

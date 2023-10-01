import cs from "classnames";
import styles from "./styles.module.css";

interface ISidebarListProps {
	className?: string;
}

export const SidebarList = ({ className }: ISidebarListProps) => {
	return <div className={cs(styles.sidebarList, className)}>SidebarList</div>;
};

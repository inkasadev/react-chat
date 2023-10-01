import cs from "classnames";
import styles from "./styles.module.css";

interface ISidebarListProps {
	title: string;
	data: any[];
	className?: string;
}

export const SidebarList = ({ title, data, className }: ISidebarListProps) => {
	return <div className={cs(styles.sidebarList, className)}>SidebarList</div>;
};

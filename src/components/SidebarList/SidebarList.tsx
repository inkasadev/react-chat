import cs from "classnames";
import styles from "./styles.module.css";
import { SearchOutlined, CancelOutlined } from "@mui/icons-material";
import { Spinner } from "../Spinner";
import { SidebarListItem } from "../SidebarListItem";

interface ISidebarListProps {
	title: string;
	data: any[] | undefined;
	className?: string;
}

export const SidebarList = ({ title, data, className }: ISidebarListProps) => {
	if (!data) {
		return <Spinner />;
	}

	if (data.length === 0 && title === "Search Results") {
		return (
			<div className={styles.noResult}>
				<div>
					<SearchOutlined />
					<div className={styles.cancelRoot}>
						<CancelOutlined />
					</div>
				</div>
				<h3>No {title}</h3>
			</div>
		);
	}

	return (
		<div className={cs(styles.sidebarList, className)}>
			<h2 className={styles.title}>{title}</h2>
			{data.map((item) => (
				<SidebarListItem key={item.id} item={item} />
			))}
		</div>
	);
};

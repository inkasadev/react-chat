import cs from "classnames";
import styles from "./styles.module.css";

interface IMediaPreviewProps {
	className?: string;
}

export const MediaPreview = ({ className }: IMediaPreviewProps) => {
	return <div className={cs(styles.mediaPreview, className)}>MediaPreview</div>;
};

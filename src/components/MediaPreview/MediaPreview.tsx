import { CloseRounded } from "@mui/icons-material";
import cs from "classnames";
import styles from "./styles.module.css";

interface IMediaPreviewProps {
	src: string;
	hidePreview?: () => void;
	className?: string;
}

export const MediaPreview = ({
	src,
	hidePreview,
	className,
}: IMediaPreviewProps) => {
	if (!src) return null;
	return (
		<div className={cs(styles.mediaPreview, className)}>
			<CloseRounded onClick={hidePreview} className={styles.closeRoundedIcon} />
			<img src={src} alt="Preview" />
		</div>
	);
};

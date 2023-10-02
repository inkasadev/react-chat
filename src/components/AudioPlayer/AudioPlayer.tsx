import cs from "classnames";
import styles from "./styles.module.css";

interface IAudioPlayerProps {
	className?: string;
}

export const AudioPlayer = ({ className }: IAudioPlayerProps) => {
	return <div className={cs(styles.audioPlayer, className)}>AudioPlayer</div>;
};

import cs from "classnames";
import styles from "./styles.module.css";

interface IChatFooterProps {
	className?: string;
}

export const ChatFooter = ({ className }: IChatFooterProps) => {
	return <div className={cs(styles.chatFooter, className)}>ChatFooter</div>;
};

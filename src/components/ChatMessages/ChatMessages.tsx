import cs from "classnames";
import styles from "./styles.module.css";

interface IChatMessagesProps {
	className?: string;
}

export const ChatMessages = ({ className }: IChatMessagesProps) => {
	return <div className={cs(styles.chatMessages, className)}>ChatMessages</div>;
};

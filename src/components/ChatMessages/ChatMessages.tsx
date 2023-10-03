import cs from "classnames";
import styles from "./styles.module.css";
import { User } from "firebase/auth";
import { AudioPlayer } from "../AudioPlayer";
import { Spinner } from "../Spinner";

interface IChatMessagesProps {
	messages: any[];
	user: User | null | undefined;
	roomId: string;
	className?: string;
}

export const ChatMessages = ({
	messages,
	user,
	roomId,
	className,
}: IChatMessagesProps) => {
	if (!messages) return null;

	return (
		<div className={styles.messagesContainer}>
			{messages.map((message) => {
				const isUser = user?.uid === message.uid;

				return (
					<div
						key={message.id}
						className={cs(
							styles.messageContainer,
							{
								[styles.messageFromUser]: isUser,
								// [styles.messageOther]: !isUser,
							},
							className,
						)}
					>
						<span className={styles.name}>{message.name}</span>

						{message.imageUrl === "uploading" ? (
							<div className={styles.imageContainer}>
								<div className={styles.loaderContainer}>
									<Spinner
										style={{
											width: 30,
											height: 30,
											border: "5px solid #06d755",
											borderBottomColor: "transparent",
										}}
									/>
								</div>
							</div>
						) : message.imageUrl ? (
							<div className={styles.imageContainer}>
								<img
									src={message.imageUrl}
									alt={message.name}
									className={styles.image}
								/>
							</div>
						) : null}

						{message.audioName ? (
							<AudioPlayer />
						) : (
							<span className={styles.message}>{message.message}</span>
						)}

						<span className={styles.timestamp}>{message.time}</span>
					</div>
				);
			})}
		</div>
	);
};

import {
	CancelRounded,
	CheckCircleRounded,
	MicRounded,
	Send,
} from "@mui/icons-material";
import cs from "classnames";
import { useState } from "react";
import styles from "./styles.module.css";

interface IChatFooterProps {
	className?: string;
}

export const ChatFooter = ({ className }: IChatFooterProps) => {
	const [isRecording, setIsRecording] = useState(false);

	const btnIcons = (
		<>
			<Send
				style={{
					width: 20,
					height: 20,
					color: "white",
				}}
				className={styles.chatFooterIcon}
			></Send>
			<MicRounded
				style={{
					width: 24,
					height: 24,
					color: "white",
				}}
				className={styles.chatFooterIcon}
			></MicRounded>
		</>
	);

	const canRecord = navigator.mediaDevices.getUserMedia && window.MediaRecorder;

	return (
		<div className={cs(styles.footer, className)}>
			<form className={styles.form}>
				<input
					type="text"
					placeholder="Type a message"
					className={styles.footerInput}
				/>

				{canRecord ? (
					<button type="submit" className={styles.sendBtn}>
						{btnIcons}
					</button>
				) : (
					<>
						<label htmlFor="capture" className={styles.sendBtn}>
							{btnIcons}
						</label>
						<input
							type="file"
							accept="audio/*"
							id="capture"
							style={{ display: "none" }}
							capture
						/>
					</>
				)}
			</form>

			{isRecording && (
				<div className={styles.record}>
					<CancelRounded
						style={{
							width: 30,
							height: 30,
							color: "#f20519",
						}}
					/>
					<div>
						<div className={styles.recordRedCircle}></div>
						<div className={styles.recordDuration}></div>
					</div>
					<CheckCircleRounded
						style={{
							width: 30,
							height: 30,
							color: "#41bf49",
						}}
					/>
				</div>
			)}
		</div>
	);
};

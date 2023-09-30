import React from "react";
import { useParams } from "react-router-dom";
import cs from "classnames";
import styles from "./styles.module.css";
import { User } from "firebase/auth";

interface IChatProps {
	user: User | null | undefined;
	className?: string;
}

export const Chat = ({ user, className }: IChatProps) => {
	return <div className={cs(styles.chat, className)}>Chat</div>;
};

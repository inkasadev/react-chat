import Button from "@mui/material/Button";
import cs from "classnames";
import { signInWithRedirect } from "firebase/auth";
import { auth, provider } from "../../vendor/firebase";
import styles from "./styles.module.css";

interface ILoginProps {
	className?: string;
}

export const Login = ({ className }: ILoginProps) => {
	const handleLogin = () => {
		signInWithRedirect(auth, provider);
	};

	return (
		<div className={cs(styles.container, className)}>
			<div className={styles.login}>
				<div className={styles.loginContainer}>
					<div>
						<img
							src="./assets/wp-logo-large.png"
							alt="Xatty Logo"
							className={styles.logo}
						/>
					</div>
					<div>
						<h1 className={styles.loginText}>Sign in to Xatty</h1>
					</div>
					<Button onClick={handleLogin} className={styles.button}>
						Sign in with Google
					</Button>
				</div>
			</div>
		</div>
	);
};

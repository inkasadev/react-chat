import Button from "@mui/material/Button";
import cs from "classnames";
import styles from "./styles.module.css";
import { auth, provider } from "../../firebase";
import { signInWithRedirect } from "firebase/auth";

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
              alt="Whatsapp Logo"
              className={styles.logo}
            />
          </div>
          <div>
            <h1 className={styles.loginText}>Sign in to Whatsapp</h1>
          </div>
          <Button onClick={handleLogin} className={styles.button}>
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

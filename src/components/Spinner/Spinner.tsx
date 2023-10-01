import cs from "classnames";
import styles from "./styles.module.css";

interface ISpinnerProps {
	className?: string;
}

export const Spinner = ({ className }: ISpinnerProps) => {
	return (
		<div className={cs(styles.spinner, className)}>
			<div className={styles.loader}></div>
		</div>
	);
};

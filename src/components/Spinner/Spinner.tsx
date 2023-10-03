import cs from "classnames";
import styles from "./styles.module.css";

interface ISpinnerProps {
	style: React.CSSProperties;
	className?: string;
}

export const Spinner = ({ style, className }: ISpinnerProps) => {
	return (
		<div className={cs(styles.spinner, className)}>
			<div style={style} className={styles.loader}></div>
		</div>
	);
};

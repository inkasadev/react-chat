import { User } from "firebase/auth";
import { Route, Routes } from "react-router-dom";
import styles from "./App.module.css";
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";
import { Sidebar } from "./components/Sidebar";
import { Spinner } from "./components/Spinner";
import useAuthUser from "./hooks/useAuthUser";

function App() {
	const [user, loading] = useAuthUser();

	if (loading)
		return (
			<div className={styles.app}>
				<Spinner />
			</div>
		);

	if (!user) return <Login />;

	return (
		<div className={styles.app}>
			<Sidebar user={user as User} />
			<Routes>
				<Route path="/room/:roomId" element={<Chat user={user as User} />} />{" "}
				<Route path="*" element={null} />
			</Routes>
		</div>
	);
}

export default App;

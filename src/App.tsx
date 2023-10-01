import { User } from "firebase/auth";
import { Navigate, Route, Routes } from "react-router-dom";
import styles from "./App.module.css";
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";
import { Sidebar } from "./components/Sidebar";
import { Spinner } from "./components/Spinner";
import useAuthUser from "./hooks/useAuthUser";
import useWindowSize from "./hooks/useWindowSize";

function App() {
	const [user, loading] = useAuthUser();
	const page = useWindowSize();

	if (loading)
		return (
			<div className={styles.app}>
				<Spinner />
			</div>
		);

	if (!user) return <Login />;

	return (
		<div className={styles.app}>
			{/* <Navigate to={page.isMobile ? "/chats" : "/"} replace={true} /> */}
			<Sidebar user={user as User} />
			<Routes>
				<Route path="/room/:roomId" element={<Chat user={user as User} />} />
			</Routes>
		</div>
	);
}

export default App;

// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";

import { User } from "firebase/auth";
import { Route, Routes, Navigate } from "react-router-dom";
import styles from "./App.module.css";
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";
import { Sidebar } from "./components/Sidebar";
import useAuthUser from "./hooks/useAuthUser";
import useWindowSize from "./hooks/useWindowSize";

function App() {
	const [user, loading] = useAuthUser();
	const page = useWindowSize();

	if (loading) return <div>LOADING...</div>;

	if (!user) return <Login />;

	console.log("user => ", user);

	return (
		<div className={styles.app}>
			<Navigate to={page.isMobile ? "/chats" : "/"} />
			<Sidebar user={user as User} />
			<Routes>
				<Route path="/room/:roomId" element={<Chat user={user as User} />} />
				<Route path="/rooms" element={<div>Rooms</div>} />
			</Routes>
		</div>
	);
}

export default App;

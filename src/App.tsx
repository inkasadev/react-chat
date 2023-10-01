// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";

import { User } from "firebase/auth";
import { Route, Routes, Navigate, redirect } from "react-router-dom";
import styles from "./App.module.css";
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";
import { Sidebar } from "./components/Sidebar";
import useAuthUser from "./hooks/useAuthUser";
import useWindowSize from "./hooks/useWindowSize";
import { useEffect } from "react";

function App() {
	const [user, loading] = useAuthUser();
	const page = useWindowSize();

	if (loading) return <div>LOADING...</div>;

	if (!user) return <Login />;

	console.log("user => ", user);

	return (
		<div className={styles.app}>
			<Navigate to={page.isMobile ? "/chats" : "/"} replace={true} />
			<Sidebar user={user as User} />
			<Routes>
				<Route path="/room/:roomId" element={<Chat user={user as User} />} />
			</Routes>
		</div>
	);
}

export default App;

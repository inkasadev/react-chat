// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";

import "./App.css";
import { Login } from "./components/Login";
import useAuthUser from "./hooks/useAuthUser";

function App() {
  const [user, loading] = useAuthUser();

  if (loading) return <div>LOADING...</div>;

  if (!user) return <Login />;

  console.log("user => ", user);

  return <div>FUNFOU!!!</div>;
}

export default App;

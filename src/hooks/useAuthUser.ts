import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, createTimestamp, db } from "../vendor/firebase";

const useAuthUser = () => {
	const [user, loading] = useAuthState(auth);

	useEffect(() => {
		if (loading) return;

		const fetchUserData = async () => {
			const userRef = doc(db, "users", user!.uid);
			const userSnap = await getDoc(userRef);

			if (!userSnap.exists()) {
				setDoc(userRef, {
					photoURL: user!.photoURL,
					name: user!.displayName,
					timestamp: createTimestamp(),
				});
			}
		};

		if (user) {
			fetchUserData();
			return;
		}
	}, [user, loading]);

	return [user, loading];
};

export default useAuthUser;

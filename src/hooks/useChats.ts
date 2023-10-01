import { db } from "../firebase";
import { User } from "firebase/auth";
import { collection, doc, orderBy, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

const useChats = (user: User) => {
	if (!user) return [null, false, null];

	const userRef = doc(db, "users", user!.uid);
	const chatsRef = collection(userRef, "chats");
	const q = query(chatsRef, orderBy("timestamp", "desc"));
	const [snapshot, loading, error] = useCollection(q, {
		snapshotListenOptions: { includeMetadataChanges: true },
	});
	const chats = snapshot?.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));

	return [chats, loading, error];
};

export default useChats;

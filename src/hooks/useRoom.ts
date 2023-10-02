import { doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { db } from "../firebase";

const useRoom = (roomId: string, userId: string) => {
	const isUserRoom = roomId.includes(userId);
	const docId = isUserRoom ? roomId.replace(userId, "") : roomId;

	const chatsRef = doc(db, isUserRoom ? "users" : "rooms", docId);
	const [snapshot, loading, error] = useDocument(chatsRef, {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	if (!snapshot) return [null, loading, error];

	return [
		{
			id: snapshot.id,
			photoURL:
				snapshot.data()?.photoURL ||
				`https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${snapshot.id}`,
			...snapshot.data(),
		},
		loading,
		error,
	];
};

export default useRoom;

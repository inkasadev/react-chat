import { collection, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";

const useRooms = () => {
	const roomsRef = collection(db, "rooms");
	const q = query(roomsRef, orderBy("timestamp", "desc"));
	const [snapshot, loading, error] = useCollection(q, {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	const rooms = snapshot?.docs.map((doc) => ({
		id: doc.id,
		userID: doc.id,
		...doc.data(),
	}));

	return [rooms, loading, error];
};

export default useRooms;

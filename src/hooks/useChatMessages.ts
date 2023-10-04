import { collection, doc, orderBy, query } from "firebase/firestore";
import { db } from "../vendor/firebase";
import { useCollection } from "react-firebase-hooks/firestore";

const useChatMessages = (roomId: string) => {
	const roomRef = doc(db, "rooms", roomId);
	const messagesRef = collection(roomRef, "messages");
	const q = query(messagesRef, orderBy("timestamp", "asc"));
	const [snapshot, loading, error] = useCollection(q, {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	const messages = snapshot?.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));

	return [messages, loading, error];
};

export default useChatMessages;

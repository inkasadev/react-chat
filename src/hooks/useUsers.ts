import { User } from "firebase/auth";
import { collection, orderBy, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";

const useUsers = (user: User) => {
	const usersRef = collection(db, "users");
	const q = query(usersRef, orderBy("timestamp", "desc"));
	const [snapshot, loading, error] = useCollection(q, {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	let users: any[] | undefined = [];

	if (user) {
		users = snapshot?.docs
			.filter((doc) => doc.id !== user.uid)
			.map((doc) => {
				const id =
					doc.id > user.uid ? `${doc.id}${user.uid}` : `${user.uid}${doc.id}`;

				return {
					id,
					userID: doc.id,
					...doc.data(),
				};
			});
	}

	return [users, loading, error];
};

export default useUsers;

import { db } from './firebase'

export const userRefCreator = (userUid: string) =>
	db.collection('Users').doc(userUid)

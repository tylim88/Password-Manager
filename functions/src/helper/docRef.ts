import { db } from './firebase'

export const userRefCreator = (userUid: string) =>
	db.collection('Users').doc(userUid)

export const passwordsRefCreator = (userUid: string) =>
	userRefCreator(userUid).collection('Passwords').doc('Passwords')

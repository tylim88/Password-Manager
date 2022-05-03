import { getFunctions } from 'firebase/functions'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { callableCreator } from 'firecaller'
const config = [
	'apiKey',
	'authDomain',
	'projectId',
	'storageBucket',
	'messagingSenderId',
	'appId',
	'measurementId',
].reduce((acc, item) => {
	acc[item] = process.env['REACT_APP_' + item] as string
	return acc
}, {} as Record<string, string>)

export const app = initializeApp(config)

export const db = getFirestore()

export const auth = getAuth()

export const funRef = getFunctions(app)

export const callable = callableCreator()

export type { HttpsCallableResult } from 'firebase/functions'

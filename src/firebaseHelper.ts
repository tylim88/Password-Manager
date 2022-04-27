import { getFunctions, httpsCallable } from 'firebase/functions'
import { z, ZodType, ZodTypeDef } from 'zod'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

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

export const callableCreator = <
	T extends {
		req: ZodType<unknown, ZodTypeDef, unknown>
		res: ZodType<unknown, ZodTypeDef, unknown>
		name: z.ZodLiteral<string>
	}
>(
	schema: T
) => {
	return (data: z.infer<T['req']>) =>
		httpsCallable<z.infer<T['req']>, z.infer<T['res']>>(
			funRef,
			schema.name.value
		)(data)
}

export type { HttpsCallableResult } from 'firebase/functions'

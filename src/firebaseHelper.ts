import { getFunctions, httpsCallable } from 'firebase/functions'
import { z, ZodType } from 'zod'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export const app = initializeApp({
	apiKey: 'AIzaSyDCc8Qfv_b9a4YWTWmXkw9aJyo3R62WlSw',
	authDomain: 'password-manager-3f905.firebaseapp.com',
	projectId: 'password-manager-3f905',
	storageBucket: 'password-manager-3f905.appspot.com',
	messagingSenderId: '20518931267',
	appId: '1:20518931267:web:418f7db75b75e365b33df6',
	measurementId: 'G-EK468D7ZCK',
})

export const db = getFirestore()

export const auth = getAuth()

const funRef = getFunctions(app)

export const callableCreator = <
	T extends {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		req: ZodType<any, any, any>
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		res: ZodType<any, any, any>
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

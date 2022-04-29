import { decryptPasswords } from './hashingAndEncryption'
import { passwordsRefCreator } from './docRef'

export const getPassword = async (masterPassword: string, userUid: string) => {
	const snapshot = await passwordsRefCreator(userUid).get()

	const data = snapshot.data() as Passwords | undefined
	if (data) {
		const { encryptedPasswords } = data
		if (encryptedPasswords) {
			const decrypted = decryptPasswords(encryptedPasswords, masterPassword)
			const parsed = JSON.parse(decrypted) as Secret[]
			return { code: 'ok', data: parsed } as const
		}
		return { code: 'ok', data: [] as Secret[] } as const
	}
	return { code: 'not-found', message: 'passwords not found' } as const
}

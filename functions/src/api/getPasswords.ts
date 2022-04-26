import { onCallCreator, passwordsRefCreator, decryptPasswords } from 'helper'
import { getPasswordsSchema } from 'schema'

export const getPasswords = onCallCreator(
	getPasswordsSchema,
	{ route: 'private', toLogDetails: false },
	async (masterPassword, context) => {
		const snapshot = await passwordsRefCreator(context.auth.uid).get()

		const data = snapshot.data() as Passwords | undefined
		if (data) {
			const decrypted = JSON.parse(
				decryptPasswords(data.encryptedPasswords, masterPassword)
			) as Secret[]

			return { code: 'ok', data: decrypted }
		}
		return { code: 'not-found', message: 'passwords not found' }
	}
)

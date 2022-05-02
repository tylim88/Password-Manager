import {
	passwordsRefCreator,
	verifyMasterPasswordHash,
	getPassword,
} from 'helper'
import { verifyMasterPasswordSchema } from 'schema'
import { onCall } from 'firecall'

export const verifyMasterPassword = onCall(
	verifyMasterPasswordSchema,
	{ route: 'private', onErrorLogging: false },
	async (masterPassword, context) => {
		const passwordsRef = passwordsRefCreator(context.auth.uid)

		// if master password not exist, return error
		const passwordsSnapshot = await passwordsRef.get()
		const passwordsData = passwordsSnapshot.data() as Passwords | undefined
		if (!passwordsData) {
			return {
				code: 'not-found',
				message: 'master password not found',
			} as const
		}
		const { masterPasswordHash } = passwordsData
		// if hash does not valid, return error
		const valid = await verifyMasterPasswordHash(
			masterPasswordHash,
			masterPassword
		)
		if (valid) {
			return getPassword(masterPassword, context.auth.uid)
		}
		return {
			code: 'invalid-argument',
			message: 'Incorrect Master Password',
		} as const
	}
)

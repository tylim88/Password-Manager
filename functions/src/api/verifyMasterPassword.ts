import {
	onCallCreator,
	passwordsRefCreator,
	verifyMasterPasswordHash,
} from 'helper'
import { verifyMasterPasswordSchema } from 'schema'

export const verifyMasterPassword = onCallCreator(
	verifyMasterPasswordSchema,
	{ route: 'private', toLogDetails: false },
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

		return { code: 'ok', data: valid } as const
	}
)

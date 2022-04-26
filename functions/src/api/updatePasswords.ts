import {
	onCallCreator,
	db,
	passwordsRefCreator,
	verifyMasterPasswordHash,
	encryptPasswords,
} from 'helper'
import { updatePasswordsSchema } from 'schema'

export const updateMPasswords = onCallCreator(
	updatePasswordsSchema,
	{ route: 'private', toLogDetails: false },
	async ({ masterPassword, newPasswords }, context) => {
		return await db.runTransaction(async transaction => {
			const passwordsRef = passwordsRefCreator(context.auth.uid)

			// if master password not exist, return error
			const passwordsSnapshot = await transaction.get(passwordsRef)
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
			if (!valid) {
				return {
					code: 'invalid-argument',
					message: 'incorrect master password',
				} as const
			}
			// if hash is valid, re-encrypt passwords(if passwords exist)
			const updateData: OmitKeys<Passwords, 'masterPasswordHash'> = {
				encryptedPasswords: await encryptPasswords(
					JSON.stringify(newPasswords),
					masterPassword
				),
			}
			await transaction.update(passwordsRef, updateData)

			return { code: 'ok', data: null } as const
		})
	}
)

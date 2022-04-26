import {
	onCallCreator,
	db,
	passwordsRefCreator,
	hashMasterPassword,
	verifyMasterPasswordHash,
	encryptPasswords,
	decryptPasswords,
} from 'helper'
import { updateMasterPasswordSchema } from 'schema'

export const updateMasterPassword = onCallCreator(
	updateMasterPasswordSchema,
	{ route: 'private', toLogDetails: false },
	async ({ newMasterPassword, oldMasterPassword }, context) => {
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
			} else {
				const { masterPasswordHash, encryptedPasswords } = passwordsData
				// if hash does not valid, return error
				const valid = await verifyMasterPasswordHash(
					masterPasswordHash,
					oldMasterPassword
				)
				if (!valid) {
					return {
						code: 'invalid-argument',
						message: 'incorrect master password',
					} as const
				}
				// if hash is valid, re-encrypt passwords(if passwords exist)
				const setData: Passwords = {
					masterPasswordHash: await hashMasterPassword(newMasterPassword),
					encryptedPasswords: encryptedPasswords
						? await encryptPasswords(
								await decryptPasswords(encryptedPasswords, oldMasterPassword),
								newMasterPassword
						  )
						: '',
				}
				await transaction.set(passwordsRef, setData)

				return { code: 'ok', data: null } as const
			}
		})
	}
)

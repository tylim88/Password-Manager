import {
	db,
	passwordsRefCreator,
	hashMasterPassword,
	verifyMasterPasswordHash,
	encryptPasswords,
	decryptPasswords,
} from 'helper'
import { updateMasterPasswordSchema } from 'schema'
import { onCall } from 'firecall'

export const updateMasterPassword = onCall(
	updateMasterPasswordSchema,
	{ route: 'private', onErrorLogging: false },
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
			}
			const { masterPasswordHash, encryptedPasswords } = passwordsData

			// check if user reuse old master password as new master password
			const isReuse = await verifyMasterPasswordHash(
				masterPasswordHash,
				newMasterPassword
			)
			if (isReuse) {
				return {
					code: 'invalid-argument',
					message: 'please do not reuse old master password',
				} as const
			}

			// check if old master password is correct, return error
			const isValid = await verifyMasterPasswordHash(
				masterPasswordHash,
				oldMasterPassword
			)
			if (!isValid) {
				return {
					code: 'invalid-argument',
					message: 'incorrect master password',
				} as const
			}

			// if hash is valid, re-encrypt passwords if passwords exist
			const setData: Passwords = {
				masterPasswordHash: await hashMasterPassword(newMasterPassword),
				encryptedPasswords: encryptedPasswords
					? await encryptPasswords(
							await decryptPasswords(encryptedPasswords, oldMasterPassword),
							newMasterPassword
					  )
					: null,
			}
			await transaction.set(passwordsRef, setData)

			return { code: 'ok', data: null } as const
		})
	}
)

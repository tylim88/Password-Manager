import { onCallCreator, db, hashMasterPassword, userRefCreator } from 'helper'
import { setMasterPasswordSchema } from 'schema'

export const setMasterPassword = onCallCreator(
	setMasterPasswordSchema,
	{ route: 'private', toLogDetails: false },
	async (masterPassword, context) => {
		return await db.runTransaction(async transaction => {
			const userRef = userRefCreator(context.auth.uid)

			// if master password already exist, return error
			const snapshot = await transaction.get(userRef)
			const data = snapshot.data() as User | undefined
			if (data) {
				return {
					code: 'already-exists',
					message: 'master password already exists',
				} as const
			}
			// else set status to true and set the first master password
			await transaction.set(userRef, {
				hasMasterPassword: true,
			})

			const setData: Passwords = {
				masterPasswordHash: await hashMasterPassword(masterPassword),
				encryptedPasswords: '',
			}

			await transaction.set(userRef.collection('Hash').doc('Hash'), setData)

			return { code: 'ok', data: null } as const
		})
	}
)

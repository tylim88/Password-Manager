import { z } from 'zod'
import { find } from 'lodash'

const masterPassword = z.string().min(8)

const passwords = z.array(
	z
		.object({
			password: z.string().min(8),
			username: z.string().min(1),
			site: z.string().min(1),
		})
		.strict()
)

export const getPasswordsSchema = {
	req: masterPassword,
	res: passwords,
	name: z.literal('getPasswords'),
}

export const setMasterPasswordSchema = {
	req: masterPassword,
	res: z.literal(null),
	name: z.literal('setMasterPassword'),
}

export const updateMasterPasswordSchema = {
	req: z
		.object({
			oldMasterPassword: masterPassword,
			newMasterPassword: masterPassword,
		})
		.strict(),
	res: z.literal(null),
	name: z.literal('updateMasterPassword'),
}

export const updatePasswordsSchema = {
	req: z
		.object({
			masterPassword,
			newPasswords: passwords,
		})
		.strict(),
	res: z.literal(null),
	name: z.literal('updatePasswords'),
}

export const verifyMasterPasswordSchema = {
	req: masterPassword,
	res: z.boolean(),
	name: z.literal('verifyMasterPassword'),
}

export const isUnique =
	(oldValues: { site: string; username: string }) =>
	(newValues: { site: string; username: string }) => {
		const exist = find(passwords, newValues)
		if (
			oldValues.site !== newValues.site &&
			oldValues.username !== newValues.username &&
			exist
		) {
			return 'Site and username already exist'
		}
		return null
	}

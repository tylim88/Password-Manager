import { z } from 'zod'

const masterPassword = z.string().min(8)

const passwords = z.array(
	z
		.object({
			password: z.string(),
			username: z.string(),
			site: z.string(),
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
	name: z.literal('updatePasswordList'),
}

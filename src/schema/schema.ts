import { z } from 'zod'

const masterPassword = z.string().min(8)

const passwords = z.array(
	z
		.object({
			password: z.string().min(8, 'minimum characters is 8'),
			username: z.string().min(1, 'cannot be empty'),
			site: z.string().min(1, 'cannot be empty'),
		})
		.strict()
)

export const setMasterPasswordSchema = {
	req: masterPassword,
	res: z.null(),
	name: 'setMasterPassword',
}

export const updateMasterPasswordSchema = {
	req: z
		.object({
			oldMasterPassword: masterPassword,
			newMasterPassword: masterPassword,
		})
		.strict(),
	res: z.null(),
	name: 'updateMasterPassword',
}

export const updatePasswordsSchema = {
	req: z
		.object({
			masterPassword,
			newPasswords: passwords,
		})
		.strict(),
	res: z.null(),
	name: 'updatePasswords',
}

export const verifyMasterPasswordSchema = {
	req: masterPassword,
	res: passwords,
	name: 'verifyMasterPassword',
}

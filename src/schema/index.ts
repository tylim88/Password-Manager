import { z } from 'zod'

export const zodErrorHandling = (err: unknown, defaultMessage?: string) => {
	if (err instanceof z.ZodError) {
		return err.issues[0].message
	}
	return defaultMessage || 'Invalid Data'
}

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

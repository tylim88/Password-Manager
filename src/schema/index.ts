import { z } from 'zod'

export const getPasswordListSchema = {
	req: z.literal(null),
	res: z.array(
		z
			.object({
				decryptedPassword: z.string(),
				site: z.string(),
			})
			.strict()
	),
	name: z.literal('getPasswordList'),
}

export const setMasterPassword = {
	req: z.string().min(8),
	res: z.literal(null),
	name: z.literal('setMasterPassword'),
}

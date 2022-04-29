import { z } from 'zod'

export const updatePasswordsSchema = {
	req: z
		.object({
			masterPasswordHash: z.string(),
			newPasswords: z.string(),
		})
		.strict(),
	res: z.literal(null),
	name: z.literal('updatePasswords'),
}

export const allSchema = [updatePasswordsSchema]

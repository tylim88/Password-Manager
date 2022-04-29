import { z } from 'zod'

export const zodErrorHandling = (err: unknown, defaultMessage?: string) => {
	if (err instanceof z.ZodError) {
		return err.issues[0]?.message || 'Invalid Data'
	}
	return defaultMessage || 'Invalid Data'
}

export const masterPasswordValidation = z.string().min(8) // add your validation here

export const passwordValidation = z
	.object({
		password: z.string().min(8, 'minimum characters is 8'),
		username: z.string().min(1, 'cannot be empty'),
		site: z.string().min(1, 'cannot be empty'),
	})
	.strict()

import { z } from 'zod'

export const zodErrorHandling = (err: unknown, defaultMessage?: string) => {
	if (err instanceof z.ZodError) {
		return err.issues[0]?.message || 'Invalid Data'
	}
	return defaultMessage || 'Invalid Data'
}

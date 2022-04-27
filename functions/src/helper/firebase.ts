import * as functions from 'firebase-functions'
import { z, ZodType, ZodTypeDef } from 'zod'
import admin from 'firebase-admin'

admin.initializeApp()
export const db = admin.firestore()

export const ENV: ENV['env'] = functions.config().env

const throwAndLogHttpsError = ({
	code,
	message,
	details,
	logType,
	toLogDetails, // do not log detail when processing sensitive data, because those data may end up in the log file
}: {
	code: ExcludeUnion<functions.https.FunctionsErrorCode, 'ok'>
	message: string
	details?: unknown
	logType?: 'log' | 'info' | 'warn' | 'error'
	toLogDetails: boolean
}) => {
	functions.logger[logType || 'error']({
		code,
		message,
		details: toLogDetails || ENV.dev ? details : undefined,
		logType,
	})
	throw new functions.https.HttpsError(code, message)
}
// standardize the way of data validation, auth checking and error handling
export const onCallCreator = <
	T extends {
		req: ZodType<unknown, ZodTypeDef, unknown>
		res: ZodType<unknown, ZodTypeDef, unknown>
		name: z.ZodLiteral<string>
	},
	Q extends z.infer<T['res']>,
	R extends { ok: functions.https.FunctionsErrorCode }
>(
	schema: T,
	config: { route: 'private' | 'public'; toLogDetails: boolean },
	handler: (
		reqData: z.infer<T['req']>,
		context: NonNullableKey<functions.https.CallableContext, 'auth'>
	) => Promise<
		R extends { code: 'ok' }
			? R & {
					data: keyof Q extends keyof z.infer<T['res']> ? Q : never
			  }
			:
					| OmitKeys<
							Parameters<typeof throwAndLogHttpsError>[0],
							'toLogDetails'
					  >
					| {
							code: 'ok'
							data: keyof Q extends keyof z.infer<T['res']> ? Q : never
					  }
	>
) => {
	const { route, toLogDetails } = config
	return functions.https.onCall(async (data, context) => {
		if (!context.auth && route === 'private') {
			throwAndLogHttpsError({
				code: 'unauthenticated',
				message: 'Please Login First',
				toLogDetails,
			})
		}
		const reqParseResult = schema.req.safeParse(data)
		if (!reqParseResult.success) {
			throwAndLogHttpsError({
				code: 'invalid-argument',
				message: 'invalid-argument',
				details: reqParseResult.error,
				toLogDetails,
			})
		}

		try {
			const res = await handler(
				data,
				context as NonNullableKey<functions.https.CallableContext, 'auth'>
			)
			if (res.code === 'ok') {
				const resParseResult = schema.res.safeParse(res.data)
				if (!resParseResult.success) {
					throwAndLogHttpsError({
						code: 'internal',
						message: 'internal error',
						details: resParseResult.error,
						toLogDetails,
					})
				}
				return res.data
			} else {
				throwAndLogHttpsError({
					code: res.code,
					details: res.details,
					message: res.message,
					logType: res.logType,
					toLogDetails,
				})
			}
		} catch (err) {
			throwAndLogHttpsError({
				code: 'unknown',
				message: 'unknown error',
				details: err,
				toLogDetails,
			})
		}
	})
}

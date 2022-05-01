import * as functions from 'firebase-functions'
import { z, ZodType, ZodTypeDef } from 'zod'
import admin from 'firebase-admin'
import { zodErrorHandling } from 'schema'
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
	})
	// you can save the log file here if you want to
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
							data: keyof Q extends keyof z.infer<T['res']> ? Q : never // ensure exact object shape
					  }
	>
) => {
	const { route, toLogDetails } = config
	return functions.https.onCall(async (data, context) => {
		// auth validation
		if (!context.auth && route === 'private') {
			throwAndLogHttpsError({
				code: 'unauthenticated',
				message: 'Please Login First',
				toLogDetails,
			})
		}

		// data validation
		try {
			schema.req.parse(data)
		} catch (e) {
			throwAndLogHttpsError({
				code: 'invalid-argument',
				message: zodErrorHandling(e),
				details: e,
				toLogDetails,
			})
		}

		const res = await handler(
			data,
			context as NonNullableKey<functions.https.CallableContext, 'auth'>
		).catch(err => {
			// unknown error
			return throwAndLogHttpsError({
				code: 'unknown',
				message: 'unknown error',
				details: err,
				toLogDetails,
			})
		})
		if (res.code === 'ok') {
			// validate output, rare error
			try {
				schema.res.parse(res.data)
			} catch (e) {
				throwAndLogHttpsError({
					code: 'internal',
					message: 'output data malformed',
					details: e,
					toLogDetails,
				})
			}
			return res.data
		} else {
			// thrown known error
			throwAndLogHttpsError({
				code: res.code,
				details: res.details,
				message: res.message,
				logType: res.logType,
				toLogDetails,
			})
		}
	})
}

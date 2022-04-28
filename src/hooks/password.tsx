import React, {
	useContext,
	createContext,
	PropsWithChildren,
	useCallback,
	useEffect,
} from 'react'
import { callableCreator, HttpsCallableResult } from 'firebaseHelper'
import { getPasswordsSchema, updatePasswordsSchema } from 'schema'
import { useAuth } from './auth'
import { useNotification } from './notification'
import { useMasterPassword } from './masterPassword'
import { sortBy } from 'lodash'
import { useListState } from '@mantine/hooks'

const context = createContext<{
	passwords: Secret[]
	updatePasswords: (
		passwords: {
			password: string
			username: string
			site: string
		}[]
	) => Promise<HttpsCallableResult<null>>
	reorder: (from: number, to: number) => void
	sort: () => void

	// @ts-expect-error
}>({ passwords: [] })

export const PasswordsProvider = (props: PropsWithChildren<{}>) => {
	const [passwords, handlers] = useListState<Secret>([])
	const { masterPassword } = useMasterPassword()
	const { setNotificationFailed, setNotificationSuccess } = useNotification()

	const { resetCallbackObj } = useAuth()

	const setPasswords = useCallback(
		(passwords: Secret[]) => {
			return handlers.setState(passwords)
		},
		[handlers]
	)

	const reorder = (from: number, to: number) => handlers.reorder({ from, to })

	const sort = () => setPasswords(sortBy(passwords, ['site', 'username']))

	useEffect(() => {
		masterPassword &&
			callableCreator(getPasswordsSchema)(masterPassword)
				.then(result => {
					const data = result.data
					setPasswords(data)
				})
				.catch(err => {
					setNotificationFailed({
						text: 'Failed to load passwords!',
						timeout: 0,
					})
				})
	}, [setPasswords, masterPassword, setNotificationFailed])

	resetCallbackObj['passwords'] = () => setPasswords([])

	const updatePasswords = (newPasswords: Secret[]) => {
		if (!masterPassword) {
			// this should never happen
			throw Error('no master password or master password not verified yet')
		}

		return callableCreator(updatePasswordsSchema)({
			masterPassword,
			newPasswords,
		})
			.then(result => {
				setPasswords(newPasswords)
				setNotificationSuccess({ text: 'Successfully updated passwords!' })
				return result
			})
			.catch(err => {
				setNotificationFailed({
					text: 'Failed to update passwords!',
					timeout: 0,
				})
				throw err
			})
	}

	return (
		<context.Provider
			value={{ passwords, updatePasswords, sort, reorder }}
			{...props}
		/>
	)
}

export const usePasswords = () => useContext(context)

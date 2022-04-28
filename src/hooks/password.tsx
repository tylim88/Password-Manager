import React, {
	useContext,
	createContext,
	PropsWithChildren,
	useState,
	useEffect,
} from 'react'
import { callableCreator, HttpsCallableResult } from 'firebaseHelper'
import { getPasswordsSchema, updatePasswordsSchema } from 'schema'
import { useAuth } from './auth'
import { useNotification } from './notification'
import { useMasterPassword } from './masterPassword'
import { sortBy } from 'lodash'

const context = createContext<{
	passwords: Secret[]
	updatePasswords: (
		passwords: {
			password: string
			username: string
			site: string
		}[]
	) => Promise<HttpsCallableResult<null>>
	// @ts-expect-error
}>({ passwords: [] })

export const PasswordsProvider = (props: PropsWithChildren<{}>) => {
	const [passwords, setPasswords] = useState<Secret[]>([])
	const { masterPassword } = useMasterPassword()
	const { setNotificationFailed, setNotificationSuccess } = useNotification()

	const { resetCallbackObj } = useAuth()

	useEffect(() => {
		masterPassword &&
			callableCreator(getPasswordsSchema)(masterPassword).then(result => {
				const data = result.data
				setPasswords(data)
			})
	}, [masterPassword])

	resetCallbackObj['passwords'] = () => setPasswords([])

	const updatePasswords = (newPasswords: Secret[]) => {
		if (!masterPassword) {
			// this should never happen
			throw Error('no master password or master password not verified yet')
		}
		const sortedPassword = sortBy(newPasswords, ['site', 'username'])

		return callableCreator(updatePasswordsSchema)({
			masterPassword,
			newPasswords: sortedPassword,
		})
			.then(result => {
				setPasswords(sortedPassword)
				setNotificationSuccess({ text: 'Successfully updated passwords!' })
				return result
			})
			.catch(err => {
				setNotificationFailed({
					text: 'Something Went Wrong!',
					timeout: 0,
				})
				throw err
			})
	}

	return <context.Provider value={{ passwords, updatePasswords }} {...props} />
}

export const usePasswords = () => useContext(context)

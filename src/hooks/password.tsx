import React, {
	useContext,
	createContext,
	PropsWithChildren,
	useState,
	useEffect,
} from 'react'
import { callableCreator, HttpsCallableResult } from 'firebaseHelper'
import { getPasswordsSchema, updatePasswordsSchema } from 'schema'
import { z } from 'zod'
import { useAuth } from './auth'
import { useNotification } from './notification'
import { useMasterPassword } from './masterPassword'

type Passwords = z.infer<typeof getPasswordsSchema['res']>

const context = createContext<{
	passwords: Passwords
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
	const [passwords, setPasswords] = useState<Passwords>([])
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

	const updatePasswords = (passwords: Passwords) => {
		if (!masterPassword) {
			// this should never happen
			throw Error('no master password or master password not verified yet')
		}
		return callableCreator(updatePasswordsSchema)({
			masterPassword,
			newPasswords: passwords,
		})
			.then(result => {
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

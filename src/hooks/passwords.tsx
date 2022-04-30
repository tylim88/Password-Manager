import {
	useContext,
	createContext,
	PropsWithChildren,
	useCallback,
} from 'react'
import { callableCreator, HttpsCallableResult } from 'firebaseHelper'
import { updatePasswordsSchema } from 'schema'
import { useAuth } from './auth'
import { useNotification } from './notification'
import { useMasterPassword } from './masterPassword'
import { sortBy, cloneDeep } from 'lodash'
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
	reorder: (indexes: { from: number; to: number }) => void
	sort: () => void

	// @ts-expect-error
}>({ passwords: [] })

export const PasswordsProvider = (props: PropsWithChildren<{}>) => {
	const [passwords, handlers] = useListState<Secret>([])
	const { masterPassword, ref } = useMasterPassword()
	const {
		setNotificationFailed,
		setNotificationSuccess,
		setNotificationLoading,
	} = useNotification()

	const { resetCallbackObj } = useAuth()

	const setPasswords = useCallback(
		(passwords: Secret[]) => {
			return handlers.setState(passwords)
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[] // !do not add handler as dependency!!
	)

	ref.current = setPasswords

	const reorder = ({ from, to }: { from: number; to: number }) => {
		if (from === to) return

		// does not use the useListState reorder hook because updating via useEffect is problematic
		const newPasswords = cloneDeep(passwords)
		const target = newPasswords.splice(from, 1)
		const head = newPasswords.slice(0, to)
		const tail = newPasswords.slice(to)
		updatePasswords([...head, ...target, ...tail])
	}

	const sort = () => updatePasswords(sortBy(passwords, ['site', 'username']))

	resetCallbackObj['passwords'] = () => setPasswords([])

	const updatePasswords = async (newPasswords: Secret[]) => {
		if (!masterPassword) {
			// this should never happen
			throw Error('no master password or master password not verified yet')
		}
		const close = setNotificationLoading({ message: 'Updating Passwords...' })
		setPasswords(newPasswords) // optimistic update
		const result = await callableCreator(updatePasswordsSchema)({
			masterPassword,
			newPasswords,
		})
			.then(result => {
				setNotificationSuccess({ message: 'Successfully Updated Passwords!' })
				return result
			})
			.catch(err => {
				close()
				setPasswords(passwords) // revert optimistic update
				setNotificationFailed({
					message: 'Failed to Update Passwords!',
				})
				throw err
			})
		close()
		return result
	}

	return (
		<context.Provider
			value={{ passwords, updatePasswords, sort, reorder }}
			{...props}
		/>
	)
}

export const usePasswords = () => useContext(context)

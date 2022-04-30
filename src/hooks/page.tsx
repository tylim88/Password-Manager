import React, {
	useContext,
	createContext,
	PropsWithChildren,
	useState,
	useEffect,
} from 'react'
import { useAuth } from './auth'
import { useUser } from './user'
import { useMasterPassword } from './masterPassword'

export type Page =
	| 'Sign Up/Login'
	| 'Setup Master Password'
	| 'Change Master Password'
	| 'Password List'
	| 'Verify Master Password'

const context = createContext<{
	page: Page
	setPage: React.Dispatch<React.SetStateAction<Page>>
}>({ page: 'Sign Up/Login', setPage: () => {} })

export const PageProvider = (props: PropsWithChildren<{}>) => {
	const [page, setPage] = useState<Page>('Sign Up/Login')
	const { masterPassword } = useMasterPassword()
	const { user: userFromAuth } = useAuth()
	const { user } = useUser()
	useEffect(() => {
		if (
			userFromAuth &&
			user?.hasMasterPassword &&
			masterPassword &&
			page !== 'Password List' &&
			page !== 'Change Master Password'
		) {
			setPage('Password List')
		} else if (userFromAuth && user?.hasMasterPassword && !masterPassword) {
			setPage('Verify Master Password')
		} else if (userFromAuth && !user?.hasMasterPassword) {
			setPage('Setup Master Password')
		} else if (!userFromAuth) {
			setPage('Sign Up/Login')
		}
	}, [userFromAuth, user?.hasMasterPassword, masterPassword, page])

	return <context.Provider value={{ page, setPage }} {...props} />
}

export const usePage = () => useContext(context)

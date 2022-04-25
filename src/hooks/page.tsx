import React, {
	useContext,
	createContext,
	PropsWithChildren,
	useState,
	useEffect,
} from 'react'
import { useUser } from './user'
import { useAccount } from './account'

export type Page =
	| 'Sign Up/Login'
	| 'Setup Master Password'
	| 'Change Master Password'
	| 'Password List'

const context = createContext<{
	page: Page
	setPage: React.Dispatch<React.SetStateAction<Page>>
}>({ page: 'Sign Up/Login', setPage: () => {} })

export const PageProvider = (props: PropsWithChildren<{}>) => {
	const [page, setPage] = useState<Page>('Sign Up/Login')
	const { user } = useUser()
	const { account } = useAccount()

	useEffect(() => {
		if (user && account?.hasMasterPassword) {
			setPage('Password List')
		} else if (user && !account?.hasMasterPassword) {
			setPage('Setup Master Password')
		} else if (!user) {
			setPage('Sign Up/Login')
		}
	}, [user, account?.hasMasterPassword])

	return <context.Provider value={{ page, setPage }} {...props} />
}

export const usePage = () => useContext(context)

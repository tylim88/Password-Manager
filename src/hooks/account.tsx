import React, {
	useContext,
	createContext,
	PropsWithChildren,
	useState,
	useEffect,
} from 'react'
import { useUser } from './user'
import { MetaTypeCreator, getFirelord, onSnapshot } from 'firelordjs'
import { db } from 'firebaseHelper'

export type Account = MetaTypeCreator<
	{ hasMasterPassword: boolean },
	'Account',
	string
>

const accountRef = getFirelord<Account>(db)('Account')

const context = createContext<{ account: Account['read'] | undefined }>({
	account: undefined,
})

export const AccountProvider = (props: PropsWithChildren<{}>) => {
	const [account, setAccount] = useState<Account['read'] | undefined>(undefined)
	const { user } = useUser()
	const userUid = user?.uid

	useEffect(() => {
		if (userUid) {
			return onSnapshot(accountRef.doc(userUid), snapshot => {
				const data = snapshot.data()
				setAccount(data)
			})
		}
	}, [userUid])

	return <context.Provider value={{ account }} {...props} />
}

export const useAccount = () => useContext(context)

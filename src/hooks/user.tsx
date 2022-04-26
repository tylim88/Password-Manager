import React, {
	useContext,
	createContext,
	PropsWithChildren,
	useState,
	useEffect,
} from 'react'
import { useAuth } from './auth'
import { MetaTypeCreator, getFirelord, onSnapshot } from 'firelordjs'
import { db } from 'firebaseHelper'

export type User = MetaTypeCreator<
	{ hasMasterPassword: boolean },
	'User',
	string
>

const userRef = getFirelord<User>(db)('User')

const context = createContext<{ user: User['read'] | undefined }>({
	user: undefined,
})

export const UserProvider = (props: PropsWithChildren<{}>) => {
	const [user, setUser] = useState<User['read'] | undefined>(undefined)
	const { user: userFromAuth } = useAuth()
	const userUid = userFromAuth?.uid

	useEffect(() => {
		if (userUid) {
			return onSnapshot(userRef.doc(userUid), snapshot => {
				const data = snapshot.data()
				setUser(data)
			})
		}
	}, [userUid])

	return <context.Provider value={{ user }} {...props} />
}

export const useUser = () => useContext(context)

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
	'Users',
	string
>

const userRef = getFirelord<User>(db)('Users')

const context = createContext<{
	user: User['read'] | undefined
	loading: boolean
}>({
	user: undefined,
	loading: true,
})

export const UserProvider = (props: PropsWithChildren<{}>) => {
	const [user, setUser] = useState<User['read'] | undefined>(undefined)
	const { user: userFromAuth, resetCallbackObj } = useAuth()
	const [loading, setLoading] = useState(true)

	resetCallbackObj['user'] = () => setUser(undefined)
	const userUid = userFromAuth?.uid

	useEffect(() => {
		if (userUid) {
			setLoading(true)
			return onSnapshot(userRef.doc(userUid), snapshot => {
				const data = snapshot.data()
				setUser(data)
				setLoading(false)
			})
		} else {
			setLoading(false)
		}
	}, [userUid])

	return <context.Provider value={{ user, loading }} {...props} />
}

export const useUser = () => useContext(context)

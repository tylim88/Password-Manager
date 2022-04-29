import {
	useContext,
	createContext,
	PropsWithChildren,
	useState,
	useEffect,
} from 'react'
import { useAuth } from './auth'
import { onSnapshot } from 'firelordjs'
import { userFirelordRef } from 'firebaseHelper'

const context = createContext<{
	user: User | undefined
	loading: boolean
}>({
	user: undefined,
	loading: true,
})

export const UserProvider = (props: PropsWithChildren<{}>) => {
	const [user, setUser] = useState<User | undefined>(undefined)
	const { user: userFromAuth, resetCallbackObj } = useAuth()
	const [loading, setLoading] = useState(true)

	resetCallbackObj['user'] = () => {
		setUser(undefined)
		setLoading(false)
	}
	const userUid = userFromAuth?.uid

	useEffect(() => {
		if (userUid) {
			setLoading(true)
			return onSnapshot(userFirelordRef.doc(userUid), snapshot => {
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

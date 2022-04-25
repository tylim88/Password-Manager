import React, {
	useContext,
	createContext,
	PropsWithChildren,
	useState,
	useEffect,
} from 'react'
import { getAuth } from 'firebase/auth'
import { onAuthStateChanged, User } from 'firebase/auth'

const context = createContext<{ user: User | null }>({ user: null })

export const UserProvider = (props: PropsWithChildren<{}>) => {
	const [user, setUser] = useState<User | null>(null)

	useEffect(() => {
		return onAuthStateChanged(getAuth(), user => {
			setUser(user)
		})
	}, [])

	return <context.Provider value={{ user }} {...props} />
}

export const useUser = () => useContext(context)

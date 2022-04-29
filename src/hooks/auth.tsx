import {
	useContext,
	createContext,
	PropsWithChildren,
	useState,
	useEffect,
	useRef,
} from 'react'
import { getAuth } from 'firebase/auth'
import { onAuthStateChanged, User } from 'firebase/auth'
import { useIdleTimer } from 'react-idle-timer'
import { auth } from 'firebaseHelper'
import { useNotification } from './notification'

const context = createContext<{
	user: User | null
	resetCallbackObj: Record<string, () => void>
	loading: boolean
}>({ user: null, resetCallbackObj: {}, loading: true })

export const AuthProvider = (props: PropsWithChildren<{}>) => {
	const [user, setUser] = useState<User | null>(null)
	const reset = useRef<Record<string, () => void>>({})
	const [loading, setLoading] = useState(true)
	const { setNotificationStay } = useNotification()

	useIdleTimer({
		crossTab: true,
		timeout: 1000 * 60 * 3,
		onIdle: () => {
			user &&
				setNotificationStay({
					message: 'You have been signed out due to inactivity.',
				})
			auth.signOut()
		},
	})
	useEffect(() => {
		setLoading(true)
		return onAuthStateChanged(getAuth(), user => {
			setUser(user)
			setLoading(false)
			if (!user) {
				for (const prop in reset.current) {
					reset.current[prop]?.() // reset all states
				}
			}
		})
	}, [setNotificationStay])

	return (
		<context.Provider
			value={{ user, resetCallbackObj: reset.current, loading }}
			{...props}
		/>
	)
}

export const useAuth = () => useContext(context)

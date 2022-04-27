import React, {
	useContext,
	createContext,
	PropsWithChildren,
	useState,
	useCallback,
} from 'react'
import { NotificationProps } from '@mantine/core'
import { X, Check } from 'tabler-icons-react'

type NotificationSettings = NotificationProps &
	React.RefAttributes<HTMLDivElement> &
	Partial<{ isOpen: boolean; text: string; timeout: number }>

const context = createContext<{
	notification: NotificationSettings
	setNotification: (props: NotificationSettings) => void
	setNotificationFailed: (props: NotificationSettings) => void
	setNotificationSuccess: (props: NotificationSettings) => void
}>({
	notification: {},
	setNotification: () => {},
	setNotificationFailed: () => {},
	setNotificationSuccess: () => {},
})

export const NotificationProvider = (props: PropsWithChildren<{}>) => {
	const [notification, setNotification] = useState<NotificationSettings>({})

	const setNotification_ = useCallback((props: NotificationSettings) => {
		setNotification(props)
		const { disallowClose, timeout } = props
		if (!disallowClose && timeout !== 0) {
			setTimeout(() => {
				setNotification({ isOpen: false })
			}, timeout || 1000 * 5)
		}
	}, [])

	const setNotificationFailed = (props: NotificationSettings) => {
		setNotification({
			isOpen: true,
			color: 'red',
			icon: <X size={18} />,
			text: 'Something Went Wrong!',
		})
	}

	const setNotificationSuccess = (props: NotificationSettings) => {
		setNotification({
			isOpen: true,
			color: 'teal',
			icon: <Check size={18} />,
			text: 'Successfully updated Master Password!',
		})
	}

	return (
		<context.Provider
			value={{
				notification,
				setNotification: setNotification_,
				setNotificationFailed,
				setNotificationSuccess,
			}}
			{...props}
		/>
	)
}

export const useNotification = () => useContext(context)

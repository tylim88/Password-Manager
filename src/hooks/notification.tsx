import React, {
	useContext,
	createContext,
	PropsWithChildren,
	useState,
	useCallback,
	useEffect,
} from 'react'
import { NotificationProps } from '@mantine/core'
import { X, Check } from 'tabler-icons-react'
import { useInterval } from '@mantine/hooks'

type NotificationSettings = NotificationProps &
	React.RefAttributes<HTMLDivElement> &
	Partial<{ isOpen: boolean; text: string }> & { timeout: number }

const context = createContext<{
	notification: NotificationSettings
	setNotification: (props: Partial<NotificationSettings>) => void
	setNotificationFailed: (props: Partial<NotificationSettings>) => void
	setNotificationSuccess: (props: Partial<NotificationSettings>) => void
	setNotificationLoading: (props: Partial<NotificationSettings>) => void
	progress: number
	// @ts-expect-error
}>({})

const defaultTimeout = 5000

const step = 50

export const NotificationProvider = (props: PropsWithChildren<{}>) => {
	const [notification, setNotification] = useState<NotificationSettings>({
		timeout: defaultTimeout,
	})
	const [milliseconds, setMilliseconds] = useState(0)
	const interval = useInterval(() => setMilliseconds(s => s + step), step)

	useEffect(() => {
		if (notification.isOpen && !notification.disallowClose) {
			interval.start()
			return () => {
				interval.stop()
				setMilliseconds(0)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [notification.isOpen, notification.disallowClose]) // ! dont put interval into dependency

	const setNotification_ = useCallback(
		(props: Partial<NotificationSettings>) => {
			setNotification({ ...props, timeout: props.timeout || defaultTimeout })
			const { disallowClose, timeout } = props
			if (!disallowClose && timeout !== 0) {
				setTimeout(() => {
					setNotification({ isOpen: false, timeout: defaultTimeout })
				}, timeout || defaultTimeout)
			}
		},
		[]
	)

	const initial = {
		timeout: defaultTimeout,
		isOpen: true,
		onClose: () => setNotification({ timeout: defaultTimeout }),
	}

	const setNotificationFailed = (props: Partial<NotificationSettings>) => {
		setNotification_({
			color: 'red',
			icon: <X size={18} />,
			text: 'Something Went Wrong!',
			...initial,
			...props,
		})
	}

	const setNotificationSuccess = (props: Partial<NotificationSettings>) => {
		setNotification_({
			color: 'teal',
			icon: <Check size={18} />,
			text: 'Success!',
			...initial,
			...props,
		})
	}

	const setNotificationLoading = (props: Partial<NotificationSettings>) => {
		setNotification_({
			loading: true,
			text: 'Loading, Please Wait...',
			disallowClose: true,
			...initial,
			...props,
		})
	}

	return (
		<context.Provider
			value={{
				notification,
				setNotification: setNotification_,
				setNotificationFailed,
				setNotificationSuccess,
				setNotificationLoading,
				progress: (milliseconds / notification.timeout) * 100,
			}}
			{...props}
		/>
	)
}

export const useNotification = () => useContext(context)

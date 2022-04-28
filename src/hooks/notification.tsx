import React, {
	useContext,
	createContext,
	PropsWithChildren,
	useState,
	useCallback,
	useEffect,
	useMemo,
} from 'react'
import { NotificationProps } from '@mantine/core'
import { X, Check } from 'tabler-icons-react'
import { useInterval } from '@mantine/hooks'

type NotificationSettings = NotificationProps &
	React.RefAttributes<HTMLDivElement> &
	Partial<{ isOpen: boolean; text: string; timeout: number }>

const context = createContext<{
	notification: NotificationSettings
	setNotification: (props: NotificationSettings) => void
	setNotificationFailed: (props: NotificationSettings) => void
	setNotificationSuccess: (props: NotificationSettings) => void
	setNotificationLoading: (props: NotificationSettings) => void
	progress: number
	// @ts-expect-error
}>({})

const defaultTimeout = 5000

const step = 50

export const NotificationProvider = (props: PropsWithChildren<{}>) => {
	const [notification, setNotification] = useState<NotificationSettings>({})
	const [milliseconds, setMilliseconds] = useState(0)
	const interval = useInterval(() => setMilliseconds(s => s + step), step)

	useEffect(() => {
		if (
			notification.isOpen &&
			!notification.disallowClose &&
			notification.timeout !== 0
		) {
			interval.start()
			return () => {
				interval.stop()
				setMilliseconds(0)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [notification.isOpen, notification.disallowClose, notification.timeout]) // ! dont put interval into dependency

	const commonOpenState = useMemo(
		() => ({
			isOpen: true,
			onClose: () => setNotification({}),
		}),
		[]
	)
	const setNotification_ = useCallback(
		(props: NotificationSettings) => {
			setNotification({
				...commonOpenState,
				...props,
			})
			const { disallowClose, timeout } = props
			if (!disallowClose && timeout !== 0) {
				setTimeout(() => {
					setNotification({})
				}, timeout || defaultTimeout)
			}
		},
		[commonOpenState]
	)

	const setNotificationFailed = useCallback(
		(props: NotificationSettings) => {
			setNotification_({
				color: 'red',
				icon: <X size={18} />,
				text: 'Something Went Wrong!',
				...commonOpenState,
				...props,
			})
		},
		[commonOpenState, setNotification_]
	)

	const setNotificationSuccess = useCallback(
		(props: NotificationSettings) => {
			setNotification_({
				color: 'teal',
				icon: <Check size={18} />,
				text: 'Success!',
				...commonOpenState,
				...props,
			})
		},
		[commonOpenState, setNotification_]
	)

	const setNotificationLoading = useCallback(
		(props: NotificationSettings) => {
			setNotification_({
				loading: true,
				text: 'Loading, Please Wait...',
				disallowClose: true,
				...commonOpenState,
				...props,
			})
		},
		[commonOpenState, setNotification_]
	)

	return (
		<context.Provider
			value={{
				notification,
				setNotification: setNotification_,
				setNotificationFailed,
				setNotificationSuccess,
				setNotificationLoading,
				progress:
					(milliseconds / (notification.timeout || defaultTimeout)) * 100,
			}}
			{...props}
		/>
	)
}

export const useNotification = () => useContext(context)

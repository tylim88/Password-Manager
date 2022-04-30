import {
	useContext,
	createContext,
	PropsWithChildren,
	useCallback,
} from 'react'
import { X, Check } from 'tabler-icons-react'
import {
	NotificationsProvider,
	showNotification,
	NotificationProps,
	updateNotification,
} from '@mantine/notifications'
import { v4 } from 'uuid'

const context = createContext<{
	setNotificationFailed: (
		props: OmitKeys<NotificationProps, 'message'> & {
			message?: string
		}
	) => void
	setNotificationSuccess: (
		props: OmitKeys<NotificationProps, 'message'> & {
			message?: string
		}
	) => void
	setNotificationStay: (
		props: OmitKeys<NotificationProps, 'message'> & {
			message?: string
		}
	) => void
	setNotificationLoading: (
		props: OmitKeys<NotificationProps, 'message'> & {
			message?: string
		}
	) => () => void
	// @ts-expect-error
}>({})

export const NotificationProvider = (props: PropsWithChildren<{}>) => {
	const setNotificationFailed = useCallback(
		(
			props: OmitKeys<NotificationProps, 'message'> & {
				message?: string
			}
		) => {
			showNotification({
				title: 'Notification',
				autoClose: 10000,
				color: 'red',
				icon: <X size={18} />,
				message: 'Something Went Wrong!',
				...props,
			})
		},
		[]
	)

	const setNotificationSuccess = useCallback(
		(
			props: OmitKeys<NotificationProps, 'message'> & {
				message?: string
			}
		) => {
			showNotification({
				title: 'Notification',
				autoClose: 3000,
				color: 'teal',
				icon: <Check size={18} />,
				message: 'Success!',
				...props,
			})
		},
		[]
	)

	const setNotificationLoading = useCallback(
		(
			props: OmitKeys<NotificationProps, 'message'> & {
				message?: string
			}
		) => {
			const id = v4()
			showNotification({
				id,
				title: 'Notification',
				autoClose: false,
				message: 'Loading, Please Wait...',
				loading: true,
				...props,
			})

			return () => {
				updateNotification({
					id,
					autoClose: 0,
					message: 'Loading, Please Wait...',
				})
			}
		},
		[]
	)

	const setNotificationStay = useCallback(
		(
			props: OmitKeys<NotificationProps, 'message'> & {
				message?: string
			}
		) => {
			showNotification({
				title: 'Notification',
				autoClose: false,
				message: 'Hello!',
				...props,
			})
		},
		[]
	)
	return (
		<NotificationsProvider position='top-right'>
			<context.Provider
				value={{
					setNotificationFailed,
					setNotificationSuccess,
					setNotificationLoading,
					setNotificationStay,
				}}
				{...props}
			/>
		</NotificationsProvider>
	)
}

export const useNotification = () => useContext(context)

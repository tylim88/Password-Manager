import React, {
	useContext,
	createContext,
	PropsWithChildren,
	useState,
} from 'react'
import { ModalProps } from '@mantine/core'
import { useAuth } from './auth'
import { usePasswords } from './password'
import { HttpsCallableResult } from 'firebaseHelper'
import { cloneDeep } from 'lodash'
import { isUnique } from 'schema'

type Modal = ModalProps &
	Secret & {
		onRequest: (value: Secret) => Promise<HttpsCallableResult<null>>
		validate: (values: { site: string; username: string }) => null | string
	}

const context = createContext<{
	modal: Modal
	setModal: React.Dispatch<React.SetStateAction<Modal>>
	editPasswordModal: (info: Secret, index: number) => void
	addPasswordModal: (info: Secret, index: number) => void
	// @ts-expect-error
}>({})

export const PasswordModalProvider = (props: PropsWithChildren<{}>) => {
	const [modal, setModal] = useState<Modal>({
		onRequest: async () => ({ data: null }),
		onClose: () => {},
		opened: false,
		username: '',
		site: '',
		password: '',
		validate: () => null,
	})
	const { resetCallbackObj } = useAuth()
	const { passwords, updatePasswords } = usePasswords()

	const reset = () =>
		setModal({
			onRequest: async () => ({ data: null }),
			onClose: () => {},
			opened: false,
			username: '',
			site: '',
			password: '',
			validate: () => null,
		})

	resetCallbackObj['modal'] = reset

	const editPasswordModal = (props: Secret, index: number) => {
		setModal({
			onClose: reset,
			onRequest: (value: Secret) => {
				const clone = cloneDeep(passwords)
				clone[index] = value
				return updatePasswords(clone)
			},
			opened: true,
			title: 'Edit Password',
			validate: isUnique(props),
			...props,
		})
	}

	const addPasswordModal = (props: Secret) => {
		setModal({
			onClose: reset,
			onRequest: (value: Secret) => {
				return updatePasswords([value, ...passwords])
			},
			opened: true,
			validate: isUnique(props),
			title: 'Add New Password',
			...props,
		})
	}

	return (
		<context.Provider
			value={{ modal, setModal, editPasswordModal, addPasswordModal }}
			{...props}
		/>
	)
}

export const usePasswordModal = () => useContext(context)

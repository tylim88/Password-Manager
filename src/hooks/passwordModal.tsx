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
import { cloneDeep, find } from 'lodash'

type Modal = ModalProps & { initialValues: Secret } & {
	onRequest: (value: Secret) => Promise<HttpsCallableResult<null>>
	validate: (values: { site: string; username: string }) => null | string
}

const context = createContext<{
	modal: Modal
	setModal: React.Dispatch<React.SetStateAction<Modal>>
	editPassword: (initialValues: Secret, index: number) => void
	addPassword: (initialValues: Secret, index: number) => void
	deletePassword: (initialValues: Secret, index: number) => void
	// @ts-expect-error
}>({})

export const PasswordModalProvider = (props: PropsWithChildren<{}>) => {
	const [modal, setModal] = useState<Modal>({
		onRequest: async () => ({ data: null }),
		onClose: () => {},
		opened: false,
		initialValues: { username: '', site: '', password: '' },
		validate: () => null,
	})
	const { resetCallbackObj } = useAuth()
	const { passwords, updatePasswords } = usePasswords()

	const reset = () =>
		setModal({
			onRequest: async () => ({ data: null }),
			onClose: () => {},
			opened: false,
			initialValues: { username: '', site: '', password: '' },
			validate: () => null,
		})

	resetCallbackObj['modal'] = reset

	const editPassword = (initialValues: Secret, index: number) => {
		setModal({
			onClose: reset,
			onRequest: async (value: Secret) => {
				const newPasswords = cloneDeep(passwords)
				newPasswords[index] = value
				return updatePasswords(newPasswords)
			},
			opened: true,
			title: 'Edit Password',
			validate: isUnique(initialValues),
			initialValues,
		})
	}

	const deletePassword = (initialValues: Secret, index: number) => {
		setModal({
			onClose: reset,
			onRequest: async (value: Secret) => {
				const newPasswords = cloneDeep(passwords)
				newPasswords[index] = value
				return updatePasswords(newPasswords)
			},
			opened: true,
			title: 'Delete Password',
			validate: isUnique(initialValues),
			initialValues,
		})
	}

	const isUnique =
		(oldValues: { site: string; username: string }) =>
		(newValues: { site: string; username: string }) => {
			const exist = find(passwords, newValues)
			if (
				oldValues.site !== newValues.site &&
				oldValues.username !== newValues.username &&
				exist
			) {
				return 'Site and username already exist'
			}
			return null
		}

	const addPassword = (initialValues: Secret) => {
		setModal({
			onClose: reset,
			onRequest: async (value: Secret) => {
				const newPasswords = [value, ...passwords]
				return updatePasswords(newPasswords)
			},
			opened: true,
			validate: isUnique(initialValues),
			title: 'Add New Password',
			initialValues,
		})
	}

	return (
		<context.Provider
			value={{
				modal,
				setModal,
				editPassword,
				addPassword,
				deletePassword,
			}}
			{...props}
		/>
	)
}

export const usePasswordModal = () => useContext(context)

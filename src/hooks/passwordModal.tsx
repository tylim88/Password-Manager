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

type Modal = ModalProps & { initialValues: Secret } & {
	onRequest: (value: Secret) => Promise<HttpsCallableResult<null>>
	validate: (values: { site: string; username: string }) => null | string
}

const context = createContext<{
	modal: Modal
	setModal: React.Dispatch<React.SetStateAction<Modal>>
	editPassword: (index: number) => void
	addPassword: () => void
	deletePassword: (index: number) => void
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

	const reset = () => {
		setModal({
			onRequest: async () => ({ data: null }),
			onClose: () => {},
			opened: false,
			initialValues: { username: '', site: '', password: '' },
			validate: () => null,
		})
	}

	resetCallbackObj['modal'] = reset

	const isUnique =
		(index: number) =>
		({ site, username }: { site: string; username: string }) => {
			const arr = passwords.reduce<number[]>((acc, item, i) => {
				item.site === site &&
					item.username === username &&
					i !== index &&
					acc.push(index)
				return acc
			}, [])
			if (arr.length) {
				return 'Site and username combination already exist'
			}
			return null
		}

	const editPassword = (index: number) => {
		const initialValues = cloneDeep(passwords)[index]
		initialValues &&
			setModal({
				onClose: reset,
				onRequest: async (value: Secret) => {
					const newPasswords = cloneDeep(passwords)
					newPasswords[index] = value
					reset()
					return updatePasswords(newPasswords)
				},
				opened: true,
				title: 'Edit Password',
				validate: isUnique(index),
				initialValues,
			})
	}

	const deletePassword = (index: number) => {
		const newPasswords = cloneDeep(passwords)
		newPasswords.splice(index, 1)
		return updatePasswords(newPasswords)
	}

	const addPassword = () => {
		const initialValues = { site: '', username: '', password: '' }
		setModal({
			onClose: reset,
			onRequest: async (value: Secret) => {
				const newPasswords = [value, ...cloneDeep(passwords)]
				reset()
				return updatePasswords(newPasswords)
			},
			opened: true,
			validate: isUnique(-1),
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

import React, {
	useContext,
	createContext,
	PropsWithChildren,
	useState,
	useRef,
} from 'react'
import { useAuth } from './auth'
import {
	verifyMasterPasswordSchema,
	setMasterPasswordSchema,
	updateMasterPasswordSchema,
} from 'schema'
import { callableCreator, HttpsCallableResult } from 'firebaseHelper'
import { useNotification } from 'hooks'

const context = createContext<{
	masterPassword: string | null
	setMasterPassword: React.Dispatch<React.SetStateAction<string | null>>
	loading: boolean
	verifyMasterPassword: (
		inputMasterPassword: string
	) => Promise<HttpsCallableResult<Secret[]>>
	setupMasterPassword: (
		inputMasterPassword: string
	) => Promise<HttpsCallableResult<null>>
	changeMasterPassword: (inputMasterPassword: {
		oldMasterPassword: string
		newMasterPassword: string
	}) => Promise<HttpsCallableResult<null>>
	ref: React.MutableRefObject<(passwords: Secret[]) => void>
	// @ts-expect-error
}>({})

export const MasterPasswordProvider = (props: PropsWithChildren<{}>) => {
	const [masterPassword, setMasterPassword] = useState<string | null>(null)
	const ref = useRef<(passwords: Secret[]) => void>(() => {})
	const [loading, setLoading] = useState(false)
	const { resetCallbackObj } = useAuth()

	const {
		setNotificationFailed,
		setNotificationSuccess,
		setNotificationLoading,
	} = useNotification()

	resetCallbackObj['masterPassword'] = () => {
		setMasterPassword(null)
		setLoading(false)
	}

	const changeMasterPassword = async ({
		oldMasterPassword,
		newMasterPassword,
	}: {
		oldMasterPassword: string
		newMasterPassword: string
	}) => {
		const close = setNotificationLoading({
			message: 'Updating Master Password Please Wait...',
		})
		const result = await callableCreator(updateMasterPasswordSchema)({
			oldMasterPassword,
			newMasterPassword,
		})
			.then(result => {
				setMasterPassword(newMasterPassword)
				setNotificationSuccess({
					message: 'Successfully Updated Master Password!',
				})
				return result
			})
			.catch(e => {
				close()
				setNotificationFailed({
					message: 'Update Master Password Failed!',
				})
				throw e
			})

		close()
		return result
	}

	const setupMasterPassword = async (inputMasterPassword: string) => {
		const close = setNotificationLoading({
			message: 'Encrypting Master Password Please Wait...',
		})
		const result = await callableCreator(setMasterPasswordSchema)(
			inputMasterPassword
		)
			.then(result => {
				setMasterPassword(inputMasterPassword)
				setNotificationSuccess({
					message: 'Successfully Added Master Password!',
				})

				return result
			})
			.catch(e => {
				close()
				setNotificationFailed({
					message: 'Something Went Wrong!',
				})

				throw e
			})
		close()
		return result
	}

	const verifyMasterPassword = async (inputMasterPassword: string) => {
		setLoading(true)
		const close = setNotificationLoading({
			message: 'Decrypting Passwords Please Wait...',
		})
		const result = await callableCreator(verifyMasterPasswordSchema)(
			inputMasterPassword
		)
			.then(result => {
				const { data } = result
				if (data) {
					setMasterPassword(inputMasterPassword)
					setNotificationSuccess({
						message: 'Successfully Decrypted Password!',
					})
					ref.current(data)
					// continue on notification hook
				} else {
					// this should not happen, page hook takes care of this
					setNotificationFailed({
						message: 'No Master Password!',
					})
				}
				return result
			})
			.catch(e => {
				close()
				setNotificationFailed({
					message: 'Incorrect Master Password!',
				})
				throw e
			})
		close()
		setLoading(false)
		return result
	}

	return (
		<context.Provider
			value={{
				masterPassword,
				setMasterPassword,
				verifyMasterPassword,
				setupMasterPassword,
				changeMasterPassword,
				loading,
				ref,
			}}
			{...props}
		/>
	)
}

export const useMasterPassword = () => useContext(context)

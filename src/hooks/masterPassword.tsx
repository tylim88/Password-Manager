import React, {
	useContext,
	createContext,
	PropsWithChildren,
	useState,
} from 'react'
import { useAuth } from './auth'
import {
	verifyMasterPasswordSchema,
	setMasterPasswordSchema,
	updateMasterPasswordSchema,
} from 'schema'
import { callableCreator, HttpsCallableResult } from 'firebaseHelper'
import { useNotification } from 'hooks'
import { v4 } from 'uuid'

const context = createContext<{
	masterPassword: string | null
	setMasterPassword: React.Dispatch<React.SetStateAction<string | null>>
	verifying: string
	setVerifying: React.Dispatch<React.SetStateAction<string>>
	verifyMasterPassword: (
		inputMasterPassword: string
	) => Promise<HttpsCallableResult<boolean>>
	setupMasterPassword: (
		inputMasterPassword: string
	) => Promise<HttpsCallableResult<null>>
	changeMasterPassword: (inputMasterPassword: {
		oldMasterPassword: string
		newMasterPassword: string
	}) => Promise<HttpsCallableResult<null>>
	// @ts-expect-error
}>({})

export const MasterPasswordProvider = (props: PropsWithChildren<{}>) => {
	const [masterPassword, setMasterPassword] = useState<string | null>(null)
	const [verifying, setVerifying] = useState('')
	const { resetCallbackObj } = useAuth()
	const {
		setNotificationFailed,
		setNotificationSuccess,
		setNotificationLoading,
	} = useNotification()

	resetCallbackObj['masterPassword'] = () => {
		setMasterPassword(null)
		setVerifying('')
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
				setNotificationFailed({
					message: 'Something Went Wrong!',
				})

				throw e
			})
		close()
		return result
	}

	const verifyMasterPassword = async (inputMasterPassword: string) => {
		const id = v4()
		setVerifying(id)
		setNotificationLoading({
			id,
			message: 'Decrypting Passwords Please Wait...',
		}) // close in password
		const result = await callableCreator(verifyMasterPasswordSchema)(
			inputMasterPassword
		)
			.then(result => {
				const { data } = result
				if (data) {
					setMasterPassword(inputMasterPassword)
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
				setNotificationFailed({
					message: 'Incorrect Master Password!',
				})
				throw e
			})
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
				verifying,
				setVerifying,
			}}
			{...props}
		/>
	)
}

export const useMasterPassword = () => useContext(context)

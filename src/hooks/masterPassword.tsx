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

const context = createContext<{
	masterPassword: string | null
	setMasterPassword: React.Dispatch<React.SetStateAction<string | null>>
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
}>({
	masterPassword: null,
	setMasterPassword: () => {},
})

export const MasterPasswordProvider = (props: PropsWithChildren<{}>) => {
	const [masterPassword, setMasterPassword] = useState<string | null>(null)
	const { resetCallbackObj } = useAuth()
	const { setNotificationFailed, setNotificationSuccess } = useNotification()

	resetCallbackObj['masterPassword'] = () => setMasterPassword(null)

	const changeMasterPassword = ({
		oldMasterPassword,
		newMasterPassword,
	}: {
		oldMasterPassword: string
		newMasterPassword: string
	}) => {
		return callableCreator(updateMasterPasswordSchema)({
			oldMasterPassword,
			newMasterPassword,
		})
			.then(result => {
				setMasterPassword(newMasterPassword)
				setNotificationSuccess({
					text: 'Successfully updated Master Password!',
				})
				return result
			})
			.catch(e => {
				setNotificationFailed({
					text: 'Update Master Password Failed!',
				})
				throw e
			})
	}

	const setupMasterPassword = (inputMasterPassword: string) => {
		return callableCreator(setMasterPasswordSchema)(inputMasterPassword)
			.then(result => {
				setMasterPassword(masterPassword)
				setNotificationSuccess({
					text: 'Successfully added Master Password!',
				})

				return result
			})
			.catch(e => {
				setNotificationFailed({
					text: 'Something Went Wrong!',
				})

				throw e
			})
	}

	const verifyMasterPassword = (inputMasterPassword: string) => {
		return callableCreator(verifyMasterPasswordSchema)(inputMasterPassword)
			.then(result => {
				const { data } = result
				if (data) {
					setMasterPassword(masterPassword)
					setNotificationSuccess({
						text: 'Everything Looks Good!',
					})
				} else {
					setNotificationFailed({
						text: 'Incorrect Master Password!',
					})
				}
				return result
			})
			.catch(e => {
				setNotificationFailed({
					text: 'Master Password Verification Failed',
				})
				throw e
			})
	}

	return (
		<context.Provider
			value={{
				masterPassword,
				setMasterPassword,
				verifyMasterPassword,
				setupMasterPassword,
				changeMasterPassword,
			}}
			{...props}
		/>
	)
}

export const useMasterPassword = () => useContext(context)

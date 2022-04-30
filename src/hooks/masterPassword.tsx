import React, {
	useContext,
	createContext,
	PropsWithChildren,
	useState,
	useRef,
} from 'react'
import { useAuth } from './auth'
import { userFirelordRef } from 'firebaseHelper'
import { useNotification } from 'hooks'
import { runTransaction, getDoc, updateDoc } from 'firelordjs'
import {
	hashMasterPassword,
	verifyMasterPasswordHash,
	decryptPasswords,
	encryptPasswords,
} from './hashingAndEncryption'

const context = createContext<{
	masterPassword: string | null
	setMasterPassword: React.Dispatch<React.SetStateAction<string | null>>
	loading: boolean
	verifyMasterPassword: (inputMasterPassword: string) => Promise<void>
	setupMasterPassword: (inputMasterPassword: string) => Promise<void>
	changeMasterPassword: (inputMasterPassword: string) => Promise<void>
	ref: React.MutableRefObject<(passwords: Secret[]) => void>
	// @ts-expect-error
}>({})

export const MasterPasswordProvider = (props: PropsWithChildren<{}>) => {
	const [masterPassword, setMasterPassword] = useState<string | null>(null)
	const ref = useRef<(passwords: Secret[]) => void>(() => {})
	const [loading, setLoading] = useState(false)
	const { resetCallbackObj, user } = useAuth()
	const [passwords, setPasswords] = useState<Secret[]>([]) // seem like a little overlap with password hook

	const {
		setNotificationFailed,
		setNotificationSuccess,
		setNotificationLoading,
	} = useNotification()

	resetCallbackObj['masterPassword'] = () => {
		setPasswords([])
		setMasterPassword(null)
		setLoading(false)
	}

	const changeMasterPassword = async (inputMasterPassword: string) => {
		if (!user) {
			// this should never happen
			throw Error('user not logged in')
		}
		const close = setNotificationLoading({
			message: 'Updating Master Password Please Wait...',
		})
		const userDocRef = userFirelordRef.doc(user.uid)
		const updateData = {
			masterPasswordHash: await hashMasterPassword(inputMasterPassword),
			encryptedPasswords: await encryptPasswords(
				JSON.stringify(passwords),
				inputMasterPassword
			),
		}
		await updateDoc(userDocRef, updateData).catch(e => {
			close()
			setNotificationFailed({
				message: 'Update Master Password Failed!',
			})
			throw e
		})
		setMasterPassword(inputMasterPassword)
		close()
		setNotificationSuccess({
			message: 'Successfully Updated Master Password!',
		})
	}

	const setupMasterPassword = async (inputMasterPassword: string) => {
		if (!user) {
			// this should never happen
			throw Error('user not logged in')
		}
		const close = setNotificationLoading({
			message: 'Encrypting Master Password Please Wait...',
		})
		const userDocRef = userFirelordRef.doc(user.uid)
		await runTransaction(async transaction => {
			// if master password already exist, return error
			const snapshot = await transaction.get(userDocRef)
			const data = snapshot.data() as User | undefined
			if (data) {
				throw Error('Master Password Already Exists')
			}

			// else set status to true and set the first master password
			const setData: User = {
				masterPasswordHash: await hashMasterPassword(inputMasterPassword),
				encryptedPasswords: null,
			}

			transaction.set(userDocRef, setData)

			setMasterPassword(inputMasterPassword)
			close()
			setNotificationSuccess({
				message: 'Successfully Added Master Password!',
			})
		}).catch(err => {
			close()
			setNotificationFailed({
				message: err?.message || 'Add Passwords Failed!',
			})
			throw err
		})
	}

	const verifyMasterPassword = async (inputMasterPassword: string) => {
		if (!user) {
			// this should never happen
			throw Error('user not logged in')
		}
		setLoading(true)
		const userDocRef = userFirelordRef.doc(user.uid)

		// if master password not exist, return error
		const passwordsSnapshot = await getDoc(userDocRef).catch(err => {
			setNotificationFailed({
				message: 'Load Passwords Failed!',
			})
			throw err
		})
		const passwordsData = passwordsSnapshot.data()
		if (!passwordsData) {
			throw Error('Master Password Not Exists')
		}
		const { masterPasswordHash, encryptedPasswords } = passwordsData
		// if hash does not valid, return error
		const valid = await verifyMasterPasswordHash({
			hash: masterPasswordHash,
			masterPassword: inputMasterPassword,
		})
		if (!valid) {
			setNotificationFailed({
				message: 'Incorrect Master Password!',
			})
			throw Error('Incorrect Master Password')
		}
		if (encryptedPasswords) {
			const decrypted = decryptPasswords(
				encryptedPasswords,
				inputMasterPassword
			)
			const parsed = JSON.parse(decrypted) as Secret[]
			setPasswords(parsed)
			ref.current(parsed)
		}
		setMasterPassword(inputMasterPassword)

		setNotificationSuccess({
			message: 'Successfully Decrypted Password!',
		})
		setLoading(false)
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

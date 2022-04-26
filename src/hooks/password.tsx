import React, {
	useContext,
	createContext,
	PropsWithChildren,
	useState,
} from 'react'
import { callableCreator } from 'firebaseHelper'
import { getPasswordsSchema } from 'schema'
import { z } from 'zod'

type DataType = z.infer<typeof getPasswordsSchema['res']>

const context = createContext<{
	passwords: DataType
	getPassword: (masterPassword: string) => Promise<void>
}>({ passwords: [], getPassword: async () => {} })

export const PasswordsProvider = (props: PropsWithChildren<{}>) => {
	const [passwords, setPasswords] = useState<DataType>([])

	const getPassword = (masterPassword: string) => {
		return callableCreator(getPasswordsSchema)(masterPassword).then(result => {
			const data = result.data
			setPasswords(data)
		})
	}

	return <context.Provider value={{ passwords, getPassword }} {...props} />
}

export const usePasswords = () => useContext(context)

import React, {
	useContext,
	createContext,
	PropsWithChildren,
	useState,
} from 'react'
import { callableCreator } from 'firebaseHelper'
import { getPasswordListSchema } from 'schema'
import { z } from 'zod'

type DataType = z.infer<typeof getPasswordListSchema['res']>

const context = createContext<{
	passwords: DataType
	getPassword: () => Promise<void>
}>({ passwords: [], getPassword: async () => {} })

export const PasswordsProvider = (props: PropsWithChildren<{}>) => {
	const [passwords, setPasswords] = useState<DataType>([])

	const getPassword = () => {
		return callableCreator(getPasswordListSchema)(null).then(result => {
			const data = result.data
			setPasswords(data)
		})
	}

	return <context.Provider value={{ passwords, getPassword }} {...props} />
}

export const usePasswords = () => useContext(context)

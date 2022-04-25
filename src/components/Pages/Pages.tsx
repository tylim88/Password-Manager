import React from 'react'
import { usePage } from 'hooks'
import { Login } from '../Login'
import { SetupMasterPassword } from '../SetupMasterPassword'

export const Pages = () => {
	const { page } = usePage()

	return page === 'Sign Up/Login' ? (
		<Login />
	) : page === 'Setup Master Password' ? (
		<SetupMasterPassword />
	) : null
}

import React from 'react'
import { usePage, useNotification } from 'hooks'
import { Login } from '../Login'
import { SetupMasterPassword } from '../SetupMasterPassword'
import { ChangeMasterPassword } from '../ChangeMasterPassword'
import { LoadingPage } from '../LoadingPage'
import { VerifyMasterPassword } from '../VerifyMasterPassword'

import { Notification, Box } from '@mantine/core'

export const Pages = () => {
	const { page } = usePage()
	const {
		notification: { isOpen, text, ...rest },
		setNotification,
	} = useNotification()

	return (
		<>
			{isOpen && (
				<Box
					sx={{
						width: '100%',
						position: 'relative',
						display: 'flex',
						justifyContent: 'flex-end',
					}}
				>
					<Notification
						title='Notification'
						sx={{ width: '400px', position: 'absolute' }}
						{...rest}
						onClose={() => {
							setNotification({
								isOpen: false,
							})
						}}
					>
						{text || 'default text'}
					</Notification>
				</Box>
			)}
			<LoadingPage
				stackProps={{
					sx: {
						width: '150px',
						height: '150px',
					},
				}}
				loaderProps={{ sx: { width: '100%', height: '100%' } }}
			>
				{page === 'Sign Up/Login' ? (
					<Login />
				) : page === 'Setup Master Password' ? (
					<SetupMasterPassword />
				) : page === 'Change Master Password' ? (
					<ChangeMasterPassword />
				) : page === 'Verify Master Password' ? (
					<VerifyMasterPassword />
				) : null}
			</LoadingPage>
		</>
	)
}

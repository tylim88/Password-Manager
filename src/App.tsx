import { useState, useEffect } from 'react'
import {
	MantineProvider,
	ColorSchemeProvider,
	ColorScheme,
} from '@mantine/core'
import { AppShell } from 'AppShell'
import {
	AuthProvider,
	UserProvider,
	PageProvider,
	PasswordsProvider,
	MasterPasswordProvider,
	NotificationProvider,
	PasswordModalProvider,
} from 'hooks'

import { Compose, PasswordModal } from 'components'
import localforage from 'localforage'

const key = 'colorScheme'
export const App = () => {
	const [colorScheme, setColorScheme] = useState<ColorScheme>('light')
	const nextColorScheme = colorScheme === 'light' ? 'dark' : 'light'
	const toggleColorScheme = async (value?: ColorScheme) => {
		await localforage.setItem(key, nextColorScheme)
		setColorScheme(value || nextColorScheme)
	}
	useEffect(() => {
		localforage.getItem(key).then(value => {
			setColorScheme((value as ColorScheme) || 'light')
		})
	}, [])
	return (
		<Compose
			components={[
				NotificationProvider,
				AuthProvider,
				MasterPasswordProvider,
				UserProvider,
				PasswordsProvider,
				PasswordModalProvider,
				PageProvider,
			]}
		>
			<ColorSchemeProvider
				colorScheme={colorScheme}
				toggleColorScheme={toggleColorScheme}
			>
				<MantineProvider theme={{ colorScheme }}>
					<>
						<PasswordModal />
						<AppShell />
					</>
				</MantineProvider>
			</ColorSchemeProvider>
		</Compose>
	)
}

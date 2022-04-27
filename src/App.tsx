import { useState } from 'react'
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
} from 'hooks'

import { Compose } from 'components'

export const App = () => {
	const [colorScheme, setColorScheme] = useState<ColorScheme>('light')
	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

	return (
		<Compose
			components={[
				NotificationProvider,
				AuthProvider,
				MasterPasswordProvider,
				UserProvider,
				PasswordsProvider,
				PageProvider,
			]}
		>
			<ColorSchemeProvider
				colorScheme={colorScheme}
				toggleColorScheme={toggleColorScheme}
			>
				<MantineProvider theme={{ colorScheme }}>
					<AppShell />
				</MantineProvider>
			</ColorSchemeProvider>
		</Compose>
	)
}

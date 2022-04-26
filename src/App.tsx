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
} from 'hooks'

export const App = () => {
	const [colorScheme, setColorScheme] = useState<ColorScheme>('light')
	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

	return (
		<AuthProvider>
			<UserProvider>
				<PasswordsProvider>
					<PageProvider>
						<ColorSchemeProvider
							colorScheme={colorScheme}
							toggleColorScheme={toggleColorScheme}
						>
							<MantineProvider theme={{ colorScheme }}>
								<AppShell />
							</MantineProvider>
						</ColorSchemeProvider>
					</PageProvider>
				</PasswordsProvider>
			</UserProvider>
		</AuthProvider>
	)
}

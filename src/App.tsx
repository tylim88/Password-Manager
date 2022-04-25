import { useState } from 'react'
import {
	MantineProvider,
	ColorSchemeProvider,
	ColorScheme,
} from '@mantine/core'
import { AppShell } from 'AppShell'
import {
	UserProvider,
	AccountProvider,
	PageProvider,
	PasswordsProvider,
} from 'hooks'

export const App = () => {
	const [colorScheme, setColorScheme] = useState<ColorScheme>('light')
	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

	return (
		<UserProvider>
			<AccountProvider>
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
			</AccountProvider>
		</UserProvider>
	)
}

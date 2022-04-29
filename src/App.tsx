import { MantineProvider, ColorSchemeProvider } from '@mantine/core'
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
import { useLocalStorage } from '@mantine/hooks'

export const App = () => {
	const [colorScheme, setColorScheme] = useLocalStorage<'light' | 'dark'>({
		key: 'color-scheme',
		defaultValue: 'dark',
	})
	const toggleColorScheme = () =>
		setColorScheme(current => (current === 'dark' ? 'light' : 'dark'))

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

import { usePage } from 'hooks'
import { Login } from '../Login'
import { SetupMasterPassword } from '../SetupMasterPassword'
import { ChangeMasterPassword } from '../ChangeMasterPassword'
import { LoadingPage } from '../LoadingPage'
import { VerifyMasterPassword } from '../VerifyMasterPassword'
import { PasswordList } from '../PasswordList'

export const Pages = () => {
	const { page } = usePage()

	return (
		<>
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
				) : page === 'Password List' ? (
					<PasswordList />
				) : null}
			</LoadingPage>
		</>
	)
}

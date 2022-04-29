import {
	List,
	Login,
	Logout,
	LockSquare,
	LockAccess,
	Id,
} from 'tabler-icons-react'
import { useAuth, useUser, usePage, Page, useMasterPassword } from 'hooks'
import { ThemeIcon, UnstyledButton, Group } from '@mantine/core'
import { auth } from 'firebaseHelper'
import { LoadingPage } from '../LoadingPage'
import { Text } from '../Text'

type MainLinkProps = {
	icon: React.ReactNode
	color: string
	label: Page | 'Logout'
}

const MainLink = ({ icon, color, label }: MainLinkProps) => {
	const { setPage } = usePage()
	return (
		<UnstyledButton
			sx={theme => ({
				display: 'block',
				width: '100%',
				padding: theme.spacing.xs,
				borderRadius: theme.radius.sm,
				color:
					theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

				'&:hover': {
					backgroundColor:
						theme.colorScheme === 'dark'
							? theme.colors.dark[6]
							: theme.colors.gray[0],
				},
			})}
			onClick={() => {
				if (label === 'Logout') {
					auth.signOut()
				} else {
					setPage(label)
				}
			}}
		>
			<Group>
				<ThemeIcon color={color} variant='light'>
					{icon}
				</ThemeIcon>

				<Text size='sm'>{label}</Text>
			</Group>
		</UnstyledButton>
	)
}

export const MainLinks = () => {
	const { user } = useAuth()
	const { user: userAuth } = useUser()
	const { masterPassword } = useMasterPassword()

	const links = (
		user
			? userAuth?.hasMasterPassword
				? masterPassword
					? Private
					: Verify
				: Setup
			: Public
	).map(link => <MainLink {...link} key={link.label} />)

	return (
		<LoadingPage
			loaderProps={{
				size: 'xl',
				variant: 'bars',
			}}
			stackProps={{
				sx: {
					display: 'flex',
					alignItems: 'center',
				},
			}}
		>
			<div>{links}</div>
		</LoadingPage>
	)
}
const logout = {
	icon: <Logout size={20} />,
	color: 'red',
	label: 'Logout',
} as const

const Private = [
	{
		icon: <List size={20} />,
		color: 'green',
		label: 'Password List',
	},
	{
		icon: <LockSquare size={20} />,
		color: 'blue',
		label: 'Change Master Password',
	},
	logout,
] as const

const Setup = [
	{
		icon: <LockAccess size={20} />,
		color: 'blue',
		label: 'Setup Master Password',
	},
	logout,
] as const

const Verify = [
	{
		icon: <Id size={20} />,
		color: 'blue',
		label: 'Verify Master Password',
	},
	logout,
] as const

const Public = [
	{
		icon: <Login size={20} />,
		color: 'blue',
		label: 'Sign Up/Login',
	},
] as const

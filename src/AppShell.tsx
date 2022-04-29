import { useState } from 'react'
import {
	AppShell as AppShellR,
	Navbar,
	Header,
	MediaQuery,
	Burger,
	useMantineTheme,
	Group,
	ActionIcon,
	useMantineColorScheme,
} from '@mantine/core'
import { Logo, MainLinks, User, Footer, Pages } from 'components'
import { Sun, MoonStars } from 'tabler-icons-react'

export const AppShell = () => {
	const theme = useMantineTheme()
	const { colorScheme, toggleColorScheme } = useMantineColorScheme()
	const [opened, setOpened] = useState(false)
	return (
		<AppShellR
			styles={{
				main: {
					background:
						theme.colorScheme === 'dark'
							? theme.colors.dark[8]
							: theme.colors.gray[0],
				},
			}}
			navbarOffsetBreakpoint='sm'
			asideOffsetBreakpoint='sm'
			fixed
			navbar={
				<Navbar
					p='md'
					hiddenBreakpoint='sm'
					hidden={!opened}
					width={{ sm: 200, lg: 300 }}
				>
					<Navbar.Section grow mt='xs'>
						<MainLinks />
					</Navbar.Section>
					<Navbar.Section>
						<User />
					</Navbar.Section>
				</Navbar>
			}
			footer={<Footer />}
			header={
				<Header height={70} p='md'>
					<div
						style={{ display: 'flex', alignItems: 'center', height: '100%' }}
					>
						<MediaQuery largerThan='sm' styles={{ display: 'none' }}>
							<Burger
								opened={opened}
								onClick={() => setOpened(o => !o)}
								size='sm'
								color={theme.colors.gray[6]}
								mr='xl'
							/>
						</MediaQuery>
						<Group
							sx={{ height: '100%', width: '100%' }}
							pr={20}
							position='apart'
						>
							<Logo />
							<ActionIcon
								variant='default'
								onClick={() => toggleColorScheme()}
								size='lg'
							>
								{colorScheme === 'dark' ? (
									<Sun size={24} />
								) : (
									<MoonStars size={24} />
								)}
							</ActionIcon>
						</Group>
					</div>
				</Header>
			}
		>
			<Pages />
		</AppShellR>
	)
}

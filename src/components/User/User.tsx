import {
	UnstyledButton,
	Group,
	Avatar,
	Box,
	useMantineTheme,
} from '@mantine/core'
import { useAuth } from 'hooks'
import { Text } from '../Text'

export const User = () => {
	const theme = useMantineTheme()
	const { user } = useAuth()

	return (
		user && (
			<Box
				sx={{
					paddingTop: theme.spacing.sm,
					borderTop: `1px solid ${
						theme.colorScheme === 'dark'
							? theme.colors.dark[4]
							: theme.colors.gray[2]
					}`,
				}}
			>
				<UnstyledButton
					sx={{
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
					}}
				>
					<Group>
						<Avatar src={user.photoURL} radius='xl' />
						<Box sx={{ flex: 1 }}>
							<Text size='sm' weight={500}>
								{user.displayName}
							</Text>
							<Text
								sx={theme => ({
									color:
										theme.colorScheme === 'dark'
											? theme.colors.dark[2]
											: theme.colors.gray[6],
								})}
								size='xs'
							>
								{user.email}
							</Text>
						</Box>
					</Group>
				</UnstyledButton>
			</Box>
		)
	)
}

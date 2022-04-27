import React, { PropsWithChildren } from 'react'
import { useAuth, useUser } from 'hooks'
import {
	Center,
	Loader,
	Stack,
	Text,
	LoaderProps,
	StackProps,
	CenterProps,
	TextProps,
} from '@mantine/core'

export const LoadingPage = ({
	loading,
	children,
	loaderProps,
	stackProps,
	centerProps,
	textProps,
}: PropsWithChildren<{
	loading?: boolean
	loaderProps?: LoaderProps
	stackProps?: StackProps & React.RefAttributes<HTMLDivElement>
	centerProps?: CenterProps<'div'>
	textProps?: TextProps<'div'>
}>) => {
	const { loading: authLoading } = useAuth()
	const { loading: userLoading } = useUser()

	return authLoading || userLoading || loading ? (
		<Center sx={{ height: '100%' }} {...centerProps}>
			<Stack {...stackProps}>
				<Loader {...loaderProps} />
				<Text
					weight={'bolder'}
					sx={{
						textAlign: 'center',
						fontSize: '25px',
					}}
					{...textProps}
				>
					Loading
				</Text>
			</Stack>
		</Center>
	) : (
		<>{children}</>
	)
}

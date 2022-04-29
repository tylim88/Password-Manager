import { Text as TextU, TextProps } from '@mantine/core'

export const Text = <C = 'div',>({ sx, color, ...rest }: TextProps<C>) => {
	const sx_ = sx ? (Array.isArray(sx) ? sx : [sx]) : []
	return (
		<TextU
			sx={[
				theme => {
					return {
						color:
							color ||
							(theme.colorScheme === 'dark' ? theme.colors.dark[0] : '#000'),
					}
				},
				...sx_,
			]}
			{...rest}
		/>
	)
}

import { Title as TitleU, TitleProps } from '@mantine/core'

export const Title = ({ sx, color, ...rest }: TitleProps) => {
	const sx_ = sx ? (Array.isArray(sx) ? sx : [sx]) : []
	return (
		<TitleU
			sx={[
				theme => ({
					color: color || theme.colorScheme === 'dark' ? '#fff' : '#000',
				}),
				...sx_,
			]}
			{...rest}
		/>
	)
}

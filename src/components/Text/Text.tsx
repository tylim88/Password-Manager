import React from 'react'
import { Text as TextU, TextProps } from '@mantine/core'

export const Text = <C = 'div',>({ sx, color, ...rest }: TextProps<C>) => {
	const sx_ = sx ? (Array.isArray(sx) ? sx : [sx]) : []
	return (
		<TextU
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

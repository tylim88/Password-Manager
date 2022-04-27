import React, { PropsWithChildren, FC } from 'react'

// https://stackoverflow.com/a/58924810/5338829
export const Compose = (
	props: PropsWithChildren<{ components: FC<PropsWithChildren<{}>>[] }>
) => {
	const { components, children } = props

	return (
		<>
			{components.reduceRight((acc, Component) => {
				return <Component>{acc}</Component>
			}, children)}
		</>
	)
}

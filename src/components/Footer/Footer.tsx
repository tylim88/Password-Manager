import { Footer as FooterR, Anchor } from '@mantine/core'
import { BrandGithub } from 'tabler-icons-react'

export const Footer = () => {
	return (
		<FooterR
			height={60}
			px='md'
			style={{ display: 'flex', width: '100%', justifyContent: 'center' }}
		>
			<Anchor
				href='https://github.com/tylim88/Password-Manager'
				target={'_blank'}
				rel='noreferrer'
				style={{ height: '100%', alignItems: 'center', display: 'flex' }}
				size='xl'
				underline={false}
			>
				<BrandGithub size={32} strokeWidth={2} />
			</Anchor>
		</FooterR>
	)
}

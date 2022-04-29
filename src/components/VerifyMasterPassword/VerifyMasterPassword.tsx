import { useState } from 'react'
import { Center, Button, Group, PasswordInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { masterPasswordValidation, zodErrorHandling } from 'schema'
import { useMasterPassword } from 'hooks'
import { Lock } from 'tabler-icons-react'
import { Text } from '../Text'

export const VerifyMasterPassword = () => {
	const [loading, setLoading] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)
	const { verifyMasterPassword } = useMasterPassword()

	const form = useForm({
		initialValues: {
			masterPassword: '',
		},
		validate: {
			masterPassword: value => {
				try {
					masterPasswordValidation.parse(value)
					return null
				} catch (e) {
					return zodErrorHandling(e)
				}
			},
		},
	})
	return (
		<Center sx={{ height: '100%' }}>
			<form
				onSubmit={form.onSubmit(async ({ masterPassword }) => {
					setLoading(true)
					setSubmitError(null)

					await verifyMasterPassword(masterPassword).catch(e => {
						setLoading(false) // this line dont need to be outside as page will "redirect" after success
						setSubmitError(`Error: ${e.message}`)
					})
				})}
				style={{ minWidth: 300 }}
			>
				<Text
					weight='bold'
					mb='sm'
					sx={theme => ({
						color: theme.colorScheme === 'dark' ? '#fff' : '#000',
					})}
				>
					Welcome Back, Please Reenter Your Master Password!
				</Text>
				<PasswordInput
					autoComplete='disabled'
					label='Master Password'
					icon={<Lock size={16} />}
					{...form.getInputProps('masterPassword')}
				/>
				<Group position='right' mt='md'>
					<Button type='submit' loading={loading}>
						{loading ? 'Submit' : 'Submitting'}
					</Button>
				</Group>
				{submitError && (
					<Text mt='sm' color='red' sx={{ textAlign: 'center' }}>
						{submitError}
					</Text>
				)}
			</form>
		</Center>
	)
}

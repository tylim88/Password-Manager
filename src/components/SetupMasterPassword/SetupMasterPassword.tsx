import { useState } from 'react'
import { Center, Button, Group, PasswordInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { setMasterPasswordSchema, zodErrorHandling } from 'schema'
import { useMasterPassword } from 'hooks'
import { Lock } from 'tabler-icons-react'
import { Text } from '../Text'

export const SetupMasterPassword = () => {
	const [loading, setLoading] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)
	const { setupMasterPassword } = useMasterPassword()

	const form = useForm({
		initialValues: {
			masterPassword: '',
			confirmMasterPassword: '',
		},
		validate: {
			masterPassword: value => {
				try {
					setMasterPasswordSchema.req.parse(value)
					return null
				} catch (e) {
					return zodErrorHandling(e)
				}
			},
			confirmMasterPassword: (value, values) => {
				return value !== values.masterPassword
					? 'Master Password does not match'
					: null
			},
		},
	})
	return (
		<Center sx={{ height: '100%' }}>
			<form
				onSubmit={form.onSubmit(async ({ masterPassword }) => {
					setLoading(true)
					setSubmitError(null)
					await setupMasterPassword(masterPassword).catch(e => {
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
					You Do Not Have MasterPassword Yet, Set Up One!
				</Text>
				<PasswordInput
					autoComplete='disabled'
					label='Master Password'
					placeholder='at least 8 characters'
					icon={<Lock size={16} />}
					{...form.getInputProps('masterPassword')}
				/>
				<PasswordInput
					autoComplete='disabled'
					mt='sm'
					label='Confirm Master Password'
					icon={<Lock size={16} />}
					{...form.getInputProps('confirmMasterPassword')}
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

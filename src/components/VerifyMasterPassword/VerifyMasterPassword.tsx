import React, { useState } from 'react'
import { Center, Button, Group, PasswordInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { verifyMasterPasswordSchema } from 'schema'
import { useMasterPassword, useNotification } from 'hooks'
import { Lock } from 'tabler-icons-react'
import { Text } from '../Text'

export const VerifyMasterPassword = () => {
	const [loading, setLoading] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)
	const { setNotificationLoading } = useNotification()
	const { verifyMasterPassword } = useMasterPassword()

	const form = useForm({
		initialValues: {
			masterPassword: '',
			confirmMasterPassword: '',
		},
		validate: {
			masterPassword: value => {
				try {
					verifyMasterPasswordSchema.req.parse(value)
					return null
				} catch (e) {
					return 'Invalid master password'
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
					setNotificationLoading({
						text: 'Verifying Master Password Please Wait...',
					})
					await verifyMasterPassword(masterPassword).catch(e => {
						setLoading(false)
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

import React, { useState } from 'react'
import { Center, Button, Group, PasswordInput, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { setMasterPasswordSchema } from 'schema'
import { useMasterPassword, useNotification } from 'hooks'

export const SetupMasterPassword = () => {
	const [loading, setLoading] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)
	const { setNotification } = useNotification()
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
					return 'Invalid master password'
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
					setNotification({
						isOpen: true,
						loading: true,
						text: 'Encrypting Master Password Please Wait...',
						disallowClose: true,
					})
					await setupMasterPassword(masterPassword).catch(e => {
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
					You Do Not Have MasterPassword Yet, Set Up One!
				</Text>
				<PasswordInput
					label='Master Password'
					placeholder='at least 8 characters'
					{...form.getInputProps('masterPassword')}
				/>
				<PasswordInput
					mt='sm'
					label='Confirm Master Password'
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

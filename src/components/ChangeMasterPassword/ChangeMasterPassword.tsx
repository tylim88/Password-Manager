import React, { useState } from 'react'
import { Center, Button, Group, PasswordInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { updateMasterPasswordSchema } from 'schema'
import { useMasterPassword, useNotification } from 'hooks'
import { Text } from '../Text'
import { Lock } from 'tabler-icons-react'

export const ChangeMasterPassword = () => {
	const [loading, setLoading] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)
	const { setNotificationLoading } = useNotification()
	const { masterPassword, changeMasterPassword } = useMasterPassword()

	const form = useForm({
		initialValues: {
			oldMasterPassword: '',
			newMasterPassword: '',
		},
		validate: {
			oldMasterPassword: value => {
				try {
					updateMasterPasswordSchema.req.shape.oldMasterPassword.parse(value)
					return masterPassword === value
						? null
						: 'Incorrect old master password'
				} catch (e) {
					return 'Invalid master password'
				}
			},
			newMasterPassword: (value, values) => {
				try {
					updateMasterPasswordSchema.req.shape.newMasterPassword.parse(value)
					return value === values.oldMasterPassword
						? 'The New Master Password Is Similar To The Old One'
						: null
				} catch (e) {
					return 'Invalid master password'
				}
			},
		},
	})
	return (
		<Center sx={{ height: '100%' }}>
			<form
				onSubmit={form.onSubmit(
					async ({ oldMasterPassword, newMasterPassword }) => {
						setLoading(true)
						setSubmitError(null)
						setNotificationLoading({
							text: 'Updating Master Password Please Wait...',
						})
						await changeMasterPassword({
							oldMasterPassword,
							newMasterPassword,
						})
							.then(() => {
								form.reset()
							})
							.catch(e => {
								setSubmitError(`Error: ${e.message}`)
							})
						setLoading(false)
					}
				)}
				style={{ minWidth: 300 }}
			>
				<Text
					weight='bold'
					mb='sm'
					sx={theme => ({
						color: theme.colorScheme === 'dark' ? '#fff' : '#000',
					})}
				>
					Change Your Master Password!
				</Text>
				<PasswordInput
					label='Old Master Password'
					icon={<Lock size={16} />}
					{...form.getInputProps('oldMasterPassword')}
				/>
				<PasswordInput
					mt='sm'
					label='New Master Password'
					icon={<Lock size={16} />}
					placeholder='at least 8 characters'
					{...form.getInputProps('newMasterPassword')}
				/>
				<Group position='right' mt='md'>
					<Button type='submit' loading={loading}>
						Submit
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

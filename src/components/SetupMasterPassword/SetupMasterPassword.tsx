import React, { useState } from 'react'
import { Center, Button, Group, PasswordInput, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { setMasterPasswordSchema } from 'schema'
import { callableCreator } from 'firebaseHelper'

export const SetupMasterPassword = () => {
	const [loading, setLoading] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)
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
				onSubmit={form.onSubmit(async values => {
					setLoading(true)
					setSubmitError(null)
					await callableCreator(setMasterPasswordSchema)(values.masterPassword)
						.then(() => {
							form.reset()
						})
						.catch(() => {
							setSubmitError('oops, something went wrong!')
						})
					setLoading(false)
				})}
				style={{ minWidth: 300 }}
			>
				<PasswordInput
					label='Master Password'
					placeholder='at least 8 character'
					{...form.getInputProps('masterPassword')}
				/>
				<PasswordInput
					mt='sm'
					label='Confirm Master Password'
					{...form.getInputProps('confirmMasterPassword')}
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

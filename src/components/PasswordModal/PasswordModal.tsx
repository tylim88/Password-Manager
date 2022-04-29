import { useState } from 'react'
import {
	Modal,
	Button,
	Group,
	TextInput,
	PasswordInput,
	Stack,
} from '@mantine/core'
import { Lock, Id, World } from 'tabler-icons-react'
import { usePasswordModal } from 'hooks'
import { useForm } from '@mantine/form'
import { passwordValidation, zodErrorHandling } from 'schema'

const Form = ({
	initialValues,
	onRequest,
	validate,
}: {
	initialValues: Secret
	onRequest: (value: Secret) => Promise<void>
	validate: (values: { site: string; username: string }) => string | null
}) => {
	const [loading, setLoading] = useState(false)
	const form = useForm({
		initialValues,
		validate: {
			site: (value, values) => {
				try {
					passwordValidation.shape.site.parse(value)
					return validate(values)
				} catch (e) {
					return zodErrorHandling(e)
				}
			},
			username: (value, values) => {
				try {
					passwordValidation.shape.username.parse(value)
					return validate(values)
				} catch (e) {
					return zodErrorHandling(e)
				}
			},
			password: value => {
				try {
					passwordValidation.shape.password.parse(value)
					return null
				} catch (e) {
					return zodErrorHandling(e)
				}
			},
		},
	})
	return (
		<form
			onSubmit={form.onSubmit(async values => {
				setLoading(true)
				await onRequest(values).catch(e => {})
				setLoading(false)
			})}
		>
			<Stack>
				<TextInput
					required
					autoComplete='disabled'
					placeholder='https://example.com'
					label='Site'
					icon={<World size={16} />}
					{...form.getInputProps('site')}
				/>
				<TextInput
					required
					autoComplete='disabled'
					placeholder='example@mail.com'
					label='Username'
					icon={<Id size={16} />}
					{...form.getInputProps('username')}
				/>
				<PasswordInput
					required
					autoComplete='disabled'
					placeholder='********'
					label='Password'
					icon={<Lock size={16} />}
					{...form.getInputProps('password')}
				/>
			</Stack>
			<Group position='right' mt='md'>
				<Button type='submit' loading={loading}>
					{loading ? 'Submit' : 'Submitting'}
				</Button>
			</Group>
		</form>
	)
}

export const PasswordModal = () => {
	const {
		modal: { initialValues, validate, onRequest, opened, ...rest },
	} = usePasswordModal()

	return (
		<Modal size='md' {...rest} opened={opened}>
			{opened ? ( // remount Form on open to reset useForm with different initialState
				<Form
					initialValues={initialValues}
					validate={validate}
					onRequest={onRequest}
				/>
			) : null}
		</Modal>
	)
}

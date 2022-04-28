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
import { updatePasswordsSchema } from 'schema'

export const PasswordModal = () => {
	const {
		modal: { initialValues, validate, onRequest, ...rest },
	} = usePasswordModal()

	const form = useForm({
		initialValues,
		validate: {
			site: (value, values) => {
				try {
					updatePasswordsSchema.req.shape.newPasswords.element.shape.site.parse(
						value
					)
					return validate(values)
				} catch (e) {
					return 'Invalid site'
				}
			},
			username: (value, values) => {
				try {
					updatePasswordsSchema.req.shape.newPasswords.element.shape.username.parse(
						value
					)
					return validate(values)
				} catch (e) {
					return 'Invalid username'
				}
			},
			password: value => {
				try {
					updatePasswordsSchema.req.shape.newPasswords.element.shape.password.parse(
						value
					)
					return null
				} catch (e) {
					return 'Invalid password'
				}
			},
		},
	})
	return (
		<Modal size='md' {...rest}>
			<form onSubmit={form.onSubmit(values => onRequest(values))}>
				<Stack>
					<TextInput
						placeholder='https://example.com'
						label='Site'
						icon={<World size={16} />}
					/>
					<TextInput
						placeholder='example@mail.com'
						label='Username'
						icon={<Id size={16} />}
					/>
					<PasswordInput
						disabled
						placeholder='********'
						label='Password'
						icon={<Lock size={16} />}
					/>
					<Group position='right' mt='md'>
						<Button type='submit'>Submit</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	)
}

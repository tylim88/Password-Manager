import {
	Group,
	TextInput,
	Box,
	Text,
	Code,
	Button,
	Center,
	ActionIcon,
	PasswordInput,
} from '@mantine/core'
import { useForm, formList } from '@mantine/form'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { GripVertical } from 'tabler-icons-react'
import { Trash } from 'tabler-icons-react'
import { usePasswords } from 'hooks'

export const PasswordList = () => {
	const { passwords } = usePasswords()

	const form = useForm({
		initialValues: {
			passwords: formList(passwords),
		},
	})

	const fields = form.values.passwords.map((_, index) => (
		<Draggable key={index} index={index} draggableId={index.toString()}>
			{provided => (
				<Group ref={provided.innerRef} mt='xs' {...provided.draggableProps}>
					<Center {...provided.dragHandleProps}>
						<GripVertical size={18} />
					</Center>
					<TextInput
						placeholder='https://example.com'
						{...form.getListInputProps('passwords', index, 'site')}
					/>
					<TextInput
						placeholder='example@mail.com'
						{...form.getListInputProps('passwords', index, 'username')}
					/>
					<PasswordInput
						placeholder='********'
						{...form.getListInputProps('passwords', index, 'password')}
					/>
					<ActionIcon
						color='red'
						variant='hover'
						onClick={() => form.removeListItem('passwords', index)}
					>
						<Trash size={16} />
					</ActionIcon>
				</Group>
			)}
		</Draggable>
	))

	return (
		<Box sx={{ maxWidth: 500 }} mx='auto'>
			{fields.length > 0 ? (
				<Group mb='xs'>
					<Text weight={500} size='sm' sx={{ flex: 1 }}>
						Name
					</Text>
					<Text weight={500} size='sm' pr={90}>
						Status
					</Text>
				</Group>
			) : (
				<Text color='dimmed' align='center'>
					No one here...
				</Text>
			)}

			<Group position='center' mt='md'>
				<Button
					onClick={() =>
						form.addListItem('passwords', {
							site: '',
							username: '',
							password: '',
						})
					}
				>
					Add Password
				</Button>
			</Group>

			<DragDropContext
				onDragEnd={({ destination, source }) =>
					destination?.index &&
					form.reorderListItem('passwords', {
						from: source.index,
						to: destination.index,
					})
				}
			>
				<Droppable droppableId='dnd-list' direction='vertical'>
					{provided => (
						<div {...provided.droppableProps} ref={provided.innerRef}>
							{fields}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>

			<Text size='sm' weight={500} mt='md'>
				Form values:
			</Text>
			<Code block>{JSON.stringify(form.values, null, 2)}</Code>
		</Box>
	)
}

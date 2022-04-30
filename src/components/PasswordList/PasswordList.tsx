import { useState } from 'react'
import {
	Group,
	Grid,
	Button,
	ActionIcon,
	PasswordInput,
	Stack,
	TextInput,
} from '@mantine/core'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {
	Trash,
	Edit,
	GripVertical,
	Search,
	X,
	Id,
	Lock,
	World,
	ArrowUp,
	ArrowDown,
	Plus,
} from 'tabler-icons-react'
import { usePasswords, usePasswordModal, useMasterPassword } from 'hooks'
import { Text } from '../Text'

export const PasswordList = () => {
	const { passwords, reorder, sort } = usePasswords()
	const { addPassword, editPassword, deletePassword } = usePasswordModal()
	const [filter, setFilter] = useState('')
	const { loading } = useMasterPassword()

	const fields = passwords
		.filter(item => {
			return item.site.includes(filter) || item.username.includes(filter)
		})
		.map((item, index) => (
			<Draggable key={index} index={index} draggableId={index.toString()}>
				{provided => (
					<Group
						ref={provided.innerRef}
						mt='xs'
						{...(filter ? {} : provided.draggableProps)}
					>
						<Grid sx={{ width: '100%' }} columns={24}>
							<Grid.Col
								span={2}
								{...(filter ? {} : provided.dragHandleProps)}
								sx={theme => ({
									color: theme.colorScheme === 'dark' ? '#fff' : '#000',
									justifyContent: 'center',
									alignItems: 'center',
									display: 'flex',
								})}
							>
								{filter ? <X size={18} /> : <GripVertical size={18} />}
							</Grid.Col>
							<Grid.Col span={6}>
								<TextInput
									value={item.site}
									readOnly
									icon={<World size={16} />}
								/>
							</Grid.Col>
							<Grid.Col span={6}>
								<TextInput
									value={item.username}
									readOnly
									icon={<Id size={16} />}
								/>
							</Grid.Col>
							<Grid.Col span={6}>
								<PasswordInput
									value={item.password}
									readOnly
									icon={<Lock size={16} />}
								/>
							</Grid.Col>
							<Grid.Col
								span={2}
								sx={{
									justifyContent: 'center',
									alignItems: 'center',
									display: 'flex',
								}}
							>
								<ActionIcon
									color='blue'
									variant='filled'
									onClick={() => {
										editPassword(index)
									}}
								>
									<Edit size={16} />
								</ActionIcon>
							</Grid.Col>
							<Grid.Col
								span={2}
								sx={{
									alignItems: 'center',
									display: 'flex',
								}}
							>
								<ActionIcon
									color='red'
									variant='outline'
									onClick={() => {
										deletePassword(index)
									}}
								>
									<Trash size={16} />
								</ActionIcon>
							</Grid.Col>
						</Grid>
					</Group>
				)}
			</Draggable>
		))

	return (
		<Stack
			sx={{ maxWidth: 750, pointerEvents: loading ? 'none' : 'auto' }} // disable user interaction while decrypting passwords
			mt='xl'
			mx='auto'
		>
			<Text
				align='center'
				weight={'bolder'}
				sx={theme => ({
					color: theme.colorScheme === 'dark' ? '#fff' : '#000',
				})}
			>
				Passwords List
			</Text>
			<Grid mt='md'>
				<Grid.Col span={6}>
					<Group>
						<Button onClick={addPassword} leftIcon={<Plus size={16} />}>
							Add
						</Button>
						{fields.length > 1 ? (
							<>
								<Button onClick={() => sort()}>
									<ArrowUp size={16} />
								</Button>
								<Button onClick={() => sort('des')}>
									<ArrowDown size={16} />
								</Button>
							</>
						) : null}
					</Group>
				</Grid.Col>
				<Grid.Col span={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
					<TextInput
						onChange={event => {
							setFilter(event.target.value)
						}}
						placeholder='Search'
						icon={<Search size={16} />}
						sx={{ maxWidth: '250px' }}
					/>
				</Grid.Col>
			</Grid>
			{fields.length > 0 ? (
				<Group mt='xs'>
					<Grid sx={{ width: '100%' }} columns={24}>
						<Grid.Col span={2}></Grid.Col>
						<Grid.Col span={6}>
							<Text
								weight={500}
								size='sm'
								align='center'
								sx={theme => ({
									color: theme.colorScheme === 'dark' ? '#fff' : '#000',
								})}
							>
								Site
							</Text>
						</Grid.Col>
						<Grid.Col span={6}>
							<Text
								weight={500}
								size='sm'
								align='center'
								sx={theme => ({
									color: theme.colorScheme === 'dark' ? '#fff' : '#000',
								})}
							>
								Username
							</Text>
						</Grid.Col>
						<Grid.Col span={6}>
							<Text
								weight={500}
								size='sm'
								align='center'
								sx={theme => ({
									color: theme.colorScheme === 'dark' ? '#fff' : '#000',
								})}
							>
								Password
							</Text>
						</Grid.Col>
						<Grid.Col span={2}></Grid.Col>
						<Grid.Col span={2}></Grid.Col>
					</Grid>
				</Group>
			) : null}

			<DragDropContext
				onDragEnd={({ destination, source }) => {
					destination?.index !== undefined &&
						reorder({
							from: source.index,
							to: destination.index,
						})
				}}
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
		</Stack>
	)
}

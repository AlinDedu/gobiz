import {
	Tr,
	Td,
	Button,
	VStack,
	Textarea,
	Tooltip,
	Input,
	FormControl,
	Switch,
	FormLabel,
	Text,
	Badge,
	Spacer,
} from '@chakra-ui/react';
import { useState } from 'react';
import { MdDriveFolderUpload } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { uploadProduct } from '../redux/actions/adminActions';

const AddNewProduct = () => {
	const dispatch = useDispatch();
	const [name, setName] = useState('');
	const [category, setCategory] = useState('');
	const [stock, setStock] = useState('');
	const [price, setPrice] = useState('');
	const [productIsNew, setProductIsNew] = useState(true);
	const [description, setDescription] = useState('');
	const [imageOne, setImageOne] = useState('');
	const [imageTwo, setImageTwo] = useState('');
	const [imageThree, setImageThree] = useState('');
	const [subtitle, setSubtitle] = useState('');
	const [stripeId, setStripeId] = useState('');

	const createNewProduct = () => {
		dispatch(
			uploadProduct({
				name,
				category,
				stock,
				price,
				stripeId,
				subtitle,
				images: [imageOne, imageTwo, imageThree],
				productIsNew,
				description,
			})
		);
		formReset();
	};

	const formReset = () => {
		setName('');
		setCategory('');
		setStock('');
		setPrice('');
		setProductIsNew(true);
		setDescription('');
		setImageOne('');
		setImageTwo('');
		setSubtitle('');
		setStripeId('');
	};

	return (
		<Tr>
			<Td>
				<Text fontSize='sm'>Imgur Image Name</Text>
				<Tooltip label={'Set the name of your first image e.g., https://i.imgur.com/rw47KJv.jpg'} fontSize='sm'>
					<Input
						size='sm'
						value={imageOne}
						onChange={(e) => setImageOne(e.target.value)}
						placeholder='e.g., https://i.imgur.com/rw47KJv.jpg'
					/>
				</Tooltip>
				<Spacer />
				<Text fontSize='sm'>Imgur Image Name</Text>
				<Tooltip label={'Set the name of your second image e.g., https://i.imgur.com/rw47KJv.jpg'} fontSize='sm'>
					<Input
						size='sm'
						value={imageTwo}
						onChange={(e) => setImageTwo(e.target.value)}
						placeholder='e.g., https://i.imgur.com/rw47KJv.jpg'
					/>
				</Tooltip>
				<Spacer />
				<Text fontSize='sm'>Imgur Image Name</Text>
				<Tooltip label={'Set the name of your third image e.g., https://i.imgur.com/rw47KJv.jpg'} fontSize='sm'>
					<Input
						size='sm'
						value={imageThree}
						onChange={(e) => setImageThree(e.target.value)}
						placeholder='e.g., https://i.imgur.com/rw47KJv.jpg'
					/>
				</Tooltip>
			</Td>
			<Td>
				<Text fontSize='sm'>Description</Text>
				<Textarea
					value={description}
					w='270px'
					h='120px'
					onChange={(e) => {
						setDescription(e.target.value);
					}}
					placeholder='Description'
					size='sm'
				/>
			</Td>
			<Td>
				<Text fontSize='sm'>Name</Text>
				<Input size='sm' value={name} onChange={(e) => setName(e.target.value)} placeholder='Samsung S23' />
			</Td>
			<Td>
				<Text fontSize='sm'>Stripe ID</Text>
				<Input size='sm' value={stripeId} onChange={(e) => setStripeId(e.target.value)} />
				<Text fontSize='sm'>Subtitle</Text>
				<Input size='sm' value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder='Samsung S23...' />
			</Td>

			<Td>
				<Text fontSize='sm'>Category</Text>
				<Input size='sm' value={category} onChange={(e) => setCategory(e.target.value)} placeholder='Electronics' />
				<Text fontSize='sm'>Price</Text>
				<Input size='sm' value={price} onChange={(e) => setPrice(e.target.value)} placeholder='299.99' />
			</Td>

			<Td>
				<Text fontSize='sm'>Stock</Text>
				<Input size='sm' value={stock} onChange={(e) => setStock(e.target.value)} />
				<Text fontSize='sm'>New badge shown on product card</Text>
				<FormControl display='flex' alignItems='center'>
					<FormLabel htmlFor='productIsNewFlag' mb='0' fontSize='sm'>
						Enable
						<Badge rounded='full' px='1' mx='1' fontSize='0.8em' colorScheme='green'>
							New
						</Badge>
						badge?
					</FormLabel>
					<Switch id='productIsNewFlag' onChange={() => setProductIsNew(!productIsNew)} isChecked={productIsNew} />
				</FormControl>
			</Td>
			<Td>
				<VStack>
					<Button variant='outline' w='160px' colorScheme='cyan' onClick={createNewProduct}>
						<MdDriveFolderUpload />
						<Text ml='2'>Save Product</Text>
					</Button>
				</VStack>
			</Td>
		</Tr>
	);
};

export default AddNewProduct;

import {
	Badge,
	Button,
	FormControl,
	FormLabel,
	HStack,
	IconButton,
	Input,
	Stack,
	Switch,
	Td,
	Text,
	Textarea,
	Tooltip,
	Tr,
	VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { MdClose, MdDriveFolderUpload } from 'react-icons/md';
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
	const [subtitle, setSubtitle] = useState('');
	const [stripeId, setStripeId] = useState('');
	const [images, setImages] = useState([]);
	const [newImage, setNewImage] = useState('');

	const handleAddImage = () => {
		if (newImage) {
			const formattedNewImage = 'https://i.imgur.com/' + newImage + '.jpg';
			setImages([...images, formattedNewImage]);
			setNewImage('');
		}
	};

	const handleRemoveImage = (index) => {
		const updatedImages = [...images];
		updatedImages.splice(index, 1);
		setImages(updatedImages);
	};

	const createNewProduct = () => {
		dispatch(
			uploadProduct({
				name,
				category,
				stock,
				price,
				stripeId,
				subtitle,
				images,
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
		setImages([]);
		setSubtitle('');
		setStripeId('');
	};

	return (
		<Tr>
			<Td>
				<Text fontSize='sm'>Images</Text>
				<Tooltip
					label={
						'Set the imgur image identifier, e.g. rw47KJv. This is the last part of the image url after imgur.com/'
					}
					fontSize='sm'>
					<HStack>
						<Input
							size='sm'
							value={newImage}
							onChange={(e) => setNewImage(e.target.value)}
							placeholder='e.g. rw47KJv'
						/>
						<Button size='sm' onClick={handleAddImage} leftIcon={<MdDriveFolderUpload color='green' />}>
							Add
						</Button>
					</HStack>
				</Tooltip>
				<Stack spacing='1' mt='2'>
					{images.map((image, index) => (
						<HStack key={index}>
							<Text fontSize='sm' borderWidth='1'>
								{image}
							</Text>
							<IconButton
								isRound={true}
								icon={<MdClose />}
								size='xxs'
								onClick={() => handleRemoveImage(index)}
								variant='solid'
								colorScheme='red'
							/>
						</HStack>
					))}
				</Stack>
				{/* <Tooltip label={'Set the name of your first image e.g., https://i.imgur.com/rw47KJv.jpg'} fontSize='sm'>
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
				</Tooltip> */}
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

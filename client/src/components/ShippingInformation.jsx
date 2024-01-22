import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Radio,
	RadioGroup,
	Stack,
	VStack,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Link as ReactLink } from 'react-router-dom';
import { useState } from 'react';
import * as Yup from 'yup';
import { setAddress, setPayment } from '../redux/actions/orderActions';
import TextField from './TextField';

const ShippingInformation = () => {
	const { shipping } = useSelector((state) => state.cart);
	const { shippingAddress } = useSelector((state) => state.order);

	const dispatch = useDispatch();

	const onSubmit = async (values) => {
		dispatch(setAddress(values));
		dispatch(setPayment());
	};

	const [showSuggestions, setShowSuggestions] = useState(false);

	const romanianCounties = [
		'Alba',
		'Arad',
		'Argeș',
		'Bacău',
		'Bihor',
		'Bistrița-Năsăud',
		'Botoșani',
		'Brașov',
		'Brăila',
		'București',
		'Buzău',
		'Caraș-Severin',
		'Călărași',
		'Cluj',
		'Constanța',
		'Covasna',
		'Dâmbovița',
		'Dolj',
		'Galați',
		'Giurgiu',
		'Gorj',
		'Harghita',
		'Hunedoara',
		'Ialomița',
		'Iași',
		'Ilfov',
		'Maramureș',
		'Mehedinți',
		'Mureș',
		'Neamț',
		'Olt',
		'Prahova',
		'Satu Mare',
		'Sălaj',
		'Sibiu',
		'Suceava',
		'Teleorman',
		'Timiș',
		'Tulcea',
		'Vaslui',
		'Vâlcea',
		'Vrancea',
	];

	return (
		<Formik
			initialValues={{
				address: shippingAddress ? shippingAddress.address : '',
				county: shippingAddress ? shippingAddress.county : '',
				city: shippingAddress ? shippingAddress.city : '',
				postalCode: shippingAddress ? shippingAddress.postalCode : '',
				country: 'Romania',
			}}
			validationSchema={Yup.object({
				address: Yup.string().required('We need an address.').min(10, 'This address is too short.'),
				city: Yup.string().required('We need an county.').min(4, 'This city is too short.'),
				postalCode: Yup.string().required('We need an postal code.').min(6, 'This postal code is too short.'),
				city: Yup.string().required('We need an city.').min(3, 'This city is too short.'),
				country: Yup.string().required('We need an country.').min(4, 'This country is too short.'),
			})}
			onSubmit={onSubmit}>
			{(formik) => (
				<>
					<VStack as='form'>
						<FormControl>
							<TextField name='address' placeholder='Street Address & Number' label='Street Address' />
							<Flex>
								<FormControl flex='2' mr='10'>
									<FormLabel>County</FormLabel>
									{formik.errors.county && formik.touched.county && (
										<Box color='red.500' mt={1}>
											{formik.errors.county}
										</Box>
									)}
									<Box position='relative'>
										<Input
											name='county'
											placeholder='e.g. Buzău'
											value={formik.values.county}
											onChange={(e) => {
												formik.handleChange(e);
												setShowSuggestions(true);
											}}
										/>
										{showSuggestions && formik.values.county && formik.values.county.length >= 2 && (
											<Box
												position='absolute'
												top='100%'
												left='0'
												right='0'
												boxShadow='md'
												border='1px'
												borderColor='gray.200'
												borderRadius='md'
												bg='white'
												zIndex={1}>
												<Stack spacing='2'>
													{romanianCounties
														.filter((county) => county.toLowerCase().includes(formik.values.county.toLowerCase()))
														.map((county) => (
															<Box
																key={county}
																cursor='pointer'
																_hover={{ backgroundColor: 'gray.100' }}
																p='2'
																onClick={() => {
																	formik.setFieldValue('county', county);
																	setShowSuggestions(false);
																}}>
																{county}
															</Box>
														))}
												</Stack>
											</Box>
										)}
									</Box>
								</FormControl>
								<Box flex='2' mr='10'>
									<TextField name='city' placeholder='City' label='City' />
								</Box>
								<Box flex='1' mr='10'>
									<TextField name='postalCode' placeholder='Postal Code' label='Postal Code' type='number' />
								</Box>
							</Flex>
							<FormControl>
								<FormLabel>Country (for now we can only deliver here)</FormLabel>
								<RadioGroup
									defaultValue='Romania'
									onChange={(value) => {
										formik.setFieldValue('country', value);
									}}
									value={formik.values.country}>
									<Stack direction='row'>
										<Radio value='Romania'>Romania</Radio>
									</Stack>
								</RadioGroup>
							</FormControl>
						</FormControl>
					</VStack>
					<Flex alignItems='center' gap='2' direction={{ base: 'column', lg: 'row' }}>
						<Button variant='outline' colorScheme='cyan' w='100%' as={ReactLink} to='/cart'>
							Back to cart
						</Button>
						<Button
							variant='outline'
							colorScheme='cyan'
							w='100%'
							as={ReactLink}
							to='/payment'
							onClick={formik.handleSubmit}>
							Continue to Payment
						</Button>
					</Flex>
				</>
			)}
		</Formik>
	);
};

export default ShippingInformation;

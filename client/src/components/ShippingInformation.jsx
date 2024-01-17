import { Box, Button, Flex, FormControl, FormLabel, Radio, RadioGroup, Stack, VStack } from '@chakra-ui/react';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Link as ReactLink } from 'react-router-dom';
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

	return (
		<Formik
			initialValues={{
				address: shippingAddress ? shippingAddress.address : '',
				postalCode: shippingAddress ? shippingAddress.postalCode : '',
				city: shippingAddress ? shippingAddress.city : '',
				country: 'Romania',
			}}
			validationSchema={Yup.object({
				address: Yup.string().required('We need an address.').min(2, 'This address is too short.'),
				postalCode: Yup.string().required('We need an postal code.').min(2, 'This postal code is too short.'),
				city: Yup.string().required('We need an city.').min(2, 'This city is too short.'),
				country: Yup.string().required('We need an country.').min(2, 'This country is too short.'),
			})}
			onSubmit={onSubmit}>
			{(formik) => (
				<>
					<VStack as='form'>
						<FormControl>
							<TextField name='address' placeholder='Street Address' label='Street Address' />
							<Flex>
								<Box flex='1' mr='10'>
									<TextField name='postalCode' placeholder='Postal Code' label='Postal Code' type='number' />
								</Box>
								<Box flex='2'>
									<TextField name='city' placeholder='City' label='City' />
								</Box>
							</Flex>
							<FormControl>
								<FormLabel>Country (for now we can only deliver here)</FormLabel>
								<RadioGroup defaultValue='Romania' onChange={() => {}} value={formik.values.country}>
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

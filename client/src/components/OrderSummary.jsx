import { CloseIcon } from '@chakra-ui/icons';
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Button,
	Flex,
	Heading,
	Spacer,
	Stack,
	Text,
	useColorModeValue as mode,
	VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { currency, freeShippingThreshold } from '../constants';
import { updateCartItemsInDB } from '../redux/actions/cartActions';

const OrderSummary = ({ checkoutScreen = false }) => {
	const { subtotal, shipping, cartItems, cartItemsInDB } = useSelector((state) => state.cart);
	const formattedShipping = subtotal < freeShippingThreshold ? shipping.toFixed(2) : 0;
	const formattedSubtotal = parseFloat(subtotal).toFixed(2);
	const formattedTotal = (parseFloat(subtotal) + parseFloat(formattedShipping)).toFixed(2);
	const [showStockAlert, setShowStockAlert] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleCheckout = async () => {
		try {
			const products = await Promise.all(
				cartItems.map(async (cartItem) => {
					const { data } = await axios.get(`/api/products/${cartItem.id}`);
					return {
						...data,
						qty: cartItem.qty,
					};
				})
			);

			// Dispatch the action to update cartItemsInDB immediately
			dispatch(updateCartItemsInDB(products));

			// Check if the checkout is valid
			const isValidCheckout = products.every((item) => item.qty <= item.stock);

			if (isValidCheckout) {
				setShowStockAlert(false);
				navigate('/checkout');
			} else {
				setShowStockAlert(true);
			}
		} catch (error) {
			console.error('Error updating CartItemsInDB state:', error);
		}
	};
	return (
		<Stack
			minWidth='300px'
			spacing='8'
			borderWidth='1px'
			borderColor={mode('cyan.500', 'cyan.100')}
			rounded='lg'
			padding='8'
			w='full'>
			<Heading size='md'>Order Summary</Heading>
			<Stack spacing='6'>
				<Flex justify='space-between'>
					<Text fontWeight='medium' color={mode('gray.600', 'gray.400')}>
						Subtotal
					</Text>
					<Text fontWeight='medium'>
						{currency} {formattedSubtotal}
					</Text>
				</Flex>
				<Flex justify='space-between'>
					<Text fontWeight='medium' color={mode('gray.600', 'gray.400')}>
						Shipping
					</Text>
					<Text fontWeight='medium'>{formattedShipping > 0 ? `${currency} ${formattedShipping}` : 'FREE'}</Text>
				</Flex>
				<Flex justify='space-between'>
					<Text fontSize='xl' fontWeight='extrabold'>
						Total
					</Text>
					<Text fontWeight='medium'>
						{currency} {formattedTotal}
					</Text>
				</Flex>
			</Stack>
			<Button
				hidden={checkoutScreen}
				onClick={() => {
					handleCheckout();
				}}
				colorScheme='cyan'
				size='lg'
				rightIcon={<FaArrowRight />}>
				Checkout
			</Button>
			{showStockAlert && (
				<Alert status='error' marginTop='4'>
					<AlertIcon />
					<VStack align='start'>
						<AlertTitle>Invalid Checkout</AlertTitle>
						<AlertDescription>
							Some items in your cart have quantities greater than the available stock.
						</AlertDescription>
						<AlertDescription>Please update your quantities.</AlertDescription>
					</VStack>
					<Spacer />
					<CloseIcon cursor={'pointer'} onClick={() => setShowStockAlert(false)} />
				</Alert>
			)}
		</Stack>
	);
};

export default OrderSummary;

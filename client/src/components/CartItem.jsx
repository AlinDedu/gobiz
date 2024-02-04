import {
	CloseButton,
	Flex,
	Image,
	Select,
	Spacer,
	Text,
	VStack,
	useColorModeValue as mode,
	Badge,
	StepIcon,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { currency } from '../constants';
import { addCartItem, removeCartItem } from '../redux/actions/cartActions';

const CartItem = ({ cartItem }) => {
	const { name, image, price, stock, qty, id, brand } = cartItem;
	const [cartProductStock, setCartProductStock] = useState(0);
	const [isOutOfStock, setIsOutOfStock] = useState(false);
	const [isLowStock, setIsLowStock] = useState(false);
	const dispatch = useDispatch();
	const cartProducts = useSelector((state) => state.cart.cartItemsInDB);

	useEffect(() => {
		const fetchCartProduct = async () => {
			console.log(cartItem.id);
			if (cartProducts.length > 0) {
				const cartProduct = await cartProducts.find((product) => product._id === cartItem.id);
				setCartProductStock(cartProduct.stock);
				setIsOutOfStock(cartProduct.stock === 0);
				setIsLowStock(qty > cartProduct.stock && cartProduct.stock > 0);
			}
		};
		fetchCartProduct();
	}, [cartProducts, cartItem.id, qty]);

	console.log(cartProductStock, isLowStock, isOutOfStock);

	// const cartProduct = cartProducts.find((product) => product.id === cartItem.id);
	// const isOutOfStock = cartProduct?.stock === 0;
	// const isLowStock = qty > cartProduct?.stock && cartProduct?.stock <= 0;
	// console.log(isOutOfStock);

	return (
		<Flex
			minWidth='300px'
			borderWidth={isOutOfStock || isLowStock ? '3px' : '1px'}
			rounded='lg'
			align='center'
			backgroundColor={isOutOfStock ? 'red.100' : isLowStock ? 'yellow.100' : 'inherit'}
			borderColor={isOutOfStock ? 'red.100' : isLowStock ? 'yellow.100' : 'inherit'}>
			<Image rounded='lg' w='120px' h='120px' fit='cover' src={image} fallbackSrc='https://via.placeholder.com/150' />
			<VStack p='2' w='100%' spacing='4' align='stretch'>
				<Flex alignItems='center' justify='space-between'>
					<Text fontWeight='medium'>
						{brand} {name}
					</Text>
					<Spacer />
					<CloseButton onClick={() => dispatch(removeCartItem(id))} />
				</Flex>
				<Spacer />
				<Flex alignItems='center' justify='space-between'>
					<Select
						maxW='68px'
						focusBorderColor={mode('cyan.500', 'cyan.200')}
						value={qty}
						disabled={isOutOfStock}
						onChange={(e) => {
							dispatch(addCartItem(id, e.target.value));
						}}>
						{[...Array(stock).keys()].map((item) => (
							<option key={item + 1} value={item + 1}>
								{item + 1}
							</option>
						))}
					</Select>
					{isOutOfStock && (
						<Badge colorScheme='red' variant='outline'>
							Out of Stock
						</Badge>
					)}
					{isLowStock && (
						<Badge colorScheme='orange' variant='outline'>
							Only {cartProductStock} left
						</Badge>
					)}
					<Text fontWeight='bold'>
						{/* {qty > 1 && (
							<>
								<Text as='span' fontWeight='normal' fontSize='sm' color={mode('gray.500', 'gray.300')} mr='5'>
									{currency} {price} each
								</Text>
							</>
						)} */}
						{currency} {(price * qty).toFixed(2)}
					</Text>
				</Flex>
			</VStack>
		</Flex>
	);
};

export default CartItem;

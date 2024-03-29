import { Box, Image, Text, Badge, Flex, IconButton, Skeleton, useToast, Tooltip, HStack } from '@chakra-ui/react';
import { BiExpand } from 'react-icons/bi';
import React, { useState } from 'react';
import { addToFavorites, removeFromFavorites } from '../redux/actions/productActions';
import { useSelector, useDispatch } from 'react-redux';
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from 'react-icons/md';
import { Link as ReactLink } from 'react-router-dom';
import { addCartItem } from '../redux/actions/cartActions';
import { useEffect } from 'react';
import { TbShoppingCartPlus } from 'react-icons/tb';
import { currency } from '../constants';
import Star from './Star';

const ProductCard = ({ product, loading }) => {
	const dispatch = useDispatch();
	const { favorites } = useSelector((state) => state.product);
	const [isShown, setIsShown] = useState(false);
	const { cartItems } = useSelector((state) => state.cart);
	const toast = useToast();
	const [cartPlusDisabled, setCartPlusDisabled] = useState(false);

	useEffect(() => {
		const item = cartItems.find((cartItem) => cartItem.id === product._id);
		if (item && item.qty === product.stock) {
			setCartPlusDisabled(true);
		}
	}, [product, cartItems]);

	const addItem = (id) => {
		if (cartItems.some((cartItem) => cartItem.id === id)) {
			const item = cartItems.find((cartItem) => cartItem.id === id);
			dispatch(addCartItem(id, item.qty + 1));
		} else {
			dispatch(addCartItem(id, 1));
		}
		toast({
			description: 'Item has been added.',
			status: 'success',
			isClosable: true,
		});
	};

	return (
		<Skeleton isLoaded={!loading}>
			<Box
				_hover={{ transform: 'scale(1.1)', transitionDuration: '0.5s' }}
				borderWidth='3px'
				overflow='hidden'
				p='4'
				shadow='md'
				borderRadius='16'>
				<Image
					onMouseEnter={() => setIsShown(true)}
					onMouseLeave={() => setIsShown(false)}
					src={product.images[isShown && product.images.length > 1 ? 1 : 0]}
					fallbackSrc='https://via.placeholder.com/150'
					alt={product.name}
					height='200px'
					roundedTop='8'
				/>
				<Flex justify='space-between'>
					{product.numberOfReviews > 0 ? (
						<>
							<HStack spacing='2px'>
								<Star color='cyan.500' />
								<Star rating={product.rating} star={2} />
								<Star rating={product.rating} star={3} />
								<Star rating={product.rating} star={4} />
								<Star rating={product.rating} star={5} />
							</HStack>
							<Text fontSize='md' fontWeight='bold' mr='12px'>
								{product.numberOfReviews === 1 ? '1 Review' : `${product.numberOfReviews} reviews`}
							</Text>
						</>
					) : (
						<Text fontSize='md' fontWeight='bold'>
							No reviews yet
						</Text>
					)}
				</Flex>
				{product.stock < 1 ? (
					<Badge colorScheme='red'>Sold out</Badge>
				) : product.stock < 2 ? (
					<Badge colorScheme='yellow'>only {product.stock} left</Badge>
				) : (
					<Badge colorScheme='green'>In Stock</Badge>
				)}
				{product.productIsNew && (
					<Badge ml='2' colorScheme='purple'>
						new
					</Badge>
				)}
				<Text noOfLines={1} fontSize='xl' fontWeight='semibold' mt='2'>
					{product.name}
				</Text>
				<Text noOfLines={1} fontSize='md' color='gray.600'>
					{product.subtitle}
				</Text>
				<Flex justify='space-between' alignItems='center' mt='2'>
					<Badge colorScheme='cyan'>{product.category}</Badge>
					<Text fontSize='xl' fontWeight='semibold' color='cyan.600'>
						{currency} {product.price}
					</Text>
				</Flex>
				<Flex justify='space-between' mt='2'>
					{favorites.includes(product._id) ? (
						<IconButton
							icon={<MdOutlineFavorite size='20px' />}
							colorScheme='cyan'
							size='sm'
							onClick={() => dispatch(removeFromFavorites(product._id))}
						/>
					) : (
						<IconButton
							icon={<MdOutlineFavoriteBorder size='20px' />}
							colorScheme='cyan'
							size='sm'
							onClick={() => dispatch(addToFavorites(product._id))}
						/>
					)}

					<IconButton
						icon={<BiExpand size='20' />}
						as={ReactLink}
						to={`/product/${product._id}`}
						colorScheme='cyan'
						size='sm'
					/>

					<Tooltip
						isDisabled={!cartPlusDisabled}
						hasArrow
						label={
							!cartPlusDisabled
								? 'You reached the maximum quantity jof the product. '
								: product.stock <= 0
								? 'Out of stock'
								: ''
						}>
						<IconButton
							isDisabled={product.stock <= 0 || cartPlusDisabled}
							onClick={() => addItem(product._id)}
							icon={<TbShoppingCartPlus size='20' />}
							colorScheme='cyan'
							size='sm'
						/>
					</Tooltip>
				</Flex>
			</Box>
		</Skeleton>
	);
};

export default ProductCard;

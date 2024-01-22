import { ChevronDownIcon, CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Badge,
	Box,
	Divider,
	Flex,
	HStack,
	Icon,
	IconButton,
	Image,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Spacer,
	Stack,
	Text,
	Tooltip,
	useColorModeValue as mode,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { googleLogout } from '@react-oauth/google';
import React, { useEffect, useState } from 'react';
import { BiLogInCircle, BiUserCheck } from 'react-icons/bi';
import { FcGoogle } from 'react-icons/fc';
import { BsBoxSeam } from 'react-icons/bs';
import { GiPresent } from 'react-icons/gi';
import { MdOutlineFavorite, MdOutlineFavoriteBorder, MdOutlineAdminPanelSettings } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { TbShoppingCart } from 'react-icons/tb';
import { FiLogOut } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link as ReactLink, useLocation } from 'react-router-dom';
import { storeName } from '../constants.js';
import { toggleFavorites } from '../redux/actions/productActions';
import { logout } from '../redux/actions/userActions';
import ColorModeToggle from './ColorModeToggle';
import NavLink from './NavLink';
import { currency } from '../constants.js';
import { freeShippingThreshold } from '../constants.js';

const Links = [
	{ name: 'Products', route: '/products' },
	// { name: 'Hot Deals', route: '/hot-deals' },
	// { name: 'Contact', route: '/contact' },
	// { name: 'Services', route: '/services' },
];

const Header = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const dispatch = useDispatch();
	const toast = useToast();
	const { favoritesToggled } = useSelector((state) => state.product);
	const { cartItems } = useSelector((state) => state.cart);
	const { userInfo } = useSelector((state) => state.user);
	const [showBanner, setShowBanner] = useState(userInfo ? !userInfo.active : false);
	const location = useLocation();
	const favorites = JSON.parse(localStorage.getItem('favorites'));

	useEffect(() => {
		if (userInfo && !userInfo.active) {
			setShowBanner(true);
		}
	}, [favoritesToggled, dispatch, userInfo]);

	const isProductsPage = location.pathname === '/products';
	const isFavoritesEmpty = !favorites || favorites.length === 0;

	const handleFavoritesToggle = () => {
		if (!isFavoritesEmpty) {
			dispatch(toggleFavorites(!favoritesToggled));
		}
	};

	const logoutHandler = () => {
		googleLogout();
		dispatch(logout());
		toast({
			description: 'You have been logged out.',
			status: 'success',
			isClosable: 'true',
		});
	};

	const getRemainingAmount = () => {
		const cartTotal = cartItems.reduce((total, item) => total + parseInt(item.qty, 10) * parseInt(item.price, 10), 0);
		return freeShippingThreshold - cartTotal;
	};

	return (
		<>
			<Box bg={mode(`cyan.300`, 'gray.900')} px='4'>
				<Flex h='16' alignItems='center' justifyContent='space-between'>
					<Flex display={{ base: 'flex', md: 'none' }} alignItems='center'>
						<IconButton
							bg='parent'
							size='md'
							icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
							onClick={isOpen ? onClose : onOpen}
						/>
						<IconButton
							ml='12'
							position='absolute'
							icon={<TbShoppingCart size='20px' />}
							as={ReactLink}
							to='/cart'
							variant='ghost'
						/>
						{cartItems.length > 0 && (
							<Text fontWeight='bold' fontStyle='italic' position='absolute' ml='76px' mt='-6' fontSize='sm'>
								{cartItems.reduce((totalQty, item) => totalQty + parseInt(item.qty), 0)}
							</Text>
						)}
					</Flex>
					<HStack spacing='8' alignItems='center'>
						<Box alignItems='center' display='flex' as={ReactLink} to='/'>
							<Icon as={GiPresent} h='6' w='6' color={mode('black', 'yellow.200')} />
							<Text as='b' ml='2'>
								{storeName}
							</Text>
							{/* <Image src={mode('images/logo3.png', 'images/logo1.png')} fallback={<Skeleton />} boxSize='66px' /> */}
						</Box>

						<HStack as='nav' spacing='4' display={{ base: 'none', md: 'flex' }}>
							{Links.map((link) => (
								<NavLink route={link.route} key={link.route}>
									<Text fontWeight='medium'>{link.name}</Text>
								</NavLink>
							))}
							<Box>
								<IconButton icon={<TbShoppingCart size='20px' />} as={ReactLink} to='/cart' variant='ghost' />
								{cartItems.length > 0 && (
									<Text fontWeight='bold' fontStyle='italic' position='absolute' ml='30px' mt='-10' fontSize='sm'>
										{cartItems.reduce((totalQty, item) => totalQty + parseInt(item.qty), 0)}
									</Text>
								)}
							</Box>
							<Box>
								{cartItems.length > 0 && (
									<Badge
										ml='2'
										fontSize='sm'
										variant='subtle'
										colorScheme={getRemainingAmount() > 0 ? 'yellow' : 'green'}>
										{getRemainingAmount() > 0 ? (
											<Flex direction='column' align='center'>
												{getRemainingAmount() > 0 && <Text>Free shipping in:</Text>}
												<Text>
													{getRemainingAmount() > 0 ? `${currency} ${getRemainingAmount()}` : 'Free shipping'}
												</Text>
											</Flex>
										) : (
											'Free shipping'
										)}
									</Badge>
								)}
							</Box>

							<ColorModeToggle />
							{isProductsPage &&
								(isFavoritesEmpty ? ( // Check if favorites are empty
									<Tooltip label='Favorites list is empty' placement='top'>
										<span>
											<IconButton
												icon={<MdOutlineFavoriteBorder size='20px' />} // Use outline icon for clarity
												variant='ghost'
												isDisabled // Set the disabled state
												opacity={0.6} // Reduce opacity to visually indicate disabled state
											/>
										</span>
									</Tooltip>
								) : (
									<IconButton
										onClick={handleFavoritesToggle} // Use the conditional onClick handler
										icon={
											favoritesToggled ? <MdOutlineFavorite size='20px' /> : <MdOutlineFavoriteBorder size='20px' />
										}
										variant='ghost'
										opacity={1} // Set opacity to full when not disabled
									/>
								))}
							<Badge fontSize='1em' variant='subtle' colorScheme='red'>
								TEST MODE
							</Badge>
						</HStack>
					</HStack>
					<Flex alignItems='center'>
						{userInfo ? (
							<Menu>
								<MenuButton rounded='full' variant='link' cursor='pointer' minW='0'>
									<HStack>
										{userInfo.googleImage ? (
											<Image
												borderRadius='full'
												boxSize='40px'
												src={userInfo.googleImage}
												referrerPolicy='no-referrer'
											/>
										) : (
											<BiUserCheck size='30' />
										)}
										<ChevronDownIcon />
									</HStack>
								</MenuButton>
								<MenuList>
									<HStack>
										<Text pl='3' as='i' fontWeight='semibold'>
											{userInfo.email}
										</Text>
										{userInfo.googleId && <FcGoogle />}
									</HStack>
									<Divider py='1' />
									<MenuItem as={ReactLink} to='/order-history'>
										<BsBoxSeam />
										<Text ml='4' fontWeight='semibold'>
											Order History
										</Text>
									</MenuItem>
									<MenuItem as={ReactLink} to='/profile'>
										<CgProfile />
										<Text ml='4' fontWeight='semibold'>
											Profile
										</Text>
									</MenuItem>
									{userInfo.isAdmin && (
										<>
											<MenuDivider />
											<MenuItem as={ReactLink} to='/admin-console'>
												<MdOutlineAdminPanelSettings />
												<Text ml='4' fontWeight='semibold'>
													Admin Console
												</Text>
											</MenuItem>
										</>
									)}
									<MenuDivider />
									<MenuItem onClick={logoutHandler}>
										<FiLogOut />
										<Text ml='4' fontWeight='bold'>
											Logout
										</Text>
									</MenuItem>
								</MenuList>
							</Menu>
						) : (
							<Menu>
								<MenuButton as={IconButton} variant='ghost' cursor='pointer' icon={<BiLogInCircle size='25px' />} />
								<MenuList>
									<MenuItem as={ReactLink} to='/login' p='2' fontWeight='700' variant='link'>
										<Text textAlign='center' mx='auto'>
											Sign in
										</Text>
									</MenuItem>
									<MenuDivider />
									<MenuItem as={ReactLink} to='/registration' p='2' fontWeight='700' variant='link'>
										<Text textAlign='center' mx='auto'>
											Sign up
										</Text>
									</MenuItem>
								</MenuList>
							</Menu>
						)}
					</Flex>
				</Flex>
				<Box display='flex'>
					{isOpen && (
						<Box pb='4' display={{ md: 'none' }}>
							<Stack as='nav' spacing='4'>
								{Links.map((link) => (
									<NavLink route={link.route} key={link.route}>
										<Text fontWeight='medium'>{link.name}</Text>
									</NavLink>
								))}
							</Stack>
							{favoritesToggled ? (
								<IconButton
									onClick={() => dispatch(toggleFavorites(false))}
									icon={<MdOutlineFavorite size='20px' />}
									variant='ghost'
									isDisabled={isFavoritesEmpty}
								/>
							) : (
								<IconButton
									onClick={() => dispatch(toggleFavorites(true))}
									icon={<MdOutlineFavoriteBorder size='20px' />}
									variant='ghost'
									isDisabled={isFavoritesEmpty}
								/>
							)}
							<ColorModeToggle />
						</Box>
					)}
				</Box>
			</Box>
			{userInfo && !userInfo.active && showBanner && (
				<Box>
					<Alert status='warning'>
						<AlertIcon />
						<AlertTitle>Email not verified!</AlertTitle>
						<AlertDescription>You must verify your email address.</AlertDescription>
						<Spacer />
						<CloseIcon cursor={'pointer'} onClick={() => setShowBanner(false)} />
					</Alert>
				</Box>
			)}
		</>
	);
};

export default Header;

import {
	TableContainer,
	Stack,
	Spinner,
	Alert,
	AlertIcon,
	AlertDescription,
	AlertTitle,
	Th,
	Tbody,
	Tr,
	Thead,
	Button,
	ListItem,
	UnorderedList,
	Table,
	Td,
	Wrap,
	Badge,
	Text,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserOrders } from '../redux/actions/userActions';
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { currency } from '../constants';
import { LuReceipt } from 'react-icons/lu';

const YourOrdersScreen = () => {
	const dispatch = useDispatch();
	const { loading, error, orders, userInfo } = useSelector((state) => state.user);
	const location = useLocation();

	useEffect(() => {
		if (userInfo) {
			dispatch(getUserOrders());
		}
	}, [dispatch, userInfo]);

	return userInfo ? (
		<>
			{loading ? (
				<Wrap direction='column' align='center' mt='20px' justify='center' minHeight='100vh'>
					<Stack direction='row' spacing='4'>
						<Spinner mt='20' thickness='2px' speed='0.65s' emptyColor='gray.200' color='cyan.500' size='xl' />
					</Stack>
				</Wrap>
			) : error ? (
				<Alert status='error'>
					<AlertIcon />
					<AlertTitle>We are sorry</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			) : (
				orders && (
					<TableContainer minH='100vh'>
						<Table variant='striped'>
							<Thead>
								<Tr>
									<Th>Order Id</Th>
									<Th>Order Date</Th>
									<Th>Paid Total</Th>
									<Th>Items</Th>
									<Th>Shipping Address</Th>
									<Th>Status</Th>
									<Th>Print Receipt</Th>
								</Tr>
							</Thead>
							<Tbody>
								{orders.map((order) => (
									<Tr key={order._id}>
										<Td>{order._id}</Td>
										<Td>
											{new Date(order.createdAt).toLocaleString('en-US', {
												weekday: 'short',
												year: 'numeric',
												month: 'short',
												day: 'numeric',
												hour: 'numeric',
												minute: 'numeric',
											})}
										</Td>
										<Td>
											{currency} {order.totalPrice}
										</Td>
										<Td>
											{order.orderItems.map((item) => (
												<UnorderedList key={item._id}>
													<ListItem>
														{item.qty} x {item.name} - {currency} {}
														{item.price} each
													</ListItem>
												</UnorderedList>
											))}
										</Td>
										<Td>
											<Text>
												<span style={{ display: 'block', wordWrap: 'break-word', maxWidth: '200px' }}>
													<i>Address: </i> {order.shippingAddress.address}
												</span>
											</Text>
											<Text>
												<span style={{ display: 'block', wordWrap: 'break-word', maxWidth: '200px' }}>
													<i>County: </i> {order.shippingAddress.county}
												</span>
											</Text>
											<Text>
												<span style={{ display: 'block', wordWrap: 'break-word', maxWidth: '200px' }}>
													<i>City: </i> {order.shippingAddress.postalCode} , {order.shippingAddress.city}
												</span>
											</Text>
											<Text>
												<span style={{ display: 'block', wordWrap: 'break-word', maxWidth: '200px' }}>
													<i>Country: </i> {order.shippingAddress.country}
												</span>
											</Text>
										</Td>
										<Td>
											{order.isDelivered ? (
												<Badge variant='outline' colorScheme='green'>
													Shipped
												</Badge>
											) : (
												<Badge variant='outline' colorScheme='yellow'>
													Pending
												</Badge>
											)}
										</Td>
										<Td>
											<Button variant='outline'>
												<Text ml='2'>Receipt</Text>
											</Button>
										</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</TableContainer>
				)
			)}
		</>
	) : (
		<Navigate to='/login' replace={true} state={{ from: location }} />
	);
};

export default YourOrdersScreen;

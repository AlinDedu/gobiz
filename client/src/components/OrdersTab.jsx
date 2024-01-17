import {
	Box,
	TableContainer,
	Th,
	Tr,
	Table,
	Td,
	Thead,
	Tbody,
	Text,
	Button,
	useDisclosure,
	Alert,
	Stack,
	Spinner,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Wrap,
	useToast,
	Flex,
	Badge,
	useColorModeValue as mode,
} from '@chakra-ui/react';
import { CheckCircleIcon, DeleteIcon } from '@chakra-ui/icons';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, deleteOrder, resetErrorAndRemoval, setDelivered } from '../redux/actions/adminActions';
import ConfirmRemovalAlert from './ConfirmRemovalAlert';
import { TbTruckDelivery } from 'react-icons/tb';

const OrdersTab = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef();
	const [orderToDelete, setOrderToDelete] = useState('');
	const dispatch = useDispatch();
	const { error, loading, orders, deliveredFlag, orderRemoval } = useSelector((state) => state.admin);
	const toast = useToast();

	useEffect(() => {
		dispatch(getAllOrders());
		dispatch(resetErrorAndRemoval());
		if (orderRemoval) {
			toast({
				description: 'Order has been removed.',
				status: 'success',
				isClosable: true,
			});
		}
		if (deliveredFlag) {
			toast({
				description: 'Order has been set to delivered.',
				status: 'success',
				isClosable: true,
			});
		}
	}, [orderRemoval, dispatch, toast, deliveredFlag]);

	const openDeleteConfirmBox = (order) => {
		setOrderToDelete(order);
		onOpen();
	};

	const onSetToDelivered = (order) => {
		dispatch(resetErrorAndRemoval());
		dispatch(setDelivered(order._id));
		console.log('order set to delivered' + order._id);
	};

	return (
		<Box>
			{error && (
				<Alert status='error'>
					<AlertIcon />
					<AlertTitle>Upps!</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			{loading ? (
				<Wrap justify='center'>
					<Stack direction='row' spacing='4'>
						<Spinner mt='20' thickness='2px' speed='0.65s' emptyColor='gray.200' color='cyan.500' size='xl' />
					</Stack>
				</Wrap>
			) : (
				<Box>
					<TableContainer>
						<Table variant='simple'>
							<Thead>
								<Tr>
									<Th>Order ID</Th>
									<Th>Date</Th>
									<Th>Name</Th>
									<Th>Email</Th>
									<Th>Shipping</Th>
									<Th>Items Ordered</Th>
									<Th>Total</Th>
									<Th>Status</Th>
									<Th>Actions</Th>
								</Tr>
							</Thead>
							<Tbody>
								{orders &&
									orders.map((order) => (
										<Tr key={order._id}>
											<Td>{order._id}</Td>
											<Td>
												<Text>{new Date(order.createdAt).toDateString()}</Text>
												<Text>
													{new Date(order.createdAt).toLocaleString('en-US', {
														hour: 'numeric',
														minute: 'numeric',
													})}
												</Text>
											</Td>
											<Td>{order.username}</Td>
											<Td>{order.email}</Td>
											<Td>
												<Text>
													<span style={{ display: 'block', wordWrap: 'break-word', maxWidth: '200px' }}>
														<i>Address: </i> {order.shippingAddress.address}
													</span>
												</Text>
												<Text>
													<span style={{ display: 'block', wordWrap: 'break-word', maxWidth: '200px' }}>
														<i>City: </i> {order.shippingAddress.postalCode} {order.shippingAddress.city}
													</span>
												</Text>
												<Text>
													<span style={{ display: 'block', wordWrap: 'break-word', maxWidth: '200px' }}>
														<i>Country: </i> {order.shippingAddress.country}
													</span>
												</Text>
											</Td>
											<Td>
												{order.orderItems.map((item) => (
													<Text key={item._id}>
														{item.qty} x {item.name}
													</Text>
												))}
											</Td>
											<Td>$ {order.totalPrice}</Td>
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
												<Flex direction='column'>
													<Button colorScheme='red' variant='outline' onClick={() => openDeleteConfirmBox(order)}>
														<DeleteIcon mr='5px' />
														Remove Order
													</Button>
													{!order.isDelivered && (
														<Button
															colorScheme='green'
															mt='4px'
															variant='outline'
															onClick={() => onSetToDelivered(order)}>
															<TbTruckDelivery />
															<Text ml='5px'>Delivered</Text>
														</Button>
													)}
												</Flex>
											</Td>
										</Tr>
									))}
							</Tbody>
						</Table>
					</TableContainer>
					<ConfirmRemovalAlert
						isOpen={isOpen}
						onOpen={onOpen}
						onClose={onClose}
						cancelRef={cancelRef}
						itemToDelete={orderToDelete}
						deleteAction={deleteOrder}
					/>
				</Box>
			)}
		</Box>
	);
};

export default OrdersTab;

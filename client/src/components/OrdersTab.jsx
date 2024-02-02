import { DeleteIcon } from '@chakra-ui/icons';
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Badge,
	Box,
	Button,
	Flex,
	Spinner,
	Stack,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useDisclosure,
	useToast,
	Wrap,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { TbTruckDelivery } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { currency } from '../constants';
import { deleteOrder, getAllOrders, resetErrorAndRemoval, setDelivered } from '../redux/actions/adminActions';
import ConfirmRemovalAlert from './ConfirmRemovalAlert';
import DeliveryConfirmationAlert from './DeliveryConfirmationAlert';

const OrdersTab = () => {
	const { isOpen: deleteAlertOpen, onOpen: openDeleteAlert, onClose: closeDeleteAlert } = useDisclosure();
	const { isOpen: deliveryAlertOpen, onOpen: openDeliveryAlert, onClose: closeDeliveryAlert } = useDisclosure();
	const cancelRef = useRef();
	const [orderToDelete, setOrderToDelete] = useState('');
	const [orderToDeliver, setOrderToDeliver] = useState('');
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
		openDeleteAlert();
	};

	const openDeliveryConfirmBox = (order) => {
		setOrderToDeliver(order);
		openDeliveryAlert();
	};

	const onSetToDelivered = (order, awbNumber) => {
		console.log(order);
		dispatch(resetErrorAndRemoval());
		dispatch(setDelivered(order._id, awbNumber));
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
									<Th>Shipping Address</Th>
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
														<i>Recipient: </i> {order.shippingAddress.recipientName}
													</span>
												</Text>
												<Text>
													<span style={{ display: 'block', wordWrap: 'break-word', maxWidth: '200px' }}>
														<i>Phone: </i> {order.shippingAddress.phoneNumber}
													</span>
												</Text>
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
											<Td>
												{currency} {order.totalPrice}
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
															onClick={() => openDeliveryConfirmBox(order)}>
															<TbTruckDelivery />
															<Text ml='5px'>Set Delivered</Text>
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
						isOpen={deleteAlertOpen}
						onOpen={openDeleteAlert}
						onClose={closeDeleteAlert}
						cancelRef={cancelRef}
						itemToDelete={orderToDelete}
						deleteAction={deleteOrder}
					/>
					<DeliveryConfirmationAlert
						isOpen={deliveryAlertOpen}
						onClose={closeDeliveryAlert}
						onConfirmDelivery={onSetToDelivered}
						cancelRef={cancelRef}
						order={orderToDeliver}
					/>
				</Box>
			)}
		</Box>
	);
};

export default OrdersTab;

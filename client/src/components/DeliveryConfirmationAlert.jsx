import React from 'react';
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	Input,
} from '@chakra-ui/react';
import { useState } from 'react';

const DeliveryConfirmationAlert = ({ isOpen, onClose, onConfirmDelivery, cancelRef, order }) => {
	const [awbNumber, setAwbNumber] = useState('');

	const onConfirm = () => {
		onConfirmDelivery(order, awbNumber);
		onClose();
	};

	return (
		<AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize='lg' fontWeight='bold'>
						Set Delivered for Order #{order._id}
					</AlertDialogHeader>
					<AlertDialogBody>
						<Input placeholder='Enter AWB Number' value={awbNumber} onChange={(e) => setAwbNumber(e.target.value)} />
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={onClose}>
							Cancel
						</Button>
						<Button colorScheme='green' onClick={onConfirm} ml='3'>
							Set Delivered
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
};

export default DeliveryConfirmationAlert;

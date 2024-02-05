import { Box, Button, Center, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { BsBoxSeamFill } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { Link as ReactLink } from 'react-router-dom';
import { resetCart } from '../redux/actions/cartActions';

const SuccessScreen = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(resetCart());
	});

	return (
		<Center height='100vh' flexDirection='column'>
			<Box m='2'>
				<BsBoxSeamFill size='50px' mt='2' />
			</Box>
			<Text fontSize={{ base: 'md', md: 'xl', lg: '4xl' }}>Thank you for your order.</Text>

			<Text>You can see your order in the order history.</Text>
			<Button as={ReactLink} to='/order-history' mt='2'>
				Check your order history
			</Button>
		</Center>
	);
};

export default SuccessScreen;

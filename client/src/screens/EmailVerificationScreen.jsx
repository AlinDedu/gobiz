import { AbsoluteCenter, Alert, AlertDescription, AlertIcon, AlertTitle, Box, Spinner, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { verifyEmail } from '../redux/actions/userActions';

const EmailVerificationScreen = () => {
	const { token } = useParams();
	const dispatch = useDispatch();
	const { error, loading } = useSelector((state) => state.user);

	useEffect(() => {
		dispatch(verifyEmail(token));
	}, [token, dispatch]);

	return (
		<Box position='relative' minH='3xl'>
			<AbsoluteCenter axis='both'>
				{loading ? (
					<Box textAlign='center'>
						<Text fontSize='3xl'>We are working on verifying your email.</Text>
						<Spinner size='xl' />
					</Box>
				) : error === null ? (
					<Alert
						bg='parent'
						status='success'
						flexDirection='column'
						alignItems='center'
						justifyContent='center'
						textAlign='center'>
						<AlertIcon boxSize='16' size='xl' />
						<AlertTitle>Thanks for verifying your email.</AlertTitle>
						<AlertDescription fontSize='xl'>You can close this window now.</AlertDescription>
					</Alert>
				) : (
					<Alert
						bg='parent'
						status='error'
						flexDirection='column'
						alignItems='center'
						justifyContent='center'
						textAlign='center'>
						<AlertIcon boxSize='16' size='xl' />
						<AlertTitle>We are sorry!</AlertTitle>
						<AlertDescription fontSize='xl'>{error}</AlertDescription>
					</Alert>
				)}
			</AbsoluteCenter>
		</Box>
	);
};

export default EmailVerificationScreen;

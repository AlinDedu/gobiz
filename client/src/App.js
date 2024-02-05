import { ChakraProvider, extendTheme, Spinner, VStack } from '@chakra-ui/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import AdminConsoleScreen from './screens/AdminConsoleScreen';
import CancelScreen from './screens/CancelScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import EmailVerificationScreen from './screens/EmailVerificationScreen';
import LandingScreen from './screens/LandingScreen';
import LoginScreen from './screens/LoginScreen';
import PasswordResetScreen from './screens/PasswordResetScreen';
import ProductScreen from './screens/ProductScreen';
import ProductsScreen from './screens/ProductsScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import SuccessScreen from './screens/SuccessScreen';
import YourOrdersScreen from './screens/YourOrdersScreen';

function App() {
	const theme = extendTheme({
		styles: {
			global: (props) => ({
				body: {
					bg: props.colorMode === 'light' && '#F7FAFC',
				},
			}),
		},
	});

	const [googleClient, setGoogleClient] = useState(null);
	useEffect(() => {
		const googleKey = async () => {
			const { data: googleId } = await axios.get('/api/config/google');
			setGoogleClient(googleId);
		};
		googleKey();
	}, [googleClient]);

	return (
		<ChakraProvider theme={theme}>
			{!googleClient ? (
				<VStack pt='37vh'>
					<Spinner mt='20' thickness='2px' speed='0.65s' emptyColor='gray.200' color='cyan.500' size='xl' />;
				</VStack>
			) : (
				<GoogleOAuthProvider clientId={googleClient}>
					<Router>
						<Header />
						<main>
							<Routes>
								<Route path='/products' element={<ProductsScreen />} />
								<Route path='/' element={<LandingScreen />} />
								<Route path='/product/:id' element={<ProductScreen />} />
								<Route path='/cart' element={<CartScreen />} />
								<Route path='/login' element={<LoginScreen />} />
								<Route path='/registration' element={<RegistrationScreen />} />
								<Route path='/email-verify/:token' element={<EmailVerificationScreen />} />
								<Route path='/password-reset/:token' element={<PasswordResetScreen />} />
								<Route path='/checkout' element={<CheckoutScreen />} />
								<Route path='/cancel' element={<CancelScreen />} />
								<Route path='/order-history' element={<YourOrdersScreen />} />
								<Route path='/success' element={<SuccessScreen />} />
								<Route path='/admin-console' element={<AdminConsoleScreen />} />
							</Routes>
						</main>
						<Footer />
					</Router>
				</GoogleOAuthProvider>
			)}
		</ChakraProvider>
	);
}

export default App;

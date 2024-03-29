import axios from 'axios';
import { clearOrder, setError, setShippingAddress } from '../slices/order';

export const setAddress = (data) => (dispatch) => {
	dispatch(setShippingAddress(data));
};

export const setPayment = () => async (dispatch, getState) => {
	const {
		cart: { cartItems, subtotal, shipping },
		order: { shippingAddress },
		user: { userInfo },
	} = getState();

	const total = subtotal + shipping;

	const newOrder = { subtotal, shipping, shippingAddress, cartItems, userInfo, total };

	try {
		const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };

		const { data } = await axios.post('api/checkout', newOrder, config);
		window.location.assign(data.url);
	} catch (error) {
		dispatch(
			setError(
				error.response && error.response.data.message
					? error.response.data.message
					: error.message
					? error.message
					: 'An unexpected error has occured. Please try again later.'
			)
		);
	}
};

export const resetOrder = () => async (dispatch) => {
	dispatch(clearOrder());
};

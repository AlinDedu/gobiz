import axios from 'axios';
import {
	getOrders,
	getUsers, orderDelete, resetError, setDeliveredFlag,
	setError,
	setLoading, userDelete
} from '../slices/admin';
import { setProducts, setProductUpdateFlag, setReviewRemovalFlag } from '../slices/product';

export const getAllUsers = () => async (dispatch, getState) => {
	setLoading();
	const {
		user: { userInfo },
	} = getState();

	const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };

	try {
		const { data } = await axios.get('api/users', config);
		dispatch(getUsers(data));
	} catch (error) {
		setError(
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
				? error.message
				: 'An expected error has occured. Please try again later.'
		);
	}
};

export const deleteUser = (id) => async (dispatch, getState) => {
	setLoading();
	const {
		user: { userInfo },
	} = getState();

	const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };

	try {
		const { data } = await axios.delete(`api/users/${id}`, config);
		dispatch(userDelete(data));
	} catch (error) {
		setError(
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
				? error.message
				: 'An expected error has occured. Please try again later.'
		);
	}
};

export const getAllOrders = () => async (dispatch, getState) => {
	setLoading();
	const {
		user: { userInfo },
	} = getState();

	const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };

	try {
		const { data } = await axios.get('api/orders', config);
		dispatch(getOrders(data));
	} catch (error) {
		setError(
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
				? error.message
				: 'An expected error has occured. Please try again later.'
		);
	}
};

export const deleteOrder = (id) => async (dispatch, getState) => {
	setLoading();
	const {
		user: { userInfo },
	} = getState();

	const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };

	try {
		const { data } = await axios.delete(`api/orders/${id}`, config);
		dispatch(orderDelete(data));
	} catch (error) {
		setError(
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
				? error.message
				: 'An expected error has occured. Please try again later.'
		);
	}
};

export const setDelivered = (id, awbNumber) => async (dispatch, getState) => {
	setLoading();
	const {
		user: { userInfo },
	} = getState();

	const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };

	try {
		await axios.put(`api/orders/${id}`, { awbNumber }, config);
		dispatch(setDeliveredFlag());
	} catch (error) {
		setError(
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
				? error.message
				: 'An expected error has occured. Please try again later.'
		);
	}
};

export const resetErrorAndRemoval = () => async (dispatch) => {
	dispatch(resetError());
};

export const updateProduct =
	(name, category, stock, price, id, productIsNew, description, subtitle, stripeId, imageOne, imageTwo, imageThree) =>
	async (dispatch, getState) => {
		setLoading();
		const {
			user: { userInfo },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };

		try {
			const { data } = await axios.put(
				'api/products',
				{
					name,
					category,
					stock,
					price,
					id,
					productIsNew,
					description,
					subtitle,
					stripeId,
					imageOne,
					imageTwo,
					imageThree,
				},
				config
			);
			dispatch(setProducts(data));
			dispatch(setProductUpdateFlag());
		} catch (error) {
			setError(
				error.response && error.response.data.message
					? error.response.data.message
					: error.message
					? error.message
					: 'An expected error has occured. Please try again later.'
			);
		}
	};

export const deleteProduct = (id) => async (dispatch, getState) => {
	setLoading();
	const {
		user: { userInfo },
	} = getState();

	const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };

	try {
		const { data } = await axios.delete(`api/products/${id}`, config);
		dispatch(setProducts(data));
		dispatch(setProductUpdateFlag());
		dispatch(resetError());
	} catch (error) {
		setError(
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
				? error.message
				: 'An expected error has occured. Please try again later.'
		);
	}
};

export const uploadProduct = (newProduct) => async (dispatch, getState) => {
	setLoading();
	const {
		user: { userInfo },
	} = getState();

	const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };

	try {
		const { data } = await axios.post(`api/products`, newProduct, config);
		dispatch(setProducts(data));
		dispatch(setProductUpdateFlag());
	} catch (error) {
		setError(
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
				? error.message
				: 'An expected error has occured. Please try again later.'
		);
	}
};

export const removeReview = (productId, reviewId) => async (dispatch, getState) => {
	setLoading();
	const {
		user: { userInfo },
	} = getState();

	const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };
	try {
		const { data } = await axios.put(`api/products/${productId}/${reviewId}`, {}, config);
		dispatch(setProducts(data));
		dispatch(setReviewRemovalFlag());
	} catch (error) {
		setError(
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
				? error.message
				: 'An expected error has occured. Please try again later.'
		);
	}
};

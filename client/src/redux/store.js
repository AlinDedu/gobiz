import { combineReducers, configureStore } from '@reduxjs/toolkit';

import admin from './slices/admin';
import cart from './slices/cart';
import order from './slices/order';
import product from './slices/product';
import user from './slices/user';
const reducer = combineReducers({
	product,
	cart,
	user,
	order,
	admin,
});

export default configureStore({ reducer });

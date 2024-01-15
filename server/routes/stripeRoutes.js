import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const stripe = new Stripe(
	'sk_test_51OYZXUDUqkc2xAqkSyT9FtAcxXXc24ra9YqCogLPiDel5WlAlKrClXmfVtOWIygI7KKV55frysIIBZEO2JZBw7IJ00KuppLc0E'
);

const stripeRoutes = express.Router();

const stripePayment = async (req, res) => {
	const data = req.body;
	console.log(data);

	let lineItems = [];

	if (data.shipping === 14.99) {
		lineItems.push({ price: process.env.EXPRESS_SHIPPING_ID, quantity: 1 });
	} else {
		lineItems.push({ price: process.env.STANDARD_SHIPPING_ID, quantity: 1 });
	}

	data.cartItems.forEach((item) => {
		lineItems.push({ price: item.stripeId, quantity: item.qty });
	});

	lineItems.forEach((lineItem) => {
		console.log(`Line items:     ${lineItem.price}`);
	});

	const session = await stripe.checkout.sessions.create({
		line_items: lineItems,
		mode: 'payment',
		success_url: 'http://localhost:3000/success',
		cancel_url: 'http://localhost:3000/cancel',
	});

	const order = new Order({
		orderItems: data.cartItems,
		user: data.userInfo._id,
		username: data.userInfo.name,
		email: data.userInfo.email,
		shippingAddress: data.shippingAddress,
		shippingPrice: data.shipping,
		subtotal: data.subtotal,
		totalPrice: data.subtotal + data.shipping,
	});

	const newOrder = await order.save();

	data.cartItems.forEach(async (cartItem) => {
		let product = await Product.findById(cartItem.id);
		product.stock = product.stock - cartItem.qty;
		product.save();
	});

	res.send(
		JSON.stringify({
			orderId: newOrder._id.toString(),
			url: session.url,
		})
	);
};

stripeRoutes.route('/').post(stripePayment);

export default stripeRoutes;

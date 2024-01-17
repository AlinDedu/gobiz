import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripeRoutes = express.Router();
stripeRoutes.use(express.json());

// Use express.raw middleware to handle raw body
// stripeRoutes.use('/webhook', express.raw({ type: 'application/json' }));

const stripePayment = async (req, res) => {
	const data = req.body;
	const shipping = Number(data.shipping);
	const subtotal = Number(data.subtotal);
	const total = Number(shipping + subtotal).toFixed(2);

	let lineItems = [];

	data.cartItems.forEach((item) => {
		lineItems.push({ price: item.stripeId, quantity: item.qty });
	});

	console.log(data.userInfo._id);

	const session = await stripe.checkout.sessions.create({
		line_items: lineItems,
		shipping_options: [
			{
				shipping_rate: process.env.STRIPE_SHIPPING_ID,
			},
		],
		mode: 'payment',
		metadata: {
			userId: data.userInfo._id,
			username: data.userInfo.name,
			email: data.userInfo.email,
			shippingAddress: data.shippingAddress.address,
			shippingCity: data.shippingAddress.city,
			shippingPostalCode: data.shippingAddress.postalCode,
			shippingCountry: data.shippingAddress.country,
			shippingPrice: shipping,
			subtotal: subtotal,
			totalPrice: total,
		},
		success_url: 'http://localhost:3000/success',
		cancel_url: 'http://localhost:3000/cancel',
	});

	// const order = new Order({
	// 	orderItems: data.cartItems,
	// 	user: data.userInfo._id,
	// 	username: data.userInfo.name,
	// 	email: data.userInfo.email,
	// 	shippingAddress: data.shippingAddress,
	// 	shippingPrice: shipping,
	// 	subtotal: subtotal,
	// 	totalPrice: total,
	// });

	// const newOrder = await order.save();

	// data.cartItems.forEach(async (cartItem) => {
	// 	let product = await Product.findById(cartItem.id);
	// 	product.stock = product.stock - cartItem.qty;
	// 	product.save();
	// });

	res.send(
		JSON.stringify({
			// orderId: newOrder._id.toString(),
			url: session.url,
		})
	);
};

stripeRoutes.route('/').post(protectRoute, stripePayment);

export default stripeRoutes;

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import Stripe from 'stripe';
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
			shippingCounty: data.shippingAddress.county,
			shippingCity: data.shippingAddress.city,
			shippingPostalCode: data.shippingAddress.postalCode,
			shippingCountry: data.shippingAddress.country,
			shippingPrice: shipping,
			subtotal: subtotal,
			totalPrice: total,
		},
		success_url: 'https://gobiz.onrender.com/success',
		cancel_url: 'https://gobiz.onrender.com/cancel',
	});

	res.send(
		JSON.stringify({
			// orderId: newOrder._id.toString(),
			url: session.url,
		})
	);
};

stripeRoutes.route('/').post(protectRoute, stripePayment);

export default stripeRoutes;

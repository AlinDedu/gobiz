import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import Stripe from 'stripe';
import { freeShippingThreshold } from '../constants.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripeRoutes = express.Router();
stripeRoutes.use(express.json());

// Use express.raw middleware to handle raw body
// stripeRoutes.use('/webhook', express.raw({ type: 'application/json' }));

const stripePayment = async (req, res) => {
	const data = req.body;
	console.log(data);
	const subtotal = Number(data.subtotal).toFixed(2);
	const shipping = subtotal > freeShippingThreshold ? 0 : Number(data.shipping).toFixed(2);

	const total = data.total.toFixed(2);

	console.log('Subtotal:', data.subtotal, typeof data.subtotal);
	console.log('Shipping:', data.shipping, typeof data.shipping);
	console.log('Total:', total);

	let lineItems = [];

	data.cartItems.forEach((item) => {
		lineItems.push({ price: item.stripeId, quantity: item.qty });
	});

	const shippingRateId =
		subtotal > freeShippingThreshold ? process.env.STRIPE_FREE_SHIPPING_ID : process.env.STRIPE_SHIPPING_ID;

	const session = await stripe.checkout.sessions.create({
		line_items: lineItems,
		shipping_options: [
			{
				shipping_rate: shippingRateId,
			},
		],
		mode: 'payment',
		metadata: {
			userId: data.userInfo._id,
			username: data.userInfo.name,
			email: data.userInfo.email,
			recipientName: data.shippingAddress.recipientName,
			phoneNumber: data.shippingAddress.phoneNumber,
			shippingAddress: data.shippingAddress.address,
			shippingCounty: data.shippingAddress.county,
			shippingCity: data.shippingAddress.city,
			shippingPostalCode: data.shippingAddress.postalCode,
			shippingCountry: data.shippingAddress.country,
			shippingPrice: shipping,
			subtotal: subtotal,
			totalPrice: total,
		},

		success_url: process.env.STRIPE_SUCCESS_URL,
		cancel_url: process.env.STRIPE_CANCEL_URL,
	});

	res.send(
		JSON.stringify({
			url: session.url,
		})
	);
};

stripeRoutes.route('/').post(protectRoute, stripePayment);

export default stripeRoutes;

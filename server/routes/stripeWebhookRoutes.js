import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import Stripe from 'stripe';

import Order from '../models/Order.js';
import Product from '../models/Product.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripeWebhookRoutes = express.Router();
stripeWebhookRoutes.use(express.raw({ type: 'application/json' }));

const handleWebhook = async (req, res) => {
	const signature = req.headers['stripe-signature'];

	let event;

	try {
		event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
	} catch (error) {
		res.status(400).send(`Webhook Error: ${error.message}`);
		return;
	}

	// Handle the event
	switch (event.type) {
		case 'checkout.session.completed':
			const session = event.data.object;

			handleCheckoutSession(session);
			break;

		default:
			console.log(`Unhandled event type ${event.type}`);
	}

	res.send();
};

const handleCheckoutSession = async (session) => {
	const checkoutSession = await stripe.checkout.sessions.retrieve(session.id, {
		expand: ['line_items'],
	});

	const lineItems = checkoutSession.line_items.data;

	try {
		// Retrive user information from metadata
		const userId = session.metadata.userId;
		const username = session.metadata.username;
		const userEmail = session.metadata.email;

		// Retrive shipping information
		const shippingPrice = session.metadata.shippingPrice;
		const subtotal = session.metadata.subtotal;
		const totalPrice = session.metadata.totalPrice;

		const shippingAddress = {
			address: session.metadata.shippingAddress,
			city: session.metadata.shippingCity,
			postalCode: session.metadata.shippingPostalCode,
			country: session.metadata.shippingCountry,
		};

		// Retrieve line items from the session and fetch product details from the database
		const orderItems = await Promise.all(
			lineItems.map(async (item) => {
				const product = await Product.findOne({ stripeId: item.price.id });

				product.stock = product.stock - item.quantity;
				await product.save();

				return {
					name: product.name,
					qty: item.quantity,
					image: product.images[0],
					price: product.price, // Convert from cents to dollars
					id: product._id,
				};
			})
		);

		console.log('Order Items: ', orderItems);
		// Create a new order
		const order = new Order({
			user: userId,
			username: username,
			email: userEmail,
			orderItems: orderItems,
			shippingAddress: shippingAddress,
			shippingPrice: shippingPrice,
			subtotal: subtotal,
			totalPrice: totalPrice,
		});
		await order.save();
		console.log('Saved order: ', order);
	} catch (error) {
		console.error('Error handling checkout session:', error);
	}
};

stripeWebhookRoutes.route('/').post(handleWebhook);

export default stripeWebhookRoutes;

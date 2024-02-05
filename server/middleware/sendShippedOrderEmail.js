import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { storeName } from '../constants.js';
dotenv.config();

const storeEmail = process.env.GMAIL_EMAIL;
const gmailAuthPass = process.env.GMAIL_APP_PASSWORD;

export const sendShippedOrderEmail = (order) => {
	const itemsList = order.orderItems
		.map((item) => `<li>${item.qty} x ${item.name} - $${item.price.toFixed(2)}</li>`)
		.join('');

	const awbMessage = order.awbNumber ? `<p>Your AWB number: ${order.awbNumber}</p>` : '';

	const html = `
    <html>
        <head>
            <style>
                a {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #009050;
                    text-decoration: none;
                    border-radius: 5px;
                }

                a:hover {
                    background-color: #008900
                }
            </style>
        <head/>
        <body style="font-family: 'Arial', sans-serif; background-color: #f5f5f5; color: #333; margin: 0; padding: 0; text-align: center;">
            <h3 style="color: #007BFF;"> Dear ${order.username}</h3>
            <p style="margin-bottom: 20px;">Your order has been shipped. Thank you for shopping with ${storeName}!</p>
            <h4>Order Details:</h4>
            <ul style="list-style-type: none; padding: 0;">
                ${itemsList}
            </ul>
            <p>Total Price: $${order.totalPrice.toFixed(2)}</p>
            ${awbMessage}
            <p style="margin-bottom: 20px;">You can track your order <a href="https://gobiz.onrender.com/order-history" style="color: #fff">here</a>.</p>
        </body>
    </html>
    `;

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: storeEmail,
			pass: gmailAuthPass,
		},
	});

	const mailOptions = {
		from: storeEmail,
		to: order.email, // Assuming 'email' is the customer's email in the order object
		subject: 'Your Order Has Been Shipped',
		html: html,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log(`Email sent to ${order.email}`);
			console.log(info.response);
		}
	});
};

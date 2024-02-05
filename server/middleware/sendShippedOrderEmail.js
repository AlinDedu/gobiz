import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { storeName, currency } from '../constants.js';
dotenv.config();

const storeEmail = process.env.GMAIL_EMAIL;
const gmailAuthPass = process.env.GMAIL_APP_PASSWORD;

const calculateDeliveryDate = () => {
	const currentDate = new Date();
	const deliveryDate = new Date();
	deliveryDate.setDate(currentDate.getDate() + 3);
	const maxDeliveryDate = new Date();
	maxDeliveryDate.setDate(currentDate.getDate() + 5);

	return {
		minDeliveryDate: deliveryDate.toISOString().split('T')[0],
		maxDeliveryDate: maxDeliveryDate.toISOString().split('T')[0],
	};
};

export const sendShippedOrderEmail = (order) => {
	const itemsList = order.orderItems
		.map((item) => `<li>${item.qty} x ${item.name} - $${item.price.toFixed(2)}</li>`)
		.join('');
	const awbMessage = order.awbNumber ? `<p>Numar AWB: ${order.awbNumber}</p>` : '';
	const deliveryDates = calculateDeliveryDate();

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
            <h3 style="color: #007BFF;"> Draga ${order.username}</h3>
            <p style="margin-bottom: 20px;">Comanda ta ${storeName} a fost predata curierului. Termen de livrare estimat intre ${
		deliveryDates.minDeliveryDate
	} si ${deliveryDates.maxDeliveryDate}!</p>
            <h4>Detalii Comanda:</h4>
            <ul style="list-style-type: none; padding: 0;">
                ${itemsList}
            </ul>
            <p>Total: ${currency} ${order.totalPrice.toFixed(2)}</p>
            ${awbMessage}
            <p style="margin-bottom: 20px;">Poti verifica istoricul comenzilor tale aici:</p>
            <a href="https://gobiz.onrender.com/order-history" style="color: #fff">Istoric comenzi</a>
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
		to: order.email,
		subject: 'Comanda predata curierului',
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

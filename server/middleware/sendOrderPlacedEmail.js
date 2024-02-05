import nodemailer from 'nodemailer';
import { storeName } from '../constants.js';

const storeEmail = process.env.GMAIL_EMAIL;
const gmailAuthPass = process.env.GMAIL_APP_PASSWORD;

export const sendOrderPlacedEmail = (email, name, orderId) => {
	const html = `
    <html>
		<head>
			<style>
				a.button{
					display: inline-block;
					padding: 10px 20px;
					background-color: #009050;
					text-decoration: none;
					border-radius: 5px;
					color: #fff
				}

				a.button:hover {
					background-color: #008900
				}
			</style>
		<head/>
		<body style="font-family: 'Arial', sans-serif; background-color: #f5f5f5; color: #333; margin: 0; padding: 0; text-align: center;">
			<h3 style="color: #007BFF;"> Buna ${name}</h3>
			<p style="margin-bottom: 20px;">Iti multumim pentru comanda facuta la gobiz.onrender.com.</p>
			<p style="margin-bottom: 20px;">Poti raspunde la acest email cu eventuale intrebari sau modificari la comanda. Te rugam sa nu modifici subiectul mesajului, foloseste doar butonul Reply; in caz contrar mesajul poate fi trimis eronat.</p>
			<p style="margin-bottom: 20px;">Numar comanda: ${orderId}</p>
			<a href="https://gobiz.onrender.com/order-history" class="button">Urmareste comanda!</a>
		</body>
	</html>`;

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: storeEmail,
			pass: gmailAuthPass,
		},
	});

	const mailOptions = {
		from: storeEmail,
		to: email,
		subject: `${storeName} - Comanda Plasata`,
		html: html,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log(`Email send to ${email}`);
			console.log(info.response);
		}
	});
};

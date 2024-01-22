import nodemailer from 'nodemailer';
import { storeName } from '../constants.js';

const storeEmail = process.env.GMAIL_EMAIL;
const gmailAuthPass = process.env.GMAIL_APP_PASSWORD;

export const sendPasswordResetEmail = (token, email, name) => {
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
			<h3 style="color: #007BFF;"> Dear ${name}</h3>
			<p style="margin-bottom: 20px;">You requested to reset your ${storeName} account password.</p>
			<p style="margin-bottom: 20px;">Use the link below to reset your password</p>
			<a href="https://gobiz.onrender.com/password-reset/${token}" style="color: #fff">Click here!</a>
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
		subject: `${storeName}: Reset your password request.`,
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

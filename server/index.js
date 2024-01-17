import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import connectToDatabase from './db.js';
dotenv.config();

//Routes
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';
import stripeWebhookRoutes from './routes/stripeWebhookRoutes.js';
import userRoutes from './routes/userRoutes.js';

connectToDatabase();
const app = express();
// app.use(express.json());
app.use(cors());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/checkout', stripeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stripe-webhook', stripeWebhookRoutes);

app.get('/api/config/google', (req, res) => res.send(process.env.GOOGLE_CLIENT_ID));

const port = 5000;

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV == 'production') {
	app.use(express.static(path.join(__dirname, '/client/build')));

	app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

app.get('/', (req, res) => {
	res.send('Api is running...');
});

app.listen(port, () => {
	console.log(`Server runs on port ${port}`);
});

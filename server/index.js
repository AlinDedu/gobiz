import dotenv from 'dotenv';
dotenv.config();
import connectToDatabase from './db.js';
import express, { application } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

//Routes
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import stripeWebhookRoutes from './routes/stripeWebhookRoutes.js';

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

// Resolve the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Serve the React app in production
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '/client/build')));

	app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

app.get('/', (req, res) => {
	res.send('Api is running...');
});

app.listen(port, () => {
	console.log(`Server runs on port ${port}`);
});

import express from 'express';
import dotenv from 'dotenv';
import connectDb from './db.js';
import cors from 'cors';
import authRoutes from './authRoute.js';

// rest obj
const app = express();

// config env
dotenv.config();

// config db
connectDb();

// middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`<h1>Welcome to Angular Login/Signup  Page</h1>`);
} );

app.use('/api/v1/auth', authRoutes);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server running on mode at port ${port}.`);
})
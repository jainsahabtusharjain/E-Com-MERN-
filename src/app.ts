import express from 'express';
import { connectDB } from './utils/features.js';
import { Error } from 'mongoose';
import { errorMiddleware } from './middlewares/error.js';
import NodeCache from 'node-cache';
import {config} from "dotenv";
import morgan from "morgan";
import cors from "cors";


import userRoute from './routes/user.js';
import productRoute from './routes/prodcuts.js';
import orderRoute from './routes/order.js';
import paymentRoute from './routes/payment.js';
import statsRoute from './routes/stats.js';
import Stripe from 'stripe';

config({
    path:"./.env",
});
const mongoURI = process.env.MONGO_URI|| "";
const port = process.env.PORT ||  4001;

const stripeKey = process.env.STRIPE_KEY|| "";

console.log(stripeKey);
connectDB(mongoURI);

export const stripe = new Stripe(stripeKey);
export const myCache = new NodeCache();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/" , (req ,res)=>{
    res.send("wordking");
})



app.use("/api/v1/user" , userRoute);
app.use("/api/v1/product" , productRoute);
app.use("/api/v1/order" , orderRoute);
app.use("/api/v1/payment" , paymentRoute);
app.use("/api/v1/dashboard" , statsRoute);

app.use("/uploads" , express.static("uploads"));
app.use(errorMiddleware);


app.listen(port , () => {
    console.log(`aasd is running on http://localhost:${port}`);
});
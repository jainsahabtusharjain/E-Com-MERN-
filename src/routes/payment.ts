import express from 'express';
import { adminonly } from '../middlewares/auth.js';
import { allCoupons, applyDiscount, createPaymentIntent, deleteCoupon, newCoupon } from '../controllers/payment.js';

const app = express.Router();

//integrate stripe API later when dong frontend
app.post("/create", createPaymentIntent);


app.get("/discount",  applyDiscount);

app.get("/coupon/all",adminonly, allCoupons);

app.delete("/coupon/:id", adminonly, deleteCoupon);


export default app;
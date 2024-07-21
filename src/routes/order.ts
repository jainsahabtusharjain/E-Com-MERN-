import express from 'express';
import { adminonly } from '../middlewares/auth.js';
import { deleteOrder, getSingleOrder, myOrders, newOrder, processOrder } from '../controllers/order.js';
import { allOrders } from '../controllers/order.js';

const app = express.Router();

app.post("/new", newOrder);

app.get("/my", myOrders);
app.get("/all",adminonly, allOrders);
app.route("/:id").get(getSingleOrder).put(adminonly , processOrder).delete(adminonly , deleteOrder);




export default app;
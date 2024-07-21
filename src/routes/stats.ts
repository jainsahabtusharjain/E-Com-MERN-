import express from 'express';
import { adminonly } from '../middlewares/auth.js';
import { getBarCharts, getDashboardStats, getLineCharts, getPieCharts } from '../controllers/stats.js';

const app = express.Router();

app.get("/stats", adminonly , getDashboardStats);

app.get("/pie",adminonly, getPieCharts);

app.get("/bar",adminonly, getBarCharts);

app.get("/line", adminonly, getLineCharts);


export default app;
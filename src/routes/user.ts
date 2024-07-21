import express from 'express';
import { deleteUser, getAllUsers, getUser, newUser } from '../controllers/user.js';
import { adminonly } from '../middlewares/auth.js';

const app = express.Router();

app.post("/new", newUser);

app.get("/all" ,adminonly, getAllUsers );

app.route("/:id").get( getUser ).delete( adminonly , deleteUser );

export default app;
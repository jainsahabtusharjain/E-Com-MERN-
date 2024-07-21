import express from 'express';
import { adminonly } from '../middlewares/auth.js';
import { deleteproduct, getadminproducts, getallcategories, getallproducts, getlatestproduct, getsingleproduct, newProduct, updateproduct } from '../controllers/product.js';
import { singleupload } from '../middlewares/multer.js';

const app = express.Router();


//newpeoducts  - /api/v1/product/new
app.post("/new",adminonly , singleupload, newProduct);

//get all products with filter
app.get("/all"  , getallproducts);

app.get("/latest"  , getlatestproduct);

app.get("/categories"  , getallcategories);

app.get("/admin-products"  ,adminonly, getadminproducts);

//start from here...

app.route("/:id")
    .get(getsingleproduct)
    .put(adminonly,singleupload , updateproduct)
    .delete(adminonly,deleteproduct);

export default app;
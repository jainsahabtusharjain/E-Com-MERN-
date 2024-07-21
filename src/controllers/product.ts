//import { faker } from "@faker-js/faker";
import { NextFunction, Request, Response } from "express";
import { rm } from "fs";
import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/products.js";
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import { invalidateCache } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";




// revalidate on creating,update ,delete and on new order 
export const getlatestproduct = TryCatch(
    async(req , res, next) => {

        let products ;

        if( myCache.has("latest-product")){
            products= JSON.parse(myCache.get("latest-product")as string);
        }
        else{
            products = await Product.find({}).sort({createdAt: -1}).limit(5);
        
            myCache.set(" latest-product" , JSON.stringify(products));
        }


        return res.status(201).json({
            success: true,
            products,
        });
}
);

// revalidate on creating,update ,delete and on new order 

export const getallcategories = TryCatch(


    
    async(req , res, next) => {

        let categories;

        if( myCache.has("categories")){
            categories= JSON.parse(myCache.get("categories")as string);
        }
        else{
            categories = await Product.distinct("category");
            myCache.set(" categories" , JSON.stringify(categories));
        }
        return res.status(201).json({
            success: true,
            categories,
        });
}
);

// revalidate on creating,update ,delete and on new order 

export const getadminproducts = TryCatch(
    async(req , res, next) => {
        let allproducts;

        if( myCache.has("allproducts")){
            allproducts= JSON.parse(myCache.get("allproducts")as string);
        }
        else{
            allproducts = await Product.find({});
            myCache.set(" allproducts" , JSON.stringify(allproducts));
        }
        return res.status(201).json({
            success: true,
            allproducts,
        });
}
);

export const getsingleproduct = TryCatch(
    async(req, res, next) => {
        let product;

        let id = req.params.id;

        if( myCache.has(`product-${id}`)){
            product= JSON.parse(myCache.get(`product-${id}`)as string);
        }
        else{
            product = await Product.findById(id);
            if(!product) return next(new ErrorHandler(" product not found " 
            ,404)); 
            myCache.set(`product-${id}` , JSON.stringify(product));
        }
        const singleproduct  = await Product.findById(req.params.id);
        
        

        return res.status(201).json({
            success: true,
            product,
        });
}
);

export const newProduct = TryCatch(
    async(req:Request<{} , {} ,NewProductRequestBody> , res: Response, next:NextFunction) => {
        
        const {name , price , stock , category} = req.body;
        
        const photo = req.file;

        if(!photo)
            return next(new ErrorHandler(" please provide photo" , 401));

        // as the photo get added to db without any check so after this check we gotta delete
        // it if other values are waste

        

        if(!name||!price||!category||!stock)
            {
                rm(photo.path , ()=>{
                    console.log("Deleted");
                });
                return next(new ErrorHandler("please enter all field" , 401));
        }
            
        let photoPath = photo.path.replace(/\\/g, '/'); // Replace backslashes with forward slashes
        photoPath = photoPath.replace(/^uploads\//, ''); 
        
        await Product.create({
            name,
            price,
            stock,
            category: category.toLowerCase(),
            photo: photoPath,
          });
        
          console.log(photo);
        invalidateCache({product: true,admin: true});
        return res.status(201).json({
            success: true,
            message: "Product created succesfully",
        });
}
);
export const updateproduct = TryCatch(
    async(req, res, next) => {

        const { id } = req.params;

        const { name, price, stock , category } = req.body;

        const photo = req.file;
        const product  = await Product.findById(id);

        if(!product) return next(new ErrorHandler(" product not found " ,404));        
        
        if(photo){
            rm(product.photo , () => {
                console.log("old Deleted photo");
            });
            product.photo = photo?.path;
        }
        if(name){
            product.name = name;
        }
        if(price){
            product.price = price;
        }
        if(stock){
            product.stock = stock;
        }
        if(category){
            product.category = category;
        }

        await product.save();
        invalidateCache({product: true , productId:String(product._id), admin: true});

        return res.status(201).json({
            success: true,
            message: " product updated ",
        });
});

export const deleteproduct = TryCatch(
    async(req, res, next) => {
        
        const product  = await Product.findById(req.params.id);
        
        if(!product) return next(new ErrorHandler(" product not found " ,404)); 

        rm(product.photo , () => {
            console.log("product photo deleted ");
        });
        console.log(`id-${product.name}`);

        await product.deleteOne();
        invalidateCache({product: true , productId:String(product._id), admin: true});
        return res.status(201).json({
            success: true,
            message: " product deleted ",
        });
}
);


export const getallproducts = TryCatch(
    async(req:Request<{},{},{},SearchRequestQuery> , res, next) => {

        const { search , sort , category , price} = req.query;
        
        const page = Number(req.query.page) || 1;

        const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
        
        const skip = (page - 1) * limit;
        

        const baseQuery:BaseQuery = { };


        if(search)
            baseQuery.name={
                $regex: search,
                $options: "i",
        };

        if(price)
            baseQuery.price={
                $lte: Number(price),
            };

        if(category) baseQuery.category = category;
        
        const productpromise =  Product.find(baseQuery).sort( 
            sort && {price: sort==="asc"?1:-1})
            .limit(limit)
            .skip(skip);


        const [products , filteredonlyproducts] = await Promise.all([
            productpromise ,
            Product.find(baseQuery),
        ])


        const totalPage =Math.ceil( filteredonlyproducts.length / limit);

         
        return res.status(201).json({
            "message": true,
            products,
            "totalPage": totalPage,
        });
}
);

/*
const generaterandomproducts = async( count: number =10) =>{

    const products =[];

    for(let i=0;i<count;i++){
        const product = {
            name: faker.commerce.productName(),
            photo: "uploads\ind trai 6.png",
            price: faker.commerce.price({min:1500 , max:60000 , dec:0}),
            stock: faker.commerce.price({min:0 , max:100 , dec:0}),
            category: faker.commerce.department(),
            createdAt: new Date(faker.date.past()),
            updatedAt: new Date(faker.date.recent()),
            __v: 0,
        };
        products.push(product);
    }
    await Product.create(products);

    console.log({ success: true });
};
*/

const deleterandomproduct = async( count: number =10) =>{
    const prodcuts  = await Product.find({}).skip(2);
        
    for(let i=0;i<count;i++){
        const product = prodcuts[i];
        await Product.deleteOne();
    }
    console.log({ success: true });
};

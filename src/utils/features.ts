import mongoose, { Document } from "mongoose";
import { InvalidateCacheProps, OrderItemsType } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/products.js";


export const connectDB = (uri: string) => {
    mongoose
      .connect(uri, {
        dbName: "Ecommerce_24",
      })
      .then((c) => console.log(`DB Connected to ${c.connection.host}`))
      .catch((e) => console.log(e));
  };
  
  export const invalidateCache = ({
    product ,
    order,
    admin ,
    userId ,
    orderId, productId }: InvalidateCacheProps) =>{

    if(product){
      const productKeys:string[] = [
        "latest-product" ,
         "categories",
         "allproducts",
        ];
        if (typeof productId === "string") productKeys.push(`product-${productId}`);

        if (typeof productId === "object")
          productId.forEach((i) => productKeys.push(`product-${i}`));
      
      
      myCache.del(productKeys);

    }
    if(order){
      ////we are creating this for order to invalidate that old cache s deleted
      /// need to delete all-order to be delete
      const orderKeys: string [] = ["all-orders" ,
       `my-orders-${userId}` ,
       `order-${orderId}`,
       ];
      /// as we need to delete cache so old processed is not given to user directly
      myCache.del(orderKeys);
      
      
    }
    if(admin){
      myCache.del(["admin-stats" ,
       "admin-pie-charts" ,
        "admin-bar-charts" ,
         "admin-line-charts",
        ]);
    }
  };



export const reduceStock = async (orderItems: OrderItemsType[]) =>{
  for (let i = 0; i <orderItems.length;i++) {
    const order = orderItems[i];
    console.log(`${order.quantity}`);
    const product = await Product.findById(order.productid);
    if(!product) throw new Error(" Product not found");
    product.stock -= order.quantity;
    console.log(`${product.stock}`);
    await product.save();
  }
};

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth * 100;
  const percent = (thisMonth / lastMonth) * 100;
  return Number(percent.toFixed(0));
};


export const getInventries =async (

  {categories, productCount}:
  {
    categories: string[];
    productCount: number;
  }) =>{
  const categoriesCountPromise = categories.map((category) => Product.countDocuments({ category}));

        const categoriesCount = await Promise.all(categoriesCountPromise);
        

        const categoryCount: Record<string, number>[] = [];

        categories.forEach( (category, i) =>{
            categoryCount.push({
                [category]: Math.round( (categoriesCount[i]/productCount) *100),
            });
        });

        return categoryCount;
};

interface MyDocument extends Document{
  createdAt: Date;
  discount?: number;
  total?:number;
} ;


type FuncProps = {
  length:number;
  docArr:MyDocument[];
  today: Date;
  property?: "discount" | "total";
};


export const getChartData = (
  {length , docArr, today,property} : FuncProps
  )=>{

    const data: number[] = new Array(length).fill(0);

    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

        if (monthDiff < length) {
          if(property){
            data[length - monthDiff - 1] +=  i[property]! ;
          }
          else{
            data[length - monthDiff - 1] +=  1;
          }
        }
    });

    return data;
};
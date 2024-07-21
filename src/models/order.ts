


import mongoose from "mongoose";




const schema = new mongoose.Schema(
{
    shippingInfo:{
        address:{
            type:String,
            required: true,
        },
        city:{
            type:String,
            required: true,
        },
        state:{
            type:String,
            required: true,
        },
        country:{
            type:String,
            required: true,
        },
        Pincode:{
            type:Number,
            required: true,
        },
    },

    user:{
        //use this if you have custom id from moongoose
        //type: mongoose.Types.ObjectId
        //here we jave cutoom id in users so we cant give it here
        type: String,
        ref: "User",
        required: true,
    },

    subtotal:{
        type:Number,
        required: true,
    },
    tax:{
        type:Number,
        required: true,
    },
    shippingcharges:{
        type:Number,
        required: true,
    },
    discount:{
        type:Number,
        required: true,
    },
    total:{
        type:Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["Processing", "Shipped", "Delivered"],
        default: "Processing",
      },
  

    orderItems: [
        {
            name:String,
            photo : String,
            price: Number,
            quantity: Number,
            productId: {
                type: mongoose.Types.ObjectId,
                ref: "Product",
            },
        },
    ],
},
{
    timestamps: true,
}
);


export const Order = mongoose.model("Order" , schema);
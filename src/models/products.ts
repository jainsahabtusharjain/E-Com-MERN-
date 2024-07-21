
import mongoose from "mongoose";




const schema = new mongoose.Schema(
{
    name:{
        type: String,
        required: [true, "please enter name"],
    },
    photo:{
        type: String,
        required: [true, "please enter photo"],
    },
    price:{
        type: Number,
        required: [true, "please enter price"],
    },
    stock:{
        type: Number,
        required: [true, "please enter stock avialable"],
    },
    category:{
        type: String,
        required: [true, "please enter category"],
        //trim is to remove whitespace here
        trim: true,
    },
},
{
    timestamps: true,
}
);


export const Product = mongoose.model("Product" , schema);
import mongoose from "mongoose";
import validator from 'validator';


interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    photo: string;
    role: "admin" | "user";
    gender: "male" | "female";
    dob: Date;
    createdAt: Date;
    updatedAt: Date;
    age: number; // Add the 'age' property to the interface
}


const schema = new mongoose.Schema(
{
    _id:{
        type: String,
        required: [true, "please enter ID"],
    },
    name:{
        type: String,
        required: [true, "please enter name"],
    },
    email:{
        type: String,
        unique: [true , " Email already exist"],
        required: [true, "please enter name"],
        validate: validator.default.isEmail,
    },
    photo:{
        type: String,
        required: [true, "please enter photo"],
    },
    role:{
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    gender:{
        type: String,
        enum: ["male", "female"],
        required: [ true , "please enter "]
    },
    dob:{
        type:Date,
        required: [ true , "please enter date_of_birth"]
    },
},
{
    timestamps: true,
}
);

schema.virtual("age").get(function(){
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();

    if(today.getMonth() < dob.getMonth() || today.getMonth() === dob.getMonth()&& today.getDate() < dob.getDate())
        age--;

    return age;
})

export const User = mongoose.model<IUser>("User" , schema)
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

// middleware to make sure that only admin is allowed
export const adminonly = TryCatch(
    async(req , res , next) => {
        const {id} = req.query;
        
        if(!id) return next(new ErrorHandler(" Please login first",401));

        const user = await User.findById(id);
        if(!user) return next(new ErrorHandler(" Not valid ID",401));

        if(user.role != "admin" )
            return next(new ErrorHandler(" Please login with admin",401));
        
        next();
        
    }
)
import{ NextFunction, Request, RequestHandler, Response } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { ControllerType } from "../types/types.js";



export const errorMiddleware = (err: ErrorHandler, req:Request , res:Response , next:NextFunction) => {
    err.message ||= "Internal server error";
    err.statuscode ||= 500;

    if(err.name === "CastError") err.message = "Invalid id";

    return res.status(err.statuscode).json({
        success: false,
        message: err.message,
    });
};

    export const TryCatch = (func:ControllerType) =>
        (req: Request , res: Response , next: NextFunction) =>{
            return Promise.resolve(func(req , res , next)).catch(next);; 
        };



       
 
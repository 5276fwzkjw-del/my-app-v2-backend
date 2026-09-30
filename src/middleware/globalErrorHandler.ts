import { Request,Response,NextFunction } from "express"
export const globalErrorHandler=(err:any,req:Request,res:Response,next:NextFunction)=>{
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        message:err.message || 'internal Server Error',
        success:false,
        status:err.status
    });
}
import { Request,Response,NextFunction } from "express";


export const addProductValidator=(req:Request,res:Response,next:NextFunction)=>{
    const {name,description,price,inventory_count,category}=req.body;
    if(!name && !description && !price && !inventory_count && !category){
        throw new Error('All field are required');
    }
    next()
}
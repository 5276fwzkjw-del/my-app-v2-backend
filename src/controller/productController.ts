import { Request,Response,NextFunction } from "express";
import { IncomingUser } from "./userController";
import { addingProduct, gettingProducts ,creatingCart,ordering, gettingCart, gettingOrder,updatingQty, deleting,addingAdress, gettingAddress, updatingAdd, deletingAdd} from "../services/productService";

export const addNewProduct=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {name,description,price,inventory_count,category}=req.body;
        const product=await addingProduct({name,description,price,inventory_count,category});
        return res.status(200).json({
            success:true,
            message:'New Item created',
            product
        });

    }catch(error){
        next(error)
    }
};
export const getProducts = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const products = await gettingProducts();
        return res.status(200).json({
            success:true,
            products:products
        });
    } catch (error) {
        next(error);
    }
};
export const createCart = async(req:IncomingUser,res:Response,next:NextFunction)=>{
    try {
        const {productId} = req.body;
        const user = req.user;
        const cart = await creatingCart({user,productId});
        return res.status(200).json({
            success:true,
            cart:cart
        });
    } catch (error) {
        next(error)
    }
};
export const orders=async(req:IncomingUser,res:Response,next:NextFunction)=>{
    try {
        const user = req.user;
        const {shipping_address}=req.body;
        const order = await ordering({user,shipping_address});
        return res.status(200).json({
            success:true,
            order:order
        })
    } catch (error) {
        next(error)
    }
};
export const getCart=async(req:IncomingUser,res:Response,next:NextFunction)=>{
    try {
        const user = req.user;
        const cart = await gettingCart(user);
        return res.status(200).json({
            success:true,
            cart
        });
    } catch (error) {
        next(error)
    }
}
export const getOrders=async(req:IncomingUser,res:Response,next:NextFunction)=>{
    try {
        const user = req.user;
        const order = await gettingOrder(user);
        return res.status(200).json({
            success:true,
            order
        });
    } catch (error) {
        next(error)
    }
};
export const updateQty=async(req:IncomingUser,res:Response,next:NextFunction)=>{
    try {
        const user =req.user;
        const {increase,decrease,product} = req.body;
        const cart = updatingQty({increase,decrease,product,user});
        return res.status(200).json({
            success:true,
            cart:cart
        });
    } catch (error) {
        next(error);
    }
};
export const deleteCart_item=async(req:IncomingUser,res:Response,next:NextFunction)=>{
    try {
        const user = req.user;
        const {product}=req.body;
        const deletedItem = await deleting({product,user});
        return res.status(200).json({
            message:'item removed',
            success:true,
            deletedItem
        })
    } catch (error) {
        next(error);
    }
};
export const addAddress =async(req:IncomingUser,res:Response,next:NextFunction)=>{
    try {
        const user = req.user;
        const {title,fullName,phone,streetAddress,city,country}=req.body;
        const address = await addingAdress({user,title,fullName,phone,streetAddress,city,country});
        return res.status(200).json({
            message:'Address Added',
            success:true,
            address
        });
    } catch (error) {
        next(error)
    }
};
export const getAddress=async(req:IncomingUser,res:Response,next:NextFunction)=>{
    try {
        const user = req.user;
        const address= await gettingAddress(user);
        return res.status(200).json({
            success:true,
            address
        });
    } catch (error) {
        next(error)
    }
};
export const updateShipment=async(req:IncomingUser,res:Response,next:NextFunction)=>{
    try {
        const user = req.user;
        const {id}=req.body;
        const address = await updatingAdd({user,id});
        return res.status(200).json({
            message:'Set to default',
            success:true,
        })
    } catch (error) {
        next(error)
    }
};
export const deleteAdd = async(req:IncomingUser,res:Response,next:NextFunction)=>{
    try {
        const user=req.user;
        const {id}=req.body;
        const address =await deletingAdd({user,id});
        return res.status(200).json({
            message:`${address?.title} Address Deleted`,
            success:true,
        })
    } catch (error) {
        next(error)
    }
}
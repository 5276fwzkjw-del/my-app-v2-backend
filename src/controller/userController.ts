import { Request,Response,NextFunction } from "express";
import { userService,loggingUser ,gettinguser,updatingUser} from "../services/userServices";

export interface IncomingUser extends Request{
    user?:any
}
export const registerUser=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data = req.body;
        const user = await userService(data);
        return res.status(201).json({
            success:true,
            message:'User Created successfully',
            user:user
        })
    } catch (error) {
        next(error);
    }
};
export const loginUser =async(req:Request,res:Response,next:NextFunction)=>{
   try{ const data = req.body;
    const user = await loggingUser(data);
    return res.status(200).json({
        success:true,
        user
    });}catch(error){
        next(error);
    }
};
export const getUser =async(req:IncomingUser,res:Response,next:NextFunction)=>{
    try {
        const userData = req.user;
        const user = await gettinguser (userData);
        return res.status(200).json({
            success: true,
            user: user
        });
    } catch (error) {
        next(error)
    }
};
export const updateUser = async(req:IncomingUser,res:Response,next:NextFunction)=>{
    try {
        const user = req.user;
        const {name,phone} = req.body;
        const update = await updatingUser({name,phone,user});
        return res.status(200).json({
            message:'User updated Successfully',
            success:true,
        })
    } catch (error) {
        next(error)
    }
}
import { Request,Response,NextFunction } from "express";
import { IncomingUser } from "../controller/userController";

export const registerValidation =(req:Request,res:Response,next:NextFunction)=>{
    const {email,password,name}=req.body;
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email || !password || !name){
        throw new Error('All fileds are required !');
    }
    if(password.length <= 6){
        throw new Error ('Password length must be greater than 6 characters');
    }
    if(!validEmail.test(email)){
        throw new Error('Please Enter a valid email');
    }
    next();
};
export const loginValidation=(req:Request,res:Response,next:NextFunction)=>{
    const {email,password}=req.body
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(password.length <= 6){
        throw new Error ('Password length must be greater than 6 characters');
    }
    if(!validEmail.test(email)){
        throw new Error('Please Enter a valid email');
    }
    next();
};
export const gettingUserValidation=(req:IncomingUser,res:Response,next:NextFunction)=>{
    const {email}=req.user;
    if(!email){
        throw new Error('User validation,: user empty')
    }
    next()
}
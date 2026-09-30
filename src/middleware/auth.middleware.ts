
import dotenv from 'dotenv';
dotenv.config();
import { Request,Response,NextFunction } from "express";
import { IncomingUser } from "../controller/userController";
import jwt from 'jsonwebtoken';

export const authMiddleware=(req:IncomingUser,res:Response,next:NextFunction)=>{
    try {
        const authHeaders = req.headers.authorization;
        if(!authHeaders && ! authHeaders?.startsWith('Bearer')){
            throw new Error('Corrupted Headers');
        }
        const token = authHeaders.split(' ')[1];
        if(!token){
            throw new Error('No Token was found');
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRETE!);
        if(!decoded){
            throw new Error('Invalid token')
        }
        req.user = decoded;
        next()

    } catch (error) {
        next(error)
    }
}
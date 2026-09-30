import dotenv from 'dotenv';
dotenv.config();
import {db} from "../prisma/db";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
export const userService =async(data:any)=>{
    const Existuser = await db.orm.public.User.where({email:data.email}).first();
    if(Existuser){
        throw new Error('User Already exists');
    }
    const hashedpassword = await bcrypt.hash(data.password,10);
    const user = await db.orm.public.User.create({
        email:data.email,
        name:data.name,
        password:hashedpassword
    });
    return user;
};
export const loggingUser=async(data:any)=>{
    const user= await db.orm.public.User.where({email:data.email}).first();
    if(!user){
        throw new Error('User not found');
    }
    const passowrd = await bcrypt.compare(data.password,user.password);
    if(!passowrd){
        throw new Error ('Wrong credentials');
    }
    const token = jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRETE!,{expiresIn:'1d'});
    return {user, token};
};
export const gettinguser=(userData:any)=>{
    const user = db.orm.public.User.where({email:userData.email}).first();
    if(!user){
        throw new Error('User doesnt exist');
    }
    return user
};
export const updatingUser=async({name,phone,user}:any)=>{
    const updateUser = await db.orm.public.User.where({email:user.email}).update({
        name:name,
        phone:phone
    });
    return updateUser
}
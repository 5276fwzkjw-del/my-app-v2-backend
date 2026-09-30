import express from 'express';
import { getUser, loginUser, registerUser, updateUser } from '../controller/userController';
import { gettingUserValidation, loginValidation, registerValidation } from '../middleware/validationUser';
import { authMiddleware } from '../middleware/auth.middleware';
export const routerUser = express.Router();
routerUser.post('/registerUser',registerValidation,registerUser);
routerUser.post('/login',loginValidation,loginUser);
routerUser.get('/getUser',authMiddleware,gettingUserValidation,getUser);
routerUser.put('/updateUser',authMiddleware,updateUser);
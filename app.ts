import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { globalErrorHandler } from './src/middleware/globalErrorHandler';
import { routerUser } from './src/routes/userRoutes';
import { productRoute } from './src/routes/productRoute';
const server = express();
server.use(express.json());
server.use(cors());
const rating = rateLimit({
    windowMs:50*60*1000,
    max:50,
    message:'Too much attempts,try again after 15minutes'
});
server.use(rating);
server.use('/api',routerUser);
server.use('/api',productRoute);

server.use(globalErrorHandler);
server.listen(process.env.PORT);
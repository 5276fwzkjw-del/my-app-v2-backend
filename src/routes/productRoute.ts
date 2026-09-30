import express from 'express';
import { addAddress, addNewProduct, createCart, deleteAdd, deleteCart_item, getAddress, getCart, getOrders, getProducts, orders, updateQty, updateShipment } from '../controller/productController';
import { authMiddleware } from '../middleware/auth.middleware';
import { addProductValidator } from '../middleware/productValidator';


export const productRoute=express.Router();
productRoute.post('/createProduct',authMiddleware,addProductValidator,addNewProduct);
productRoute.get('/products',authMiddleware,getProducts);
productRoute.post('/addToCart',authMiddleware,createCart);
productRoute.post('/CheckOut',authMiddleware,orders);
productRoute.get('/getCart',authMiddleware,getCart);
productRoute.get('/getOrders',authMiddleware,getOrders);
productRoute.put('/updateQty',authMiddleware,updateQty);
productRoute.delete('/deleteItem',authMiddleware,deleteCart_item);
productRoute.post('/shippingAdd',authMiddleware,addAddress);
productRoute.get('/getShipment',authMiddleware,getAddress);
productRoute.put("/isDefault",authMiddleware,updateShipment);
productRoute.delete('/deleteAdd',authMiddleware,deleteAdd);
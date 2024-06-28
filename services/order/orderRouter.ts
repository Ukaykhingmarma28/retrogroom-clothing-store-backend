import { Router } from "express";
import authMiddleware from "../../src/middlewares/authMiddleware";
import {
    allOrders,
    allUserOrders,
    createOrder,
    sslPaymentCancelled,
    sslPaymentFailure,
    sslPaymentSuccess,
    updateOrderStatus
} from "./orderController";
import {isAdmin} from "../../src/middlewares/isAdmin";

const orderRouter = Router();

orderRouter.get("/all-orders", authMiddleware, isAdmin, allOrders)
orderRouter.get("/user-order", authMiddleware, allUserOrders)
orderRouter.post('/create',authMiddleware, createOrder);
orderRouter.post('/ssl-payment-success/:id', sslPaymentSuccess);
orderRouter.post('/ssl-payment-cancel/:id', sslPaymentCancelled);
orderRouter.post('/ssl-payment-fail/:id', sslPaymentFailure);
orderRouter.put('/status-update/:id', authMiddleware,isAdmin, updateOrderStatus)
export default orderRouter;
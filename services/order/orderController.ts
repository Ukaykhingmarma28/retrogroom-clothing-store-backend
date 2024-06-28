import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import Order from './orderModel';
import Product from '../product/productModel';
import { config } from "../../src/config";
import crypto from "crypto";
const SSLCommerzPayment = require('sslcommerz-lts');

interface AuthRequest extends Request {
    user?: any;
}

const updateProductStock = async (orderedProducts: any, next: NextFunction) => {
    for (const orderedProduct of orderedProducts) {
        const product = await Product.findById(orderedProduct.product);
        if (!product) {
            return next(createHttpError(404, `Product with ID ${orderedProduct.product} not found`));
        }

        const productStock = product.productStock.find(
            (stock) => stock.color === orderedProduct.color && stock.size === orderedProduct.size
        );

        if (productStock) {
            if (productStock.quantity < orderedProduct.quantity) {
                return next(createHttpError(400, `Insufficient stock for product ${product.productName}, color: ${orderedProduct.color}, size: ${orderedProduct.size}. Available: ${productStock.quantity}, Requested: ${orderedProduct.quantity}`));
            }

            productStock.quantity -= orderedProduct.quantity; // Reduce stock
            await product.save();
        } else {
            return next(createHttpError(400, `Product stock for color: ${orderedProduct.color}, size: ${orderedProduct.size} not found`));
        }
    }
}

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { products, paymentMethod } = req.body;
    try {
        // Validate input
        if (!products || !paymentMethod) {
            return next(createHttpError(400, 'All fields are required'));
        }

        // Create new order
        const newOrder = new Order({
            user: req.user._id,
            products,
            shipmentAddress: req.user.shipmentAddress,
            city: req.user.city,
            state: req.user.state,
            zip: req.user.zipcode,
            paymentMethod,
            totalAmount: 0,  // Calculate total amount later
            status: 'PENDING', // default status
        });

        // Calculate total amount
        let totalAmount = 0;
        let productName: string[] = [];

        for (const orderedProduct of products) {
            const product = await Product.findById(orderedProduct.product);

            if (!product) {
                return next(createHttpError(404, `Product with ID ${orderedProduct.product} not found`));
            }

            const productStock = product.productStock.find(
                (stock) => stock.color === orderedProduct.color && stock.size === orderedProduct.size
            );

            if (productStock) {
                if (productStock.quantity < orderedProduct.quantity) {
                    return next(createHttpError(400, `Insufficient stock for product ${product.productName}, color: ${orderedProduct.color}, size: ${orderedProduct.size}. Available: ${productStock.quantity}, Requested: ${orderedProduct.quantity}`));
                }
                totalAmount += product.productPrice * orderedProduct.quantity;
                productName.push(`${product.productName} ${orderedProduct.size} ${orderedProduct.color}`);
            } else {
                return next(createHttpError(400, `Product stock for color: ${orderedProduct.color}, size: ${orderedProduct.size} not found`));
            }

        }

        newOrder.totalAmount = totalAmount;

        // Save order to the database
        if (paymentMethod === "COD") {
            await updateProductStock(products, next);
            await newOrder.save();

            const order = await Order.findById(newOrder._id);
            const productss = order?.products

            let orderProductId: String[]= []
            let productId: any= []
            productss?.forEach( item =>{
                orderProductId.push(item._id)
                productId.push(item.product)

            })

            return res.status(201).json({ orderProductId, newOrder: newOrder._id, productId: productId , message: 'Order created successfully.' });
        } else if (paymentMethod === "SSLCOMMERZ") {
            await newOrder.save();
            const tranId = crypto.randomBytes(16).toString("hex");
            const data = {
                total_amount: newOrder.totalAmount,
                currency: 'BDT',
                tran_id: tranId,
                success_url: `${config.root}/api/order/ssl-payment-success/${newOrder._id}`,
                fail_url: `${config.root}/api/order/ssl-payment-fail/${newOrder._id}`,
                cancel_url: `${config.root}/api/order/ssl-payment-cancel/${newOrder._id}`,
                shipping_method: 'Courier',
                product_name: productName.join(', '),
                product_category: 'Cloth',
                product_profile: 'general',
                cus_name: req.user.userName,
                cus_email: req.user.email,
                cus_add1: req.user.shipmentAddress,
                cus_add2: "",
                cus_city: req.user.city,
                cus_state: req.user.state,
                cus_postcode: req.user.zipcode,
                cus_country: 'Bangladesh',
                cus_phone: req.user.mobile,
                cus_fax: '',
                ipn_url: `${config.root}/api/order/ssl-payment-notification`,
                ship_name: req.user.userName,
                ship_add1: req.user.shipmentAddress,
                ship_city: req.user.city,
                ship_state: req.user.state,
                ship_postcode: req.user.zipcode,
                ship_country: 'Bangladesh',
            };

            const sslCommerce = new SSLCommerzPayment(config.storeId, config.storeSecret, false)
            sslCommerce.init(data).then((apiResponse: any) => {
                let GatewayPageURL = apiResponse.GatewayPageURL
                res.status(200).json({ url: GatewayPageURL });
            }).catch((err: any) => {
                return next(createHttpError(500, `SSLCommerz error: ${err.message}`));
            });
        } else {
            return res.status(400).json({ message: 'Invalid payment method' });
        }
    } catch (err: any) {
        return next(createHttpError(500, err.message));
    }
};

export const sslPaymentSuccess = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
        return next(createHttpError(404, `Order with ID ${id} not found`));
    }

    try {
        await updateProductStock(order.products, next);
        res.status(200).json({ message: `${id} payment successfully.` });
    } catch (err: any) {
        return next(createHttpError(500, err.message));
    }
}

export const sslPaymentCancelled = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
        return next(createHttpError(404, `Order with ID ${id} not found`));
    }

    try {
        await order.deleteOne()
        res.status(200).json({ message: `${id} payment cancelled successfully.` });
    } catch (err: any) {
        return next(createHttpError(500, err.message));
    }

}
export const sslPaymentFailure = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
        return next(createHttpError(404, `Order with ID ${id} not found`));
    }

    try {
        await order.deleteOne()
        res.status(200).json({ message: `${id} payment Failed successfully.` });
    } catch (err: any) {
        return next(createHttpError(500, err.message));
    }

}

//get All Order
export const allOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    }catch (err: any) {
        return next(createHttpError(500, err.message));
    }
}

//get user order
export const allUserOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    try {
        const orders = await Order.find( {user: userId} );
        res.status(200).json(orders);
    }
    catch (err: any) {
        return next(createHttpError(500, err.message));
    }
}

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);

    if (!order) {
        return next(createHttpError(404, `Order with ID ${id} not found`));
    }

    order.status = status
    order.save()

    res.status(200).json({ message: `${id} status ${status} updated successfully.` });
}
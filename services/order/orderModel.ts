import mongoose, { Schema } from 'mongoose';
import { OrderDocument, OrderProductDocument } from './orderTypes';

const orderProductSchema = new Schema<OrderProductDocument>({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    reviewToken: String,
});

const orderSchema = new Schema<OrderDocument>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: { type: [orderProductSchema], required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], default: 'PENDING' },
    shipmentAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    paymentMethod: { type: String, enum: ['COD', 'SSLCOMMERZ'], default: 'COD' },
    transectionId: { type: String },
}, { timestamps: true });

const Order = mongoose.model<OrderDocument>('Order', orderSchema);
export default Order;

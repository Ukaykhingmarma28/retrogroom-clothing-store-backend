import mongoose, { Document } from 'mongoose';

export interface OrderProductDocument extends Document {
    product: mongoose.Types.ObjectId;
    color: string;
    size: string;
    quantity: number;
    reviewToken: string;
}

export interface OrderDocument extends Document {
    user: mongoose.Types.ObjectId;
    products: OrderProductDocument[];
    totalAmount: number;
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    shipmentAddress: string;
    city: string;
    state: string;
    zip: string;
    paymentMethod: 'COD' | 'SSLCOMMERZ';
    transectionId: string;
}

import { model, Schema } from "mongoose";
import { ProductDocument } from "./productTypes";

const productStockSchema = new Schema({
    color: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
});

const productSchema = new Schema<ProductDocument>({
    productName: {
        type: String,
        required: true,
    },
    productPrice: {
        type: Number,
        required: true,
    },
    productDescription: {
        type: String,
    },
    productImage: {
        type: String,
    },
    productImageUrl: {
        type: [String],
    },
    productCategory: {
        type: String,
        lowercase: true,
    },
    productSlug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    totalSoldProduct: {
        type: Number,
        default: 0,
    },
    productColors: [String],
    productSizes: [String],
    productStock: [productStockSchema], // Updated to use the productStockSchema
    productCollection: {
        type: String,
        lowercase: true,
    },
    productRatings: [
        {
            rating: {
                type: Number,
            },
            comment: {
                type: String,
            },
            orderProductId: {
                type: Schema.Types.ObjectId,
                ref: "Order",
            },
            postBy:{
                type: Schema.Types.ObjectId,
                ref: "User",
            }
        },
    ],
    productTotalRating: {
        type: Number,
        default: 0,
    },
},{timestamps: true}
);

const Product = model<ProductDocument>("Product", productSchema);
export default Product;

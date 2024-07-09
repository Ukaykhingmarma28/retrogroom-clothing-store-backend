import { Types, Document } from "mongoose";

export interface ProductStockDocument extends Document {
  color: string;
  size: string;
  quantity: number;
}

export interface ProductDocument extends Document {
  productId: string;
  productName: string;
  productPrice: number;
  productDescription: string;
  productImage: string;
  productImageUrl: string[];
  productCategory: string;
  productSlug: string;
  totalSoldProduct: number;
  productColors: string[];
  productSizes: string[];
  productStock: ProductStockDocument[]; // Updated to be an array of ProductStock objects
  productCollection: string;
  productRatings: {
    rating: number;
    comment: string;
    orderProductId: Types.ObjectId;
    postBy: Types.ObjectId;
  }[];
  productTotalRating: number;
}

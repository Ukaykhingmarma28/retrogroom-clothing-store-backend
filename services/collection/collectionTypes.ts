import { Types, Document } from "mongoose";

export interface CollectionDocument extends Document {
  collectionName: string;
  collectionProduct: Types.ObjectId[];
  collectionImage: string;
  collectionCategory: string
}
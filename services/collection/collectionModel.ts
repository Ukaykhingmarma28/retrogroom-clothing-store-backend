import { CollectionDocument } from "./collectionTypes";
import { Schema, Model, model } from "mongoose";

const collectionSchema = new Schema<CollectionDocument>({
  collectionName: {
    type: String,
    required: true,
    lowercase: true,
  },
  collectionProduct: [{
      type: Schema.Types.ObjectId,
      ref: "Product",
    }],
  collectionImage: String,
  collectionCategory: String
})

const Collection = model<CollectionDocument>("Collection", collectionSchema);
export default Collection;
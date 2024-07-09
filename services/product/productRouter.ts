import { Router } from "express";
import { isAdmin } from "../../src/middlewares/isAdmin";
import authMiddleware from "../../src/middlewares/authMiddleware";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProductByCategory,
  getProductByCollection,
  getProductBySlug,
  getProductByTag,
  productDataUpdate,
  productStockUpdate,
} from "./productController";

const productRouter = Router();

productRouter.get("/", getAllProduct);
productRouter.get("/collection/:collectionName", getProductByCollection);
productRouter.get("/:slug", getProductBySlug);
productRouter.get("/tag/:tag", getProductByTag);
productRouter.get("/category/:category", getProductByCategory);
productRouter.post("/createProduct", authMiddleware, isAdmin, createProduct);
productRouter.put("/:id", productDataUpdate);
productRouter.put(
  "/stock-update/:id",
  authMiddleware,
  isAdmin,
  productStockUpdate,
);
productRouter.delete("/:id", authMiddleware, isAdmin, deleteProduct);

export default productRouter;

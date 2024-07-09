import { Router } from "express";
import { getCollectionByCategory } from "./collectionController";

const collectionRouter = Router();

collectionRouter.get("/:collectionCategory", getCollectionByCategory);

export default collectionRouter;

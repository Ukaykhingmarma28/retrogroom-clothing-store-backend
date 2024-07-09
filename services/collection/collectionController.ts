//Get all by category

import { Request, Response, NextFunction } from "express";
import Collection from "./collectionModel";
import createHttpError from "http-errors";

export const getCollectionByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { collectionCategory } = req.params;
  if (!collectionCategory) {
    return next(createHttpError(404, `Bad Request`));
  }
  const collection = await Collection.findOne({ collectionCategory });
  if (!collection) {
    return next(
      createHttpError(404, `No collection for ${collectionCategory} category`),
    );
  }

  res.status(201).json({ collection: collection });
};

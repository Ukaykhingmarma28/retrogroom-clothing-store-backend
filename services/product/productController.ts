import { Request, Response, NextFunction } from 'express';
import createHttpError from "http-errors";
import Product from "./productModel";
import slugify from "slugify";
import { ProductDocument, ProductStockDocument } from "./productTypes";
import Collection from "../collection/collectionModel";


const updateProductColorsAndSizes = (productStock: any) => {
    const color = new Set<string>();
    const size = new Set<string>();

    productStock.forEach((variant: any) => {
        color.add(variant.color);
        size.add(variant.size);
    });

    const colors = Array.from(color);
    const sizes = Array.from(size);
    return {
        colors,
        sizes
    }
};

//Create Product
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const {  productName, productPrice, productDescription, productCategory, productStock, productColor, productCollection, productImageUrl, productImage } = req.body;
    if (!productName || !productPrice || !productDescription || !productCategory || !productStock) {
        return next(createHttpError(400, "Input required fields"));
    }
    const proSlug = slugify(productName);
    const proCollection = slugify(productCollection);
    const proCategory = slugify(productCategory);
    const product = await Product.findOne({ productSlug:proSlug });
    if (product) {
        return next(createHttpError(400, `${product?.productName} Product already exists`));
    }

    const productVariant = updateProductColorsAndSizes(productStock);

    try{

        const newProduct = new Product({
            productName,
            productPrice,
            productDescription,
            productCategory: proCategory,
            productSlug: proSlug,
            productColors: productVariant.colors,
            productSizes: productVariant.sizes,
            productStock,
            productColor,
            productCollection: proCollection,
            productImageUrl,
            productImage

        })

        const collection = await Collection.findOne({ collectionName: proCollection });
        if (collection) {
            await Collection.findOneAndUpdate({collectionName: collection.collectionName},{
                $push:{
                    collectionProduct: newProduct._id
                }
            })
        }else {
            const newCollection = new Collection({
                collectionName: proCollection,
                collectionProduct: newProduct._id,
                collectionImage:null,
                collectionCategory: newProduct.productCategory
            })

            await newCollection.save();
        }

        await newProduct.save();
        res.status(201).json({Product: newProduct, message: "Product created successfully."});
    }catch(err: any){
        return next(createHttpError(400, err.message));
    }
}


//Get All Product
export const getAllProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.find();
        res.status(200).json(product);
    }catch (err: any) {
        return next(createHttpError(500, err.message));
    }
}


//Get Product By Slug
export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    try {
        const product = await Product.find({ productSlug: slug});
        if(!product || product.length === 0) {
            return next(createHttpError(404, 'Product not found'));
        }
        res.status(200).json(product);
    }catch (err: any) {
        return next(createHttpError(500, err.message));
    }
}


//Get Product By Tag
export const getProductByTag = async (req: Request, res: Response, next: NextFunction) => {
    const tag = req.params.tag;
    try {
        const product = await Product.find({ productTags: tag});
        if(!product || product.length === 0) {
            return next(createHttpError(404, 'Product not found'));
        }
        res.status(200).json(product);
    }catch (err: any) {
        return next(createHttpError(500, err.message));
    }
}


//Get Product By Category
export const getProductByCategory = async (req: Request, res: Response, next: NextFunction) => {
    const category = req.params.category;
    try {
        const product = await Product.find({ productCategory: category});
        if(!product || product.length === 0) {
            return next(createHttpError(404, 'Product not found'));
        }
        res.status(200).json(product);
    }catch (err: any) {
        return next(createHttpError(500, err.message));
    }
}


//Update Product Data
export const productDataUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const  id  = req.params.id;
    const updateData = req.body;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return next(createHttpError(404, 'Product not found'));
        }

        if (updateData.productName) {
            product.productName = updateData.productName;
            product.productSlug = slugify(updateData.productName); // Update slug if productName changes
        }
        if (updateData.productPrice) {
            product.productPrice = updateData.productPrice;
        }
        if (updateData.productDescription) {
            product.productDescription = updateData.productDescription;
        }

        await product.save();
        res.status(200).json({ Product: product, message: 'Product updated successfully.' });
    } catch (err: any) {
        return next(createHttpError(500, err.message));
    }
}


//Update Product Stock
export const productStockUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { productStock }: { productStock: { color: string, size: string, quantity: number }[] } = req.body;

    if (!productStock || !Array.isArray(productStock) || productStock.length === 0) {
        return next(createHttpError(400, 'productStock must be a non-empty array'));
    }

    try {
        const product = await Product.findById(id);
        if (!product) {
            return next(createHttpError(404, 'Product not found'));
        }

        productStock.forEach((stockItem) => {
            const { color, size, quantity } = stockItem;
            let updated = false;

            // Update existing stock entry or add a new one
            product.productStock.forEach((variant: ProductStockDocument) => {
                if (variant.color === color && variant.size === size) {
                    variant.quantity = quantity;
                    updated = true;
                }
            });

            if (!updated) {
                // Add new stock entry if it doesn't exist
                const newStockEntry: ProductStockDocument = { color, size, quantity } as ProductStockDocument;
                product.productStock.push(newStockEntry);
            }
        });

        // Update productColors and productSizes fields
        const { colors, sizes } = updateProductColorsAndSizes(product.productStock);
        product.productColors = colors;
        product.productSizes = sizes;

        await product.save();
        res.status(200).json({ Product: product, message: 'Product stock updated successfully.' });
    } catch (err: any) {
        return next(createHttpError(500, err.message));
    }
};


//Delete Product
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const id  = req.params.id;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return next(createHttpError(404, 'Product not found'));
        }
        await product.deleteOne()
        res.status(200).json({ message: 'Product deleted successfully.' });
    }catch (err: any) {
        return next(createHttpError(500, err.message));
    }
}


//get product by collectionName
export const getProductByCollection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const collectionName = req.params.collectionName;
        const collection = await Collection.findOne({ collectionName });

        if (!collection) {
            return next(createHttpError(404, 'Collection not found'));
        }

        const collectionProductIds = collection.collectionProduct;
        const products = await Promise.all(
          collectionProductIds.map(itemId => Product.findById(itemId))
        );

        return res.status(200).json(products);
    } catch (error:any) {
        return next(createHttpError(500, error.message));
    }

}

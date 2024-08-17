import express, { Request, Response } from "express";
import ProductModel from "../models/Product";
import { verifyToken } from "../middlewares/verify";

const router = express.Router();

interface ProductDetails {
	title: string;
	image: string;
	description: string;
	price: number;
	brand: string;
	category: string;
	ratings: number;
}

interface ProductQueryParams {
	page?: string;
	size?: string;
	sort?: string;
	search?: string;
	brand?: string;
	category?: string;
	minPrice?: string;
	maxPrice?: string;
}

// create multiple products or a single product
router.post(
	"/",
	verifyToken,
	async (
		req: Request<{}, {}, ProductDetails | ProductDetails[]>,
		res: Response
	) => {
		try {
			// Check if req.body is an array (for multiple products)
			if (Array.isArray(req.body)) {
				// Insert multiple products
				const savedProducts = await ProductModel.insertMany(req.body);
				return res.status(201).send({
					success: true,
					insertedIds: savedProducts.map((product) => product._id),
					message: `${savedProducts.length} Products are Saved Successfully!`,
				});
			} else {
				// Insert a single product
				const newProduct = new ProductModel(req.body);
				const savedProduct = await newProduct.save();
				if (savedProduct?._id) {
					return res.status(201).send({
						success: true,
						insertedId: savedProduct._id,
						message: `${savedProduct.title} is Saved Successfully!`,
					});
				}
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error Creating Product: ", error.message);
				res.status(400).send({
					success: false,
					message: error.message,
				});
			} else {
				console.error("An Unknown Error Occurred!");
				res.status(500).send({
					success: false,
					message: "Internal Server Error!",
				});
			}
		}
	}
);

// get route for all products
router.get(
	"/",
	verifyToken,
	async (req: Request<{}, {}, {}, ProductQueryParams>, res: Response) => {
		try {
			const {
				page,
				size,
				sort,
				search,
				brand,
				category,
				minPrice,
				maxPrice,
			} = req.query;

			// Pagination parameters
			const processedPage = parseInt(page as string) || 1;
			const processedSize = parseInt(size as string) || 12;
			const skip = (processedPage - 1) * processedSize;

			// Sorting
			let sortBy: Record<string, any> = {};
			switch (sort) {
				case "price_asc":
					sortBy = { price: 1 };
					break;
				case "price_desc":
					sortBy = { price: -1 };
					break;
				case "date_desc":
					sortBy = { createdAt: -1 };
					break;
				case "date_asc":
					sortBy = { createdAt: 1 };
					break;
				case "ratings_desc":
					sortBy = { ratings: -1 };
					break;
				case "ratings_asc":
					sortBy = { ratings: 1 };
					break;
				default:
					sortBy = {};
			}

			// Filter criteria
			let filter: Record<string, any> = {};

			// Search by product name
			if (search && typeof search === "string") {
				const searchText = search.trim();
				if (searchText.length) {
					filter.title = { $regex: searchText, $options: "i" };
				}
			}

			// Filter by brand
			if (brand && brand.length) {
				filter.brand = brand;
			}

			// Filter by category
			if (category && category.length) {
				filter.category = category;
			}

			// Filter by price range
			if (minPrice || maxPrice) {
				filter.price = {};
				if (minPrice) {
					filter.price.$gte = parseInt(minPrice);
				}
				if (maxPrice) {
					filter.price.$lte = parseInt(maxPrice);
				}
			}

			// Get filtered and sorted products with pagination
			const products = await ProductModel.find(filter)
				.sort(sortBy)
				.skip(skip)
				.limit(processedSize)
				.select({ description: 0, __v: 0 })
				.exec();

			// Get total product count for pagination
			const productCount = await ProductModel.countDocuments(filter);

			// Get conditional categories
			const categories = await ProductModel.distinct(
				"category",
				brand && brand.length ? { brand } : {}
			);

			// Get conditional brands
			const brands = await ProductModel.distinct(
				"brand",
				category && category.length ? { category } : {}
			);

			return res.status(200).send({
				success: true,
				productCount,
				totalPages: Math.ceil(productCount / processedSize),
				products,
				categories,
				brands,
			});
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error Getting Products: ", error.message);
				res.status(400).send({
					success: false,
					message: error.message,
				});
			} else {
				console.error("An Unknown Error Occurred!");
				res.status(500).send({
					success: false,
					message: "Internal Server Error!",
				});
			}
		}
	}
);

// get a single product by id
router.get("/single/:id", verifyToken, async (req: Request, res: Response) => {
	try {
		const product = await ProductModel.findById(req.params.id);
		if (product) {
			return res.status(200).send({ success: true, product });
		} else {
			return res
				.status(404)
				.send({ success: false, message: "Product Not Found!" });
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error Getting Product: ", error.message);
			res.status(400).send({
				success: false,
				message: error.message,
			});
		} else {
			console.error("An Unknown Error Occurred!");
			res.status(500).send({
				success: false,
				message: "Internal Server Error!",
			});
		}
	}
});

export default router;

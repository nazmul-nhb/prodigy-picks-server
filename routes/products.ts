import express, { Request, Response } from "express";
import ProductModel from "../models/Product";

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

// create multiple products or a single product
router.post(
	"/",
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
router.get("/", async (req: Request, res: Response) => {
	try {
		// Pagination parameters
		const page = parseInt(req.query.page as string) || 1;
		const size = parseInt(req.query.size as string) || 12;
		const skip = (page - 1) * size;

		// Sorting
		let sortBy: Record<string, any> = {};
		switch (req.query.sort) {
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
			default:
				sortBy = {};
		}

		// Filter criteria
		let filter: Record<string, any> = {};

		// Search by product name
		if (req.query.search && typeof req.query.search === "string") {
			const searchText = req.query.search.trim();
			if (searchText.length) {
				filter.title = { $regex: searchText, $options: "i" };
			}
		}

		// Filter by brand
		if (req.query.brand && req.query.brand.length) {
			filter.brand = req.query.brand;
		}

		// Filter by category
		if (req.query.category && req.query.category.length) {
			filter.category = req.query.category;
		}

		// Filter by price range
		if (req.query.minPrice || req.query.maxPrice) {
			filter.price = {};
			if (req.query.minPrice) {
				filter.price.$gte = parseInt(req.query.minPrice as string);
			}
			if (req.query.maxPrice) {
				filter.price.$lte = parseInt(req.query.maxPrice as string);
			}
		}

		// console.log({sortBy, filter});

		// Get filtered and sorted products with pagination
		const products = await ProductModel.find(filter)
			.sort(sortBy)
			.skip(skip)
			.limit(size)
			.select({ description: 0, __v: 0 })
			.exec();

		// Get total product count for pagination
		const productCount = await ProductModel.countDocuments(filter);

		return res.status(200).send({
			success: true,
			productCount,
			totalPages: Math.ceil(productCount / size),
			products,
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
});

// get a single product by id
router.get("/single/:id", async (req: Request, res: Response) => {
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

// get list of categories
router.get("/categories", async (req: Request, res: Response) => {
	try {
		// Use the distinct method to get unique categories
		const categories = await ProductModel.distinct("category");

		return res.status(200).send({
			success: true,
			categories,
		});
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error Getting Categories: ", error.message);
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

// get list of brands
router.get("/brands", async (req: Request, res: Response) => {
	try {
		// Use the distinct method to get unique brands
		const brands = await ProductModel.distinct("brand");

		return res.status(200).send({
			success: true,
			brands,
		});
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error Getting Brands: ", error.message);
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

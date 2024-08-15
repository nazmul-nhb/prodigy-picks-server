import { Document, Schema, model } from "mongoose";

// interface for product
export interface Product extends Document {
	title: string;
	image: string;
	description: string;
	price: number;
	brand: string;
	category: string;
	ratings: number;
	createdAt: Date;
}

// define the schema for product
export const productSchema = new Schema<Product>({
	title: {
		type: String,
		required: [true, "Provide the product title!"],
	},
	image: {
		type: String,
		required: [true, "Provide the product image URL!"],
	},
	description: {
		type: String,
		required: [true, "Provide the product description!"],
	},
	price: {
		type: Number,
		required: [true, "Provide the product price!"],
	},
	brand: {
		type: String,
		required: [true, "Provide a product brand!"],
	},
	category: {
		type: String,
		required: [true, "Provide the product category!"],
	},
	ratings: {
		type: Number,
		default: 0,
		min: [0, "Ratings cannot be less than 0"],
		max: [5, "Ratings cannot be more than 5"],
		validate: {
			validator: (value: any) =>
				typeof value === "number" && !isNaN(value),
			message: "Ratings must be a valid number!",
		},
	},
	createdAt: { type: Date, default: Date.now },
});

// create product model
const ProductModel = model<Product>("Product", productSchema);

export default ProductModel;

import { ApiResponse } from "@/types/common.type";
import { Product } from "@/types/product.type";
import axios from "axios";

export const getProducts = async (params: {
	skip?: number;
	limit?: number;
	sort_by?: string;
	sort_dir?: string;
	name?: string;
	category?: string;
	min_price?: number;
	max_price?: number;
}): Promise<ApiResponse<Product[]>> => {
	try {
		const response = await axios.get<ApiResponse<Product[]>>(
			"/api/v1/product",
			{
				params,
			}
		);

		return response.data;
	} catch (error) {
		console.error("Error fetching products from Next.js API:", error);

		return {
			success: false,
			message: "Failed to fetch products.",
			data: [],
			errorCode: "FRONTEND_FETCH_ERROR",
		};
	}
};

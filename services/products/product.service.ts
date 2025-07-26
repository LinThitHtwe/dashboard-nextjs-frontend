import { ApiResponse } from "@/types/common.type";
import { Product } from "@/types/product.type";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const getProducts = async (params: {
	skip?: number;
	limit?: number;
	sort_by?: string;
	sort_dir?: string;
}): Promise<ApiResponse<Product[]> | null> => {
	try {
		const response = await axios.get<ApiResponse<Product[]>>(
			`${API_BASE_URL}/products`,
			{
				params,
			}
		);

		return response.data;
	} catch (error) {
		console.error("Error fetching products:", error);
		return null;
	}
};

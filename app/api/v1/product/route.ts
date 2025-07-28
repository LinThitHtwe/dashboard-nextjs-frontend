import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { ApiResponse } from "@/types/common.type";
import { Product } from "@/types/product.type";

const BACKEND_API = "http://127.0.0.1:8000/products";

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);

	const queryParams = {
		skip: searchParams.get("skip"),
		limit: searchParams.get("limit"),
		sort_by: searchParams.get("sort_by"),
		sort_dir: searchParams.get("sort_dir"),
		name: searchParams.get("name"),
		category: searchParams.get("category"),
		min_price: searchParams.get("min_price"),
		max_price: searchParams.get("max_price"),
	};

	try {
		const response = await axios.get<ApiResponse<Product[]>>(BACKEND_API, {
			params: queryParams,
		});

		return NextResponse.json(response.data);
	} catch (error) {
		console.error("Error in Next.js API:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to fetch products.",
				data: [],
				errorCode: "NEXT_API_ERROR",
			},
			{ status: 500 }
		);
	}
}

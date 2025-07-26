"use client";
import { useEffect, useState } from "react";
import { Product } from "@/types/product.type";
import { ApiResponse } from "@/types/common.type";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { getProducts } from "@/services/products/product.service";

const ProductTablePage = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const response: ApiResponse<Product[]> | null = await getProducts({
				skip: 0,
				limit: 10,
				sort_by: "id",
				sort_dir: "asc",
			});

			if (response?.success && response.data) {
				setProducts(response.data);
			}

			setLoading(false);
		};

		fetchData();
	}, []);

	return (
		<div className="max-w-6xl mx-auto py-10 px-4">
			<Card>
				<CardContent className="p-4">
					<h1 className="text-2xl font-semibold mb-4">Product List</h1>

					{loading ? (
						<div className="space-y-2">
							{[...Array(5)].map((_, i) => (
								<Skeleton key={i} className="h-10 w-full" />
							))}
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Category</TableHead>
									<TableHead>Price</TableHead>
									<TableHead>Stock</TableHead>
									<TableHead>Rating</TableHead>
									<TableHead>Created At</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{products.map((product) => (
									<TableRow key={product.id}>
										<TableCell>{product.id}</TableCell>
										<TableCell>{product.name}</TableCell>
										<TableCell>{product.category}</TableCell>
										<TableCell>${product.price.toFixed(2)}</TableCell>
										<TableCell>{product.stock}</TableCell>
										<TableCell>{product.rating}</TableCell>
										<TableCell>
											{new Date(product.created_at).toLocaleDateString()}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default ProductTablePage;

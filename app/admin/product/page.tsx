"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/products/product.service";
import { ApiResponse } from "@/types/common.type";
import { Product } from "@/types/product.type";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import {
	PRODUCT_CATEGORY_FIELDS,
	PRODUCT_DEFAULT_QUERY,
	PRODUCT_SORT_FIELDS,
} from "@/constants/product.constant";
import {
	AMOUNT_PER_PAGE_FIELDS,
	SORT_DIRECTIONS,
} from "@/constants/common.constant";

const ProductTablePage = () => {
	const [inputCategory, setInputCategory] = useState(
		PRODUCT_CATEGORY_FIELDS[0]
	);
	const [inputLimit, setInputLimit] = useState(
		PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_LIMIT
	);
	const [inputMinPrice, setInputMinPrice] = useState(
		PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_MIN_PRICE
	);
	const [inputMaxPrice, setInputMaxPrice] = useState(
		PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_MAX_PRICE
	);
	const [inputSortBy, setInputSortBy] = useState(
		PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_SORT_BY
	);
	const [inputSortDir, setInputSortDir] = useState(
		PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_SORT_DIR
	);

	const [filters, setFilters] = useState({
		skip: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_SKIP,
		limit: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_LIMIT,
		sortBy: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_SORT_BY,
		sortDir: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_SORT_DIR,
		category: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_CATEGORY,
		minPrice: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_MIN_PRICE,
		maxPrice: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_MAX_PRICE,
	});

	const { data, isFetching } = useQuery<ApiResponse<Product[]> | null>({
		queryKey: [
			"products",
			filters.skip,
			filters.limit,
			filters.sortBy,
			filters.sortDir,
			filters.category,
			filters.minPrice,
			filters.maxPrice,
		],
		queryFn: async (): Promise<ApiResponse<Product[]> | null> => {
			return await getProducts({
				skip: filters.skip,
				limit: filters.limit,
				sort_by: filters.sortBy,
				sort_dir: filters.sortDir,
				category: filters.category || undefined,
				min_price: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
				max_price: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
			});
		},
		//enabled: true,
	});

	const handleApplyFilters = () => {
		setFilters({
			skip: 0,
			limit: inputLimit,
			sortBy: inputSortBy,
			sortDir: inputSortDir,
			category: inputCategory == "All" ? "" : inputCategory,
			minPrice: inputMinPrice,
			maxPrice: inputMaxPrice,
		});
	};

	const handlePagination = (direction: "prev" | "next") => {
		const newSkip = Math.max(
			0,
			filters.skip + (direction === "next" ? filters.limit : -filters.limit)
		);
		setFilters((prev) => ({
			...prev,
			skip: newSkip,
		}));
	};

	const handleResetFilters = () => {
		setInputCategory(PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_CATEGORY);
		setInputLimit(PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_LIMIT);
		setInputMinPrice(PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_MIN_PRICE);
		setInputMaxPrice(PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_MAX_PRICE);
		setInputSortBy(PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_SORT_BY);
		setInputSortDir(PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_SORT_DIR);
		setFilters({
			skip: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_SKIP,
			limit: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_LIMIT,
			sortBy: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_SORT_BY,
			sortDir: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_SORT_DIR,
			category: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_CATEGORY,
			minPrice: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_MIN_PRICE,
			maxPrice: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_MAX_PRICE,
		});
	};

	const isFilterChanged =
		filters.category !== PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_CATEGORY ||
		filters.limit !== PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_LIMIT ||
		filters.minPrice !== PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_MIN_PRICE ||
		filters.maxPrice !== PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_MAX_PRICE ||
		filters.sortBy !== PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_SORT_BY ||
		filters.sortDir !== PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_SORT_DIR;

	const products = data?.success ? data.data : [];

	return (
		<div className="w-full mx-auto py-10 px-4">
			<Card>
				<CardContent className="p-4 space-y-4">
					<h1 className="text-2xl font-semibold">Product List</h1>

					<div className="grid grid-cols-4 gap-5 ">
						<div>
							<p className="mb-2">Category</p>
							<Select value={inputCategory} onValueChange={setInputCategory}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Category" />
								</SelectTrigger>
								<SelectContent>
									{PRODUCT_CATEGORY_FIELDS.map((f) => (
										<SelectItem key={f} value={f}>
											{f}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<p className="mb-2">Min Price</p>
							<Input
								type="number"
								placeholder="Min Price"
								value={inputMinPrice}
								onChange={(e) => setInputMinPrice(e.target.value)}
							/>
						</div>
						<div>
							<p className="mb-2">Max Price</p>
							<Input
								type="number"
								placeholder="Max Price"
								value={inputMaxPrice}
								onChange={(e) => setInputMaxPrice(e.target.value)}
							/>
						</div>
						<div>
							<p className="mb-2">Items per page</p>
							<Select
								value={inputLimit.toString()}
								onValueChange={(value) => setInputLimit(parseInt(value))}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Items per page" />
								</SelectTrigger>
								<SelectContent>
									{AMOUNT_PER_PAGE_FIELDS.map((f) => (
										<SelectItem key={f} value={f.toString()}>
											{f}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="grid grid-cols-3 gap-5">
						<div className=" grid grid-cols-2 gap-5">
							<div>
								<p className="mb-2">Sort By</p>
								<Select value={inputSortBy} onValueChange={setInputSortBy}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Sort by" />
									</SelectTrigger>
									<SelectContent>
										{PRODUCT_SORT_FIELDS.map((f) => (
											<SelectItem key={f} value={f}>
												{f}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<p className="mb-2">Sort Direction</p>
								<Select value={inputSortDir} onValueChange={setInputSortDir}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Sort direction" />
									</SelectTrigger>
									<SelectContent>
										{SORT_DIRECTIONS.map((d) => (
											<SelectItem key={d} value={d}>
												{d}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="flex items-end gap-2 ">
							<Button className="w-fit" onClick={handleApplyFilters}>
								Apply
							</Button>
							{isFilterChanged && (
								<Button
									variant="secondary"
									className="w-fit"
									onClick={handleResetFilters}>
									Reset
								</Button>
							)}
						</div>
					</div>

					{isFetching ? (
						<div className="space-y-2">
							{[...Array(10)].map((_, i) => (
								<Skeleton key={i} className="h-8  w-full" />
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
								{products && products.length > 0 ? (
									products.map((product) => (
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
									))
								) : (
									<TableRow>
										<TableCell colSpan={7} className="text-center">
											No products found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					)}

					<div className="flex justify-between mt-4">
						<Button
							onClick={() => handlePagination("prev")}
							disabled={filters.skip === 0}>
							Previous
						</Button>
						<Button onClick={() => handlePagination("next")}>Next</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ProductTablePage;

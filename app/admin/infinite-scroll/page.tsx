"use client";

import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useCallback, useEffect, useState } from "react";
import { getProducts } from "@/services/products/product.service";
import { ApiResponse } from "@/types/common.type";
import { Product } from "@/types/product.type";
import { Skeleton } from "@/components/ui/skeleton";
import {
	PRODUCT_CATEGORY_FIELDS,
	PRODUCT_DEFAULT_QUERY,
	PRODUCT_SORT_FIELDS_INFINITE_SCROLL,
} from "@/constants/product.constant";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SORT_DIRECTIONS } from "@/constants/common.constant";
import { ProductCard } from "@/components/product/ProductCard";

const PAGE_SIZE = 12;

export default function ProductInfiniteScrollPage() {
	const [inputName, setInputName] = useState(
		PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_NAME
	);
	const [inputCategory, setInputCategory] = useState(
		PRODUCT_CATEGORY_FIELDS[0]
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
		name: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_NAME,
	});

	const observerRef = useRef<HTMLDivElement | null>(null);

	const {
		data,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
	} = useInfiniteQuery<
		ApiResponse<Product[]>,
		Error,
		InfiniteData<ApiResponse<Product[]>>,
		[
			"products",
			string | undefined,
			number | undefined,
			number | undefined,
			string | undefined,
			string | undefined,
			string | undefined
		],
		number
	>({
		queryKey: [
			"products",
			filters.category,
			filters.minPrice ? parseFloat(filters.minPrice) : undefined,
			filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
			filters.name,
			filters.sortBy,
			filters.sortDir,
		],

		queryFn: async ({ pageParam = 0 }) => {
			return await getProducts({
				skip: pageParam,
				limit: PAGE_SIZE,
				category: filters.category || undefined,
				min_price: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
				max_price: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
				name: filters.name || undefined,
				sort_by: filters.sortBy || undefined,
				sort_dir: filters.sortDir || undefined,
			});
		},

		initialPageParam: 0,

		getNextPageParam: (lastPage, pages) => {
			const items = lastPage?.data ?? [];
			return items.length === PAGE_SIZE ? pages.length * PAGE_SIZE : undefined;
		},
	});

	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const target = entries[0];
			if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
				fetchNextPage();
			}
		},
		[fetchNextPage, hasNextPage, isFetchingNextPage]
	);

	useEffect(() => {
		const option = { root: null, rootMargin: "0px", threshold: 1.0 };
		const observer = new IntersectionObserver(handleObserver, option);
		const current = observerRef.current;
		if (current) observer.observe(current);
		return () => {
			if (current) observer.unobserve(current);
		};
	}, [handleObserver]);

	const handleSearch = () => {
		setFilters({
			skip: 0,
			limit: filters.limit,
			sortBy: inputSortBy,
			sortDir: inputSortDir,
			category: inputCategory == "All" ? "" : inputCategory,
			minPrice: inputMinPrice,
			maxPrice: inputMaxPrice,
			name: inputName,
		});
	};

	const isFilterChanged =
		filters.category !== PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_CATEGORY ||
		filters.minPrice !== PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_MIN_PRICE ||
		filters.maxPrice !== PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_MAX_PRICE ||
		filters.sortBy !== PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_SORT_BY ||
		filters.sortDir !== PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_SORT_DIR ||
		filters.name !== PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_NAME;

	const handleResetFilters = () => {
		setInputCategory(PRODUCT_CATEGORY_FIELDS[0]);
		setInputMinPrice(PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_MIN_PRICE);
		setInputMaxPrice(PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_MAX_PRICE);
		setInputSortBy(PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_SORT_BY);
		setInputSortDir(PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_SORT_DIR);
		setInputName(PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_NAME);
		setFilters({
			skip: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_SKIP,
			limit: PAGE_SIZE,
			sortBy: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_SORT_BY,
			sortDir: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_SORT_DIR,
			category: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_CATEGORY,
			minPrice: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_MIN_PRICE,
			maxPrice: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_MAX_PRICE,
			name: PRODUCT_DEFAULT_QUERY.DEFAULT_PRODUCT_NAME,
		});
	};

	const products: Product[] =
		data?.pages.flatMap((page) => (page.success ? page.data ?? [] : [])) ?? [];

	return (
		<div className="p-4">
			<h1 className="text-2xl font-semibold mb-6">Explore Products</h1>
			<div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
				<div>
					<Label className="mb-2" htmlFor="name">
						Search
					</Label>
					<Input
						id="name"
						placeholder="Product name"
						value={inputName}
						onChange={(e) => setInputName(e.target.value)}
					/>
				</div>

				<div>
					<Label className="mb-2" htmlFor="category">
						Category
					</Label>
					<Select value={inputCategory} onValueChange={setInputCategory}>
						<SelectTrigger className="w-full" id="category">
							<SelectValue placeholder="Select category" />
						</SelectTrigger>
						<SelectContent>
							{PRODUCT_CATEGORY_FIELDS.map((cat) => (
								<SelectItem key={cat} value={cat}>
									{cat}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="grid grid-cols-2 gap-2">
					<div>
						<Label className="mb-2" htmlFor="minPrice">
							Min Price
						</Label>
						<Input
							type="number"
							id="minPrice"
							value={inputMinPrice}
							onChange={(e) => setInputMinPrice(e.target.value)}
						/>
					</div>
					<div>
						<Label className="mb-2" htmlFor="maxPrice">
							Max Price
						</Label>
						<Input
							type="number"
							id="maxPrice"
							value={inputMaxPrice}
							onChange={(e) => setInputMaxPrice(e.target.value)}
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-2">
					<div>
						<Label className="mb-2" htmlFor="sortBy">
							Sort By
						</Label>
						<Select value={inputSortBy} onValueChange={setInputSortBy}>
							<SelectTrigger className="w-full" id="sortBy">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								{PRODUCT_SORT_FIELDS_INFINITE_SCROLL.map((sort_by) => (
									<SelectItem key={sort_by} value={sort_by}>
										{sort_by}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label className="mb-2" htmlFor="sortDir">
							Sort Order
						</Label>
						<Select value={inputSortDir} onValueChange={setInputSortDir}>
							<SelectTrigger className="w-full" id="sortDir">
								<SelectValue placeholder="Sort order" />
							</SelectTrigger>
							<SelectContent>
								{SORT_DIRECTIONS.map((sort_dir) => (
									<SelectItem key={sort_dir} value={sort_dir}>
										{sort_dir}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="flex items-end gap-4">
					<Button type="button" className="w-fit" onClick={handleSearch}>
						Search
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

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{isLoading && (
					<>
						{[...Array(PAGE_SIZE)].map((_, i) => (
							<Skeleton key={i} className="h-72 rounded-xl" />
						))}
					</>
				)}
				{isError && (
					<div className="text-red-500 h-1/2 p-4">Something went wrong.</div>
				)}

				{products &&
					products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
			</div>

			{isFetchingNextPage && (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
					{[...Array(PAGE_SIZE)].map((_, i) => (
						<Skeleton key={i} className="h-52 rounded-xl" />
					))}
				</div>
			)}

			<div ref={observerRef} className="h-1 mt-10" />

			{!hasNextPage && (
				<p className="text-center mt-10 text-gray-500 text-sm">
					You&apos;ve reached the end.
				</p>
			)}
		</div>
	);
}

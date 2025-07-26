export interface Product {
	id: number;
	name: string;
	category: string;
	description: string;
	price: number;
	stock: number;
	rating: number;
	created_at: string;
	updated_at: string;
}

export interface ProductMeta {
	count: number;
	skip: number;
	limit: number;
	sort_by: string;
	sort_dir: string;
	elapsed_ms: number;
}

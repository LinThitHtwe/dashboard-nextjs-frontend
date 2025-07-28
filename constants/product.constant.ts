export const PRODUCT_SORT_FIELDS = [
	"id",
	"stock",
	"rating",
	"price",
	"created_at",
];
export const PRODUCT_CATEGORY_FIELDS = [
	"All",
	"Tech",
	"Books",
	"Clothes",
	"Home",
	"Toys",
];

export const PRODUCT_SORT_FIELDS_INFINITE_SCROLL = ["price", "stock", "rating"];

export const PRODUCT_DEFAULT_QUERY = {
	DEFAULT_PRODUCT_NAME: "",
	DEFAULT_PRODUCT_CATEGORY: "",
	DEFAULT_PRODUCT_LIMIT: 10,
	DEFAULT_PRODUCT_MIN_PRICE: "",
	DEFAULT_PRODUCT_MAX_PRICE: "",
	DEFAULT_PRODUCT_SORT_BY: "id",
	DEFAULT_PRODUCT_SORT_DIR: "asc",
	DEFAULT_PRODUCT_SKIP: 0,
};

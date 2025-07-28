import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/product.type";

interface ProductCardProps {
	product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
	return (
		<Card className="rounded-xl shadow hover:shadow-lg transition">
			<CardContent className="p-4 space-y-2">
				<div className="h-40 bg-gray-100 rounded flex items-center justify-center"></div>
				<h3 className="text-lg font-medium">{product.name}</h3>
				<p className="text-sm text-muted-foreground">{product.category}</p>
				<p className="font-semibold text-primary">
					${product.price.toFixed(2)}
				</p>
				<p className="text-xs text-muted-foreground">
					Stock: {product.stock} | Rating: {product.rating}
				</p>
			</CardContent>
		</Card>
	);
};

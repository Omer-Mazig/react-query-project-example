import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Star, StarOff, Trash2 } from "lucide-react";
import { Product } from "@/lib/api";
import { Skeleton } from "./ui/skeleton";

interface ProductListItemProps {
  product: Product;
  handleToggleFeatured: (product: Product) => void;
  handleDelete: (id: string) => void;
}

export function ProductListItem({
  product,
  handleToggleFeatured,
  handleDelete,
}: ProductListItemProps) {
  return (
    <li key={product.id} className="flex items-center justify-between">
      <Link
        to={`/products/${product.id}`}
        className="hover:underline hover:text-primary"
      >
        {product.title}
      </Link>
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="ghost"
          className="group"
          onClick={() => handleToggleFeatured(product)}
        >
          {product.isFeatured ? (
            <Star className="h-4 w-4 group-hover:text-primary" />
          ) : (
            <StarOff className="h-4 w-4 group-hover:text-primary" />
          )}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="group"
          onClick={() => handleDelete(product.id)}
        >
          <Trash2 className="h-4 w-4 group-hover:text-destructive" />
        </Button>
      </div>
    </li>
  );
}

export function ProductListItemSkeleton() {
  return (
    <li className="flex items-center justify-between">
      <Skeleton className="w-3/4 h-8" />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </li>
  );
}

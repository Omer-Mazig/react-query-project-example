import { Product } from "@/lib/api";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { Star, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useDeleteProduct } from "@/hooks/use-delete-product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const deleteProductMutation = useDeleteProduct();
  function handleDelete(
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) {
    ev.preventDefault();
    ev.stopPropagation();
    deleteProductMutation.mutate(id);
  }

  return (
    <Link key={product.id} to={`/products/${product.id}`}>
      <Card className="bg-slate-200 shadow-lg hover:shadow-2xl transition duration-150 h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{product.title}</span>
            {product.isFeatured && <Star className="w-4 h-4" />}
          </CardTitle>
          <CardDescription>{product.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Badge className="hover:bg-primary/100">{product.category}</Badge>
              <p>${product.price.toFixed(2)}</p>
            </div>
            <Button
              onClick={(ev) => handleDelete(ev, product.id)}
              variant="ghost"
              size="sm"
              className="group hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 group-hover:text-destructive" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="bg-slate-200 shadow-lg hover:shadow-2xl transition duration-150 h-full">
      <CardHeader>
        <div>
          <Skeleton className="w-1/2 h-10" />
        </div>
        <div>
          <Skeleton className="w-3/4 h-86" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <Skeleton className="w-[100px] h-4 bg-primary" />
          <Skeleton className="w-1/4 h-4" />
        </div>
      </CardContent>
    </Card>
  );
}

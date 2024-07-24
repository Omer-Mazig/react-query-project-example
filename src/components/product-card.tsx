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
import { Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
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
          <div className="flex justify-between">
            <Badge className="hover:bg-primary/100">{product.category}</Badge>
            <p>${product.price.toFixed(2)}</p>
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

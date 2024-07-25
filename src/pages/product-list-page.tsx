import { ProductCard, ProductCardSkeleton } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { fetchProducts, Product } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function ProductListPage() {
  const [search, setSearch] = useState("");
  const { data, error, isLoading, isError, isFetching } = useQuery<Product[]>({
    queryKey: ["products", { search }],
    queryFn: () => fetchProducts(search),
    // gcTime: 0,
    // staleTime: 1000 * 60,
  });

  const { toast } = useToast();

  useEffect(() => {
    // console.log("isLoading", isLoading);
    // console.log("isFetching", isFetching);

    if (isFetching && !isLoading) {
      toast({
        title: "Getting products...",
      });
    }

    if (!isFetching) {
      toast({
        title: "Up to date!",
        duration: 2000,
      });
    }
  }, [isFetching, toast]);

  return (
    <main className="container">
      <div className="bg-primary text-primary-foreground text-center py-4 px-2 rounded mb-4">
        <h1 className="text-3xl sm:text-6xl">My Products</h1>
      </div>

      <Input
        className="my-6"
        value={search}
        onChange={(ev) => setSearch(ev.target.value)}
      />

      {isError && (
        <div>
          Error:{" "}
          {error instanceof Error ? error.message : "Error fetching products"}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {data?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

export default ProductListPage;

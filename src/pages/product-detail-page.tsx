import { fetchProductById, Product } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();

  if (!productId) {
    return <div>Invalid product ID</div>;
  }

  const { data, error, isLoading, isError } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
  });

  if (isLoading) return <div>Loading product...</div>;
  if (isError)
    return (
      <div>
        Error:{" "}
        {error instanceof Error ? error.message : "Error fetching product"}
      </div>
    );

  return (
    <div>
      <h2>{data?.title}</h2>
      <p>{data?.description}</p>
    </div>
  );
}

export default ProductDetailPage;

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  fetchProducts,
  Product,
  deleteProduct,
  updateProduct,
} from "@/lib/api";
import { Menu } from "lucide-react";
import { Separator } from "./ui/separator";
import { useToast } from "./ui/use-toast";
import { ProductListItem, ProductListItemSkeleton } from "./product-list-item";

export function SideMenu() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, error, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    // Optimistic update
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries(["products"] as any);

      const previousProducts = queryClient.getQueryData<Product[]>([
        "products",
      ]);

      queryClient.setQueryData(
        ["products"],
        previousProducts?.filter(product => product.id !== productId)
      );

      return { previousProducts };
    },
    onError: (err, productId, context) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      queryClient.setQueryData(["products"], context?.previousProducts);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["products"] as any);
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: (product: Product) =>
      updateProduct(product.id.toString(), {
        isFeatured: !product.isFeatured,
      }),
    // Optimistic update
    onMutate: async (product: Product) => {
      await queryClient.cancelQueries(["products"] as any);

      const previousProducts = queryClient.getQueryData<Product[]>([
        "products",
      ]);

      queryClient.setQueryData(
        ["products"],
        previousProducts?.map(p =>
          p.id === product.id ? { ...p, isFeatured: !p.isFeatured } : p
        )
      );

      return { previousProducts };
    },
    onError: (err, product, context) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      queryClient.setQueryData(["products"], context?.previousProducts);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["products"] as any);
    },
  });

  function handleDelete(productId: string) {
    deleteProductMutation.mutate(productId);
  }

  function handleToggleFeatured(product: Product) {
    toggleFeaturedMutation.mutate(product);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            A generic side menu that displays a list of products and other
            features...
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-6" />
        <div>
          <h2 className="font-bold">My Products</h2>
          {isLoading ? (
            <ul className="space-y-2 mt-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductListItemSkeleton key={i} />
              ))}
            </ul>
          ) : (
            <ul>
              {data?.map(product => (
                <ProductListItem
                  key={product.id}
                  product={product}
                  handleToggleFeatured={handleToggleFeatured}
                  handleDelete={handleDelete}
                />
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

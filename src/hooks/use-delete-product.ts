import { toast } from "@/components/ui/use-toast";
import { deleteProduct, Product } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    // Optimistic update
    onMutate: async (productId: string) => {
      // await queryClient.cancelQueries(["products"] as any);

      const previousProducts = queryClient.getQueryData<Product[]>([
        "products",
      ]);

      queryClient.setQueryData(
        ["products"],
        previousProducts?.filter((product) => product.id !== productId)
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
  });
}

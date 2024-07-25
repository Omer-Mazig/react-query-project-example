import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  fetchProducts,
  Product,
  updateProduct,
  createProduct,
} from "@/lib/api";
import { Menu } from "lucide-react";
import { Separator } from "./ui/separator";
import { useToast } from "./ui/use-toast";
import { ProductListItem, ProductListItemSkeleton } from "./product-list-item";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { useDeleteProduct } from "@/hooks/use-delete-product";

export function SideMenu() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const closeRef = useRef<HTMLButtonElement>(null);

  const { data, error, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
  });

  // using custom hook
  const deleteProductMutation = useDeleteProduct();

  // using inline mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: (product: Product) =>
      updateProduct(product.id.toString(), {
        isFeatured: !product.isFeatured,
      }),
    // Optimistic update
    onMutate: async (product: Product) => {
      // await queryClient.cancelQueries(["products"] as any);

      const previousProducts = queryClient.getQueryData<Product[]>([
        "products",
      ]);

      queryClient.setQueryData(
        ["products"],
        previousProducts?.map((p) =>
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
  });

  const addProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"] as any),
        toast({
          title: "Success!",
          description: "Product added successfully.",
        });
      closeRef.current?.click();
    },
  });

  function handleDelete(productId: string) {
    deleteProductMutation.mutate(productId);
  }

  function handleToggleFeatured(product: Product) {
    toggleFeaturedMutation.mutate(product);
  }

  function onAddProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const p = formData.get("price") as string;
    const price = parseFloat(p);

    if (!title || !description || !category || !price) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please fill out all fields.",
      });
      return;
    }

    addProductMutation.mutate({
      title,
      description,
      category,
      price,
      isFeatured: false,
    });
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

        <ScrollArea className="h-[calc(100vh-175px)] ">
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
                {data?.map((product) => (
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
          <Separator className="my-6" />
          <div>
            <h2>Add Product</h2>
            <form onSubmit={onAddProduct}>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input name="title" type="text" id="title" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea name="description" id="description" />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input name="category" type="text" id="category" />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input name="price" type="number" id="price" />
              </div>
              <Button disabled={addProductMutation.isPending} type="submit">
                {addProductMutation.isPending ? "Adding..." : "Add Product"}
              </Button>
            </form>
          </div>
        </ScrollArea>
      </SheetContent>

      <SheetClose ref={closeRef} hidden></SheetClose>
    </Sheet>
  );
}

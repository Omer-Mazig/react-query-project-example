import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  isFeatured: boolean;
}

export const fetchProducts = async (): Promise<Product[]> => {
  console.log("fetching products");
  await _wait();
  const response = await api.get("/products");
  return response.data;
};

export const fetchProductById = async (id: string): Promise<Product> => {
  console.log("fetching product by id", id);

  // Simulate a slow network request for product with id "2"
  if (id === "2") {
    await _wait(4000);
  } else {
    await _wait();
  }
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  console.log("deleting product", id);
  await _wait();
  await api.delete(`/products/${id}`);
};

export const updateProduct = async (
  id: string,
  data: Partial<Product>
): Promise<Product> => {
  console.log("updating product", id, data);
  await _wait();

  // Simulate an error 😈
  if (id === "2") throw new Error("Failed to update product");
  const response = await api.patch(`/products/${id}`, data);
  return response.data;
};

async function _wait(ms: number = 2000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

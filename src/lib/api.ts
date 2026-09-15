export interface DummyJsonProduct {
  id: number;
  title: string;
  price: number;
  rating: number;
  discountPercentage: number;
  stock: number;
}

interface DummyJsonProductsResponse {
  products: DummyJsonProduct[];
}

/**
 * Public, no-auth REST API named directly in the challenge brief as an acceptable
 * source ("Use any public API such as: ... DummyJSON"). The numeric fields below
 * are real, live-fetched values — see lib/mapResourceData.ts for the deterministic
 * transformation into this section's cloud-cost visual language.
 */
const DUMMYJSON_ENDPOINT =
  "https://dummyjson.com/products?limit=10&select=id,title,price,rating,discountPercentage,stock";

export async function fetchCloudSourceData(): Promise<DummyJsonProduct[]> {
  const response = await fetch(DUMMYJSON_ENDPOINT);

  if (!response.ok) {
    throw new Error(`DummyJSON request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as DummyJsonProductsResponse;

  if (!Array.isArray(payload.products) || payload.products.length < 10) {
    throw new Error("DummyJSON response did not contain the expected product list");
  }

  return payload.products;
}

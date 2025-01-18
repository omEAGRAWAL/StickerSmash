const apiurl = "https://smyerver.vercel.app"; // Replace with your actual API URL
const storeid = "676f82c37ea3d34df66c6bd0";

/**
 * Fetches products for a given store ID.
 * @param {string} storeId - The store ID for which to fetch products.
 * @returns {Promise<Array>} - Resolves with an array of products or throws an error.
 */
export async function fetchProducts(storeId = storeid) {
  try {
    const response = await fetch(`${apiurl}/api/products/?storeid=${storeId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw new Error("Failed to load products.");
  }
}
//fetch categories
export async function fetchCategories() {
  try {
    const response = await fetch(`${apiurl}/api/categories`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw new Error("Failed to load categories.");
  }
}

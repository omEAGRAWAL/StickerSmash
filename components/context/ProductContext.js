import React, { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();

// Replace with your actual API URL and store ID
const apiurl = "https://smyerver.vercel.app";
const storeid = "676f82c37ea3d34df66c6bd0";

/**
 * Fetches products for a given store ID.
 * @param {string} storeId - The store ID for which to fetch products.
 * @returns {Promise<Array>} - Resolves with an array of products or throws an error.
 */
const fetchProducts = async (storeId = storeid) => {
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
};

/**
 * Fetches categories.
 * @returns {Promise<Array>} - Resolves with an array of categories or throws an error.
 */
const fetchCategories = async () => {
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
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);

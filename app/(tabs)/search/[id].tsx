import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categories: string[];
}

const ProductDetails = () => {
  const { id } = useLocalSearchParams();
  const query = id?.toLowerCase() || "";
  const apiUrl = "https://smyerver.vercel.app"; // Replace with your actual API URL
  const storeId = "676f82c37ea3d34df66c6bd0"; // Replace with your store ID

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/products/?storeid=${storeId}`
      );
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [100]);

  // Filter products to find those containing the query in their name or description
  const filteredProducts = products.filter(
    (product) =>
      product.categories.includes(query) ||
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
  );

  if (!id) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Search query is missing!</Text>
      </View>
    );
  }

  if (loadingProducts) {
    return (
      <View style={styles.container}>
        <Text>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No products found matching "{query}".</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        numColumns={2} // Two columns
        contentContainerStyle={{ paddingHorizontal: 10 }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 15,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  error: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
});

export default ProductDetails;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import ProductCard from "@/components/ProductCard";
import { Search, ArrowLeft } from "lucide-react-native";

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
  const apiUrl = "https://smyerver.vercel.app";
  const storeId = "676f82c37ea3d34df66c6bd0";

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchProducts = async (showLoader = true) => {
    if (showLoader) setLoadingProducts(true);
    try {
      const response = await fetch(
        `${apiUrl}/api/products/?storeid=${storeId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Product[] = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoadingProducts(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts(false);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.categories.includes(query) ||
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>
        {query ? `Results for "${query}"` : "All Products"}
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Search size={48} color="#666" />
      <Text style={styles.emptyText}>No products found matching "{query}"</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.button} onPress={() => fetchProducts()}>
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  if (!id) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Search query is missing!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {loadingProducts ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loaderText}>Loading products...</Text>
        </View>
      ) : error ? (
        renderError()
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard product={item} style={styles.productCard} />
          )}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#0066cc"]}
            />
          }
          ListEmptyComponent={renderEmpty()}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const { width } = Dimensions.get("window");
const PADDING = 16;
const COLUMN_GAP = 12;
const CARD_WIDTH = (width - (PADDING * 2 + COLUMN_GAP)) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: PADDING,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  listContainer: {
    padding: PADDING,
    paddingBottom: PADDING * 2,
  },
  columnWrapper: {
    gap: COLUMN_GAP,
    marginBottom: COLUMN_GAP,
  },
  productCard: {
    width: CARD_WIDTH,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: PADDING,
  },
  errorText: {
    fontSize: 16,
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: PADDING * 2,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#0066cc",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProductDetails;

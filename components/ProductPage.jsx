import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { useRoute } from "@react-navigation/native";

import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { setItem, checkCart } from "./context/Cart";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlist,
} from "./context/Wishlist";
import { fetchProducts } from "./context/getProduct";

const ProductPage = ({ productId }) => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [wishlisted, setWishlisted] = useState(false);
  const [inCart, setInCart] = useState(false);
  const route = useRoute();

  // Fetch products on component mount
  useEffect(() => {
    const fetchProductsFromAPI = async () => {
      try {
        const products = await fetchProducts();
        setProducts(products);
      } catch (error) {
        setError("Failed to fetch products");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProductsFromAPI();
  }, [route.name]);

  // Fetch wishlist and check if the product is wishlisted
  useEffect(() => {
    const fetchWishlistAndCheck = async () => {
      const items = await getWishlist("wishlist");
      setWishlist(items);
      setWishlisted(await checkWishlist("wishlist", productId));
      setInCart(await checkCart("cart", productId));
    };
    fetchWishlistAndCheck();
  }, [productId, route.name]);

  // Find the product by productId
  const product = products.find((prod) => prod._id === productId);

  if (loadingProducts) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found!</Text>
      </View>
    );
  }

  // Manage wishlist toggle
  const handleWishlist = async (product) => {
    if (wishlisted) {
      await removeFromWishlist("wishlist", product._id);
      setWishlisted(false);
    } else {
      await addToWishlist("wishlist", product);
      setWishlisted(true);
    }
  };

  // Manage cart
  const handleAddToCart = () => {
    setItem("cart", { _id: product._id, quantity: 1 });
    setInCart(true); // Update the state to reflect the item is in the cart
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.images[0] }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.description}>{product.description}</Text>

        {/* Add to Cart Button */}
        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
          <Ionicons
            name={inCart ? "cart" : "cart-outline"}
            size={24}
            color={inCart ? "green" : "black"}
          />
          <Text style={styles.cartButtonText}>
            {inCart ? "Add One More" : "Add to Cart"}
          </Text>
        </TouchableOpacity>

        {/* Wishlist Button */}
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={() => handleWishlist(product)}
        >
          <Ionicons
            name={wishlisted ? "heart" : "heart-outline"}
            size={24}
            color={wishlisted ? "red" : "black"}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eee",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: "#ddd",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -20,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginVertical: 8,
  },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  wishlistButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
});

export default ProductPage;

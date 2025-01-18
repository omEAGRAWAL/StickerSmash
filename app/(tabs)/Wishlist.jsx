import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet, Image } from "react-native";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "@/components/context/Wishlist"; // Adjust the path as needed

import { fetchProducts } from "@/components/context/getProduct";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);

  // Load wishlist items on component mount and fetch every second
  useEffect(() => {
    const intervalId = setInterval(
      async () => {
        const items = await getWishlist("wishlist");
        setWishlist(items);
      },

      1000
    );

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      const items = await getWishlist("wishlist");
      setWishlist(items);
    };
    fetchWishlist();
  }, []);

  //fetch

  // Fetch products from the API
  useEffect(() => {
    const fetchProductsFromAPI = async () => {
      try {
        const products = await fetchProducts();
        setProducts(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProductsFromAPI();
  }, []);

  // Combine wishlist items with product details
  const wishlistWithDetails = wishlist.map((item) => {
    const product = products.find((p) => p._id === item._id);
    return { ...item, ...product };
  });

  const handleRemoveFromWishlist = async (id) => {
    await removeFromWishlist("wishlist", id);
    const updatedWishlist = await getWishlist("wishlist");
    setWishlist(updatedWishlist);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Wishlist</Text>
      {wishlistWithDetails.length > 0 ? (
        <FlatList
          data={wishlistWithDetails}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Image
                source={{
                  uri: item.images[0] || "https://via.placeholder.com/100",
                }}
                style={styles.image}
              />
              <View style={styles.info}>
                <Text style={styles.name}>
                  {item.name || "Unknown Product"}
                </Text>
                <Text style={styles.price}>Price: ₹{item.price || "N/A"}</Text>

                <Button
                  title="Remove"
                  onPress={() => handleRemoveFromWishlist(item._id)}
                />
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyMessage}>Your wishlist is empty!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: "#28a745",
    marginBottom: 10,
  },
  emptyMessage: {
    fontSize: 18,
    color: "#6c757d",
    textAlign: "center",
    marginTop: 50,
  },
});

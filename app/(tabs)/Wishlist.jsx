import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  Animated,
  Platform,
} from "react-native";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useWishlist } from "@/components/context/WishlistContext";
import { useProductContext } from "@/components/context/ProductContext";

export default function Wishlist() {
  const { wishlist, addToWishlist, removeFromWishlist, checkInWishlist } =
    useWishlist();
  const { products, loading, error } = useProductContext();

  // Filter wishlist products from the products list
  const wishlistProduct = products.filter((product) =>
    wishlist.some((item) => item._id === product._id)
  );
  // Define fadeAnim as an Animated value
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Function to animate fade-in effect for each item
  const getFadeAnim = useCallback(
    (id) => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      return fadeAnim;
    },
    [fadeAnim]
  );

  const renderItem = useCallback(
    ({ item }) => {
      const fade = getFadeAnim(item._id);

      return (
        <Animated.View style={[styles.itemContainer, { opacity: fade }]}>
          
            <View style={styles.item}>
            <Link href={`/product/${item._id}`} style={styles.itemLink}>
              <Image
                source={{
                  uri: item.images?.[0] || "https://via.placeholder.com/100",
                }}
                style={styles.image}
              />
               </Link>
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2}>
                  {item.name || "Unknown Product"}
                </Text>
                <Text style={styles.description} numberOfLines={2}>
                  {item.description || "No description available"}
                </Text>
                <Text style={styles.price}>
                  ₹{item.price?.toLocaleString() || "N/A"}
                </Text>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFromWishlist(item._id)}
                >
                  <MaterialIcons name="favorite" size={20} color="#fff" />
                  <Text style={styles.removeButtonText}>
                    Remove from Wishlist
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
         
        </Animated.View>
      );
    },
    [getFadeAnim]
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wishlist</Text>
        <Text style={styles.subtitle}></Text>
      </View>

      {wishlistProduct.length > 0 ? (
        <FlatList
          data={wishlistProduct}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="favorite-border" size={64} color="#ccc" />
          <Text style={styles.emptyMessage}>Your wishlist is empty!</Text>
          <Text style={styles.emptySubMessage}>
            Add items to your wishlist to save them for later
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  listContainer: {
    padding: 15,
  },
  itemContainer: {
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  itemLink: {
    textDecorationLine: "none",
  },
  item: {
    flexDirection: "row",
    padding: 15,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  info: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2ecc71",
    marginBottom: 12,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6b6b",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyMessage: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
  },
  emptySubMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
  },
});

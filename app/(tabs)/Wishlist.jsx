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
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "@/components/context/Wishlist";
import { fetchProducts } from "@/components/context/getProduct";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fadeAnims] = useState(new Map());

  // Function to load wishlist data
  const loadWishlist = useCallback(async () => {
    try {
      const items = await getWishlist("wishlist");
      setWishlist(items);
    } catch (err) {
      console.error("Error loading wishlist:", err);
      setError("Failed to load wishlist");
    }
  }, []);

  // Setup storage event listener for web
  useEffect(() => {
    if (Platform.OS === "web") {
      const handleStorageChange = (e) => {
        if (e.key === "wishlist") {
          loadWishlist();
        }
      };

      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    } else {
      // For mobile: Poll for updates
      const intervalId = setInterval(loadWishlist, 1000);
      return () => clearInterval(intervalId);
    }
  }, [loadWishlist]);

  // Initial load of wishlist and products
  useEffect(() => {
    const initialize = async () => {
      try {
        await loadWishlist();
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
        setLoading(false);
      } catch (err) {
        console.error("Error initializing:", err);
        setError("Failed to initialize");
        setLoading(false);
      }
    };
    initialize();
  }, [loadWishlist]);

  // Get fade animation for item
  const getFadeAnim = useCallback(
    (id) => {
      if (!fadeAnims.has(id)) {
        fadeAnims.set(id, new Animated.Value(1));
      }
      return fadeAnims.get(id);
    },
    [fadeAnims]
  );

  const handleRemoveFromWishlist = useCallback(
    async (id) => {
      const fadeAnim = getFadeAnim(id);

      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(async () => {
        try {
          await removeFromWishlist("wishlist", id);
          await loadWishlist();
          fadeAnim.setValue(1);
        } catch (err) {
          console.error("Error removing from wishlist:", err);
          fadeAnim.setValue(1); // Reset animation if error
        }
      });
    },
    [getFadeAnim, loadWishlist]
  );

  // Combine wishlist items with product details
  const wishlistWithDetails = wishlist.map((item) => {
    const product = products.find((p) => p._id === item._id);
    return { ...item, ...product };
  });

  const renderItem = useCallback(
    ({ item }) => {
      const fadeAnim = getFadeAnim(item._id);

      return (
        <Animated.View style={[styles.itemContainer, { opacity: fadeAnim }]}>
          <Link href={`/product/${item._id}`} style={styles.itemLink}>
            <View style={styles.item}>
              <Image
                source={{
                  uri: item.images?.[0] || "https://via.placeholder.com/100",
                }}
                style={styles.image}
              />
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
                  onPress={() => handleRemoveFromWishlist(item._id)}
                >
                  <MaterialIcons name="favorite" size={20} color="#fff" />
                  <Text style={styles.removeButtonText}>
                    Remove from Wishlist
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Link>
        </Animated.View>
      );
    },
    [getFadeAnim, handleRemoveFromWishlist]
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
        <Text style={styles.subtitle}>
          {wishlistWithDetails.length}{" "}
          {wishlistWithDetails.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {wishlistWithDetails.length > 0 ? (
        <FlatList
          data={wishlistWithDetails}
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

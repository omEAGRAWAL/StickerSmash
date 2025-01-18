// import React, { useState, useEffect } from "react";
// import { View, Text, Button, FlatList, StyleSheet, Image } from "react-native";
// import {
//   addToWishlist,
//   removeFromWishlist,
//   getWishlist,
// } from "@/components/context/Wishlist"; // Adjust the path as needed

// import { fetchProducts } from "@/components/context/getProduct";

// export default function Wishlist() {
//   const [wishlist, setWishlist] = useState([]);
//   const [products, setProducts] = useState([]);

//   // Load wishlist items on component mount and fetch every second
//   useEffect(() => {
//     const intervalId = setInterval(
//       async () => {
//         const items = await getWishlist("wishlist");
//         setWishlist(items);
//       },

//       1000
//     );

//     return () => clearInterval(intervalId);
//   }, []);

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       const items = await getWishlist("wishlist");
//       setWishlist(items);
//     };
//     fetchWishlist();
//   }, []);

//   //fetch

//   // Fetch products from the API
//   useEffect(() => {
//     const fetchProductsFromAPI = async () => {
//       try {
//         const products = await fetchProducts();
//         setProducts(products);
//       } catch (error) {
//         console.error("Failed to fetch products:", error);
//       }
//     };
//     fetchProductsFromAPI();
//   }, []);

//   // Combine wishlist items with product details
//   const wishlistWithDetails = wishlist.map((item) => {
//     const product = products.find((p) => p._id === item._id);
//     return { ...item, ...product };
//   });

//   const handleRemoveFromWishlist = async (id) => {
//     await removeFromWishlist("wishlist", id);
//     const updatedWishlist = await getWishlist("wishlist");
//     setWishlist(updatedWishlist);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>My Wishlist</Text>
//       {wishlistWithDetails.length > 0 ? (
//         <FlatList
//           data={wishlistWithDetails}
//           keyExtractor={(item) => item._id}
//           renderItem={({ item }) => (
//             <View style={styles.item}>
//               <Image
//                 source={{
//                   uri: item.images[0] || "https://via.placeholder.com/100",
//                 }}
//                 style={styles.image}
//               />
//               <View style={styles.info}>
//                 <Text style={styles.name}>
//                   {item.name || "Unknown Product"}
//                 </Text>
//                 <Text style={styles.price}>Price: ₹{item.price || "N/A"}</Text>

//                 <Button
//                   title="Remove"
//                   onPress={() => handleRemoveFromWishlist(item._id)}
//                 />
//               </View>
//             </View>
//           )}
//         />
//       ) : (
//         <Text style={styles.emptyMessage}>Your wishlist is empty!</Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#f8f9fa",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   item: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 15,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     padding: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     borderRadius: 8,
//     marginRight: 15,
//   },
//   info: {
//     flex: 1,
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   price: {
//     fontSize: 16,
//     color: "#28a745",
//     marginBottom: 10,
//   },
//   emptyMessage: {
//     fontSize: 18,
//     color: "#6c757d",
//     textAlign: "center",
//     marginTop: 50,
//   },
// });
import React, { useState, useEffect } from "react";
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

  // Load wishlist items and poll for updates
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const items = await getWishlist("wishlist");
      setWishlist(items);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Initial wishlist load
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const items = await getWishlist("wishlist");
        setWishlist(items);
      } catch (err) {
        setError("Failed to load wishlist");
      }
    };
    fetchWishlist();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProductsFromAPI = async () => {
      try {
        const products = await fetchProducts();
        setProducts(products);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products");
        setLoading(false);
      }
    };
    fetchProductsFromAPI();
  }, []);

  // Get fade animation for item
  const getFadeAnim = (id) => {
    if (!fadeAnims.has(id)) {
      fadeAnims.set(id, new Animated.Value(1));
    }
    return fadeAnims.get(id);
  };

  const handleRemoveFromWishlist = async (id) => {
    const fadeAnim = getFadeAnim(id);

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(async () => {
      await removeFromWishlist("wishlist", id);
      const updatedWishlist = await getWishlist("wishlist");
      setWishlist(updatedWishlist);
      fadeAnim.setValue(1);
    });
  };

  // Combine wishlist items with product details
  const wishlistWithDetails = wishlist.map((item) => {
    const product = products.find((p) => p._id === item._id);
    return { ...item, ...product };
  });

  const renderItem = ({ item }) => {
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
  };

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

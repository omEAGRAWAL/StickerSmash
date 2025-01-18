// import React, { useState, useEffect } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Platform } from "react-native";
// import { useRoute } from "@react-navigation/native";

// import {
//   StyleSheet,
//   View,
//   Text,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { setItem, checkCart } from "./context/Cart";
// import {
//   addToWishlist,
//   removeFromWishlist,
//   getWishlist,
//   checkWishlist,
// } from "./context/Wishlist";
// import { fetchProducts } from "./context/getProduct";

// const ProductPage = ({ productId }) => {
//   const [products, setProducts] = useState([]);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [error, setError] = useState(null);
//   const [wishlist, setWishlist] = useState([]);
//   const [wishlisted, setWishlisted] = useState(false);
//   const [inCart, setInCart] = useState(false);
//   const route = useRoute();

//   // Fetch products on component mount
//   useEffect(() => {
//     const fetchProductsFromAPI = async () => {
//       try {
//         const products = await fetchProducts();
//         setProducts(products);
//       } catch (error) {
//         setError("Failed to fetch products");
//       } finally {
//         setLoadingProducts(false);
//       }
//     };
//     fetchProductsFromAPI();
//   }, [route.name]);

//   // Fetch wishlist and check if the product is wishlisted
//   useEffect(() => {
//     const fetchWishlistAndCheck = async () => {
//       const items = await getWishlist("wishlist");
//       setWishlist(items);
//       setWishlisted(await checkWishlist("wishlist", productId));
//       setInCart(await checkCart("cart", productId));
//     };
//     fetchWishlistAndCheck();
//   }, [productId, route.name]);

//   // Find the product by productId
//   const product = products.find((prod) => prod._id === productId);

//   if (loadingProducts) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text>Loading products...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   if (!product) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Product not found!</Text>
//       </View>
//     );
//   }

//   // Manage wishlist toggle
//   const handleWishlist = async (product) => {
//     if (wishlisted) {
//       await removeFromWishlist("wishlist", product._id);
//       setWishlisted(false);
//     } else {
//       await addToWishlist("wishlist", product);
//       setWishlisted(true);
//     }
//   };

//   // Manage cart
//   const handleAddToCart = () => {
//     setItem("cart", { _id: product._id, quantity: 1 });
//     setInCart(true); // Update the state to reflect the item is in the cart
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Image source={{ uri: product.images[0] }} style={styles.image} />
//       <View style={styles.infoContainer}>
//         <Text style={styles.price}>${product.price}</Text>
//         <Text style={styles.description}>{product.description}</Text>

//         {/* Add to Cart Button */}
//         <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
//           <Ionicons
//             name={inCart ? "cart" : "cart-outline"}
//             size={24}
//             color={inCart ? "green" : "black"}
//           />
//           <Text style={styles.cartButtonText}>
//             {inCart ? "Add One More" : "Add to Cart"}
//           </Text>
//         </TouchableOpacity>

//         {/* Wishlist Button */}
//         <TouchableOpacity
//           style={styles.wishlistButton}
//           onPress={() => handleWishlist(product)}
//         >
//           <Ionicons
//             name={wishlisted ? "heart" : "heart-outline"}
//             size={24}
//             color={wishlisted ? "red" : "black"}
//           />
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "#eee",
//   },
//   image: {
//     width: "100%",
//     aspectRatio: 1,
//   },
//   infoContainer: {
//     padding: 16,
//     backgroundColor: "#ddd",
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     marginTop: -20,
//   },
//   price: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#000",
//   },
//   description: {
//     fontSize: 14,
//     color: "#555",
//     marginVertical: 8,
//   },
//   cartButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f0f0f0",
//     padding: 10,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   wishlistButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     padding: 10,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   errorText: {
//     color: "red",
//     fontSize: 18,
//   },
// });

// export default ProductPage;
import React, { useState, useEffect, useRef } from "react";
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
  Animated,
  PanResponder,
  Dimensions,
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const route = useRoute();

  const scrollViewRef = useRef(null);
  const panResponder = useRef(null);
  const position = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get("window").width;

  const product = products.find((prod) => prod._id === productId);

  // Initialize PanResponder for swipe gestures
  useEffect(() => {
    if (product?.images) {
      panResponder.current = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          position.setOffset(position.__getValue());
          position.setValue(0);
        },
        onPanResponderMove: (_, { dx }) => {
          position.setValue(dx);
        },
        onPanResponderRelease: (_, { dx }) => {
          position.flattenOffset();
          const distance = Math.abs(dx);

          if (distance > 50) {
            // Minimum distance to trigger slide
            const direction = dx > 0 ? -1 : 1;
            const newIndex = Math.max(
              0,
              Math.min(currentImageIndex + direction, product.images.length - 1)
            );
            handleImageChange(newIndex);
          }

          // Reset position with animation
          Animated.spring(position, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
      });
    }
  }, [currentImageIndex, product]);

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

  useEffect(() => {
    const fetchWishlistAndCheck = async () => {
      const items = await getWishlist("wishlist");
      setWishlist(items);
      setWishlisted(await checkWishlist("wishlist", productId));
      setInCart(await checkCart("cart", productId));
    };
    fetchWishlistAndCheck();
  }, [productId, route.name]);

  // const product = products.find((prod) => prod._id === productId);

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * windowWidth,
      animated: true,
    });
  };

  const handleNext = () => {
    if (currentImageIndex < product.images.length - 1) {
      handleImageChange(currentImageIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentImageIndex > 0) {
      handleImageChange(currentImageIndex - 1);
    }
  };

  const handleWishlist = async (product) => {
    if (wishlisted) {
      await removeFromWishlist("wishlist", product._id);
      setWishlisted(false);
    } else {
      await addToWishlist("wishlist", product);
      setWishlisted(true);
    }
  };

  const handleAddToCart = () => {
    setItem("cart", { _id: product._id, quantity: 1 });
    setInCart(true);
  };

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Animated.View
          style={[
            styles.carouselContainer,
            {
              transform: [{ translateX: position }],
            },
          ]}
          {...panResponder.current?.panHandlers}
        >
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const contentOffset = e.nativeEvent.contentOffset;
              const index = Math.round(contentOffset.x / windowWidth);
              if (index !== currentImageIndex) {
                setCurrentImageIndex(index);
              }
            }}
          >
            {product.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={[styles.image, { width: windowWidth }]}
              />
            ))}
          </ScrollView>

          {/* Navigation Arrows */}
          {currentImageIndex > 0 && (
            <TouchableOpacity
              style={[styles.navButton, styles.leftButton]}
              onPress={handlePrevious}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          )}

          {currentImageIndex < product.images.length - 1 && (
            <TouchableOpacity
              style={[styles.navButton, styles.rightButton]}
              onPress={handleNext}
            >
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
          )}

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {product.images.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleImageChange(index)}
              >
                <View
                  style={[
                    styles.paginationDot,
                    currentImageIndex === index && styles.paginationDotActive,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.description}>{product.description}</Text>

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
  imageContainer: {
    position: "relative",
    // po
    height: 300,
    width: 300,
    // width: "50%",
  },
  carouselContainer: {
    // position: "relative",
  },
  image: {
    // aspectRatio: 1,
    width: 200,
    height: 200,
  },
  navButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -20 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  leftButton: {
    left: 10,
  },
  rightButton: {
    right: 10,
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  paginationDotActive: {
    backgroundColor: "white",
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
  cartButtonText: {
    marginLeft: 8,
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

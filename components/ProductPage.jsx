import React, { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Platform,
  Dimensions,
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useWishlist } from "./context/WishlistContext";
import {
  addToWishlist,
  removeFromWishlist,
  checkInWishlist,
} from "./context/Wishlist";
import { useProductContext } from "./context/ProductContext";
import { useCart } from "./context/CartContext";

const ProductPage = ({ productId }) => {
  const { wishlist, addToWishlist, removeFromWishlist, checkInWishlist } =
    useWishlist();
  const { products, loading, error } = useProductContext();
  const { cart, addToCart, existsInCart } = useCart();

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const scrollViewRef = useRef(null);
  const panResponder = useRef(null);
  const position = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get("window").width;
  const route = useRoute();

  const product = products.find((prod) => prod._id === productId);

  useEffect(() => {
    if (productId) {
      setInCart(existsInCart(productId));
      setWishlisted(checkInWishlist(productId));
      setLoadingProducts(false); // Set loading state to false after product is set
    }
  }, [productId, existsInCart, wishlist]);

  useEffect(() => {
    // Initialize PanResponder for swipe gestures
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
            const direction = dx > 0 ? -1 : 1;
            const newIndex = Math.max(
              0,
              Math.min(currentImageIndex + direction, product.images.length - 1)
            );
            handleImageChange(newIndex);
          }
          Animated.spring(position, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
      });
    }
  }, [currentImageIndex, product]);

  const handleAddToCart = () => {
    addToCart({ _id: productId });
  };

  const handleWishlist = (product) => {
    if (wishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({ _id: product._id });
    }
  };

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
    scrollViewRef.current?.scrollTo({ x: index * windowWidth, animated: true });
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

  // Error handling for product or network failure
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // If product is not found
  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Image Carousel Section */}
      <View style={styles.imageContainer}>
        <Animated.View
          style={[
            styles.carouselContainer,
            { transform: [{ translateX: position }] },
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

          {/* Wishlist Icon */}
          <TouchableOpacity
            style={styles.wishlistIcon}
            onPress={() => handleWishlist(product)}
          >
            <Ionicons
              name={wishlisted ? "heart" : "heart-outline"}
              size={28}
              color={wishlisted ? "#e74c3c" : "#fff"}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Product Details Section */}
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  imageContainer: {
    height: Dimensions.get("window").height * 0.5,
    backgroundColor: "#fff",
  },
  carouselContainer: {
    flex: 1,
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
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
    backgroundColor: "#fff",
    width: 24,
  },
  wishlistIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 10,
    padding: 5,
  },
  infoContainer: {
    padding: 24,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
    color: "#3498db",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
    marginBottom: 24,
  },
  cartButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3498db",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  cartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
  },
});

export default ProductPage;

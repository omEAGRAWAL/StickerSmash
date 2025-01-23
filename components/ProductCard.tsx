import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Animated,
  PanResponder,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Link } from "expo-router";

const ProductCard = ({ product }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const panResponder = useRef(null);
  const position = useRef(new Animated.Value(0)).current;

  // Auto-sliding functionality
  useEffect(() => {
    let autoScrollInterval;

    const startAutoScroll = () => {
      autoScrollInterval = setInterval(() => {
        const nextIndex = (activeIndex + 1) % product.images.length;
        handleDotPress(nextIndex);
      }, 3000); // Change slide every 3 seconds
    };

    const stopAutoScroll = () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
    };

    startAutoScroll();

    return () => stopAutoScroll();
  }, [activeIndex, product.images.length]);

  // Initialize PanResponder for gesture handling
  useEffect(() => {
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
            Math.min(activeIndex + direction, product.images.length - 1)
          );
          handleDotPress(newIndex);
        }
        // Reset position with animation
        Animated.spring(position, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    });
  }, [activeIndex, product.images.length]);

  const handleDotPress = (index) => {
    setActiveIndex(index);
    scrollViewRef.current?.scrollTo({
      x: 150 * index,
      animated: true,
    });
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / 150);
    setActiveIndex(index);
  };

  return (
    <Pressable>
      {({ pressed }) => (
        <View
          style={[
            styles.container,
            pressed && styles.pressedContainer, // Add pressed effect
          ]}
        >
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
              onScroll={handleScroll}
              scrollEventThrottle={16}
              style={styles.scrollView}
            >
              {product.images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: image }} style={styles.image} />
                  <View style={styles.imageOverlay} />
                </View>
              ))}
            </ScrollView>

            <View style={styles.pagination}>
              {product.images.map((_image, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.paginationDot,
                    activeIndex === index && styles.paginationDotActive,
                  ]}
                  onPress={() => handleDotPress(index)}
                />
              ))}
            </View>
          </Animated.View>

          <Link href={`/product/${product._id}`}>
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{product.name}</Text>
              <Text style={styles.price}>${product.price}</Text>
              {product.description && (
                <Text style={styles.description} numberOfLines={2}>
                  {product.description}
                </Text>
              )}
            </View>
          </Link>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: "center",
    overflow: "hidden",
  },
  pressedContainer: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  carouselContainer: {
    width: 160,
    height: 180,
  },
  scrollView: {
    width: 150,
    height: 160,
  },
  imageContainer: {
    position: "relative",
    width: 150,
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)", // Subtle overlay
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
  },
  paginationDotActive: {
    backgroundColor: "#333",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  infoContainer: {
    marginTop: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  price: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  description: {
    marginTop: 6,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 16,
  },
});

export default ProductCard;

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
    <View style={styles.container}>
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
            <Image key={index} source={{ uri: image }} style={styles.image} />
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
            <Text style={styles.description}>{product.description}</Text>
          )}
        </View>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
  },
  carouselContainer: {
    width: 150,
    height: 170, // Increased to accommodate pagination dots
  },
  scrollView: {
    width: 150,
    height: 150,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "cover",
    borderRadius: 10,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ccc",
  },
  paginationDotActive: {
    backgroundColor: "#333",
  },
  infoContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    color: "#333",
  },
  price: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    marginTop: 5,
    fontSize: 12,
    color: "#555",
    textAlign: "center",
  },
});

export default ProductCard;

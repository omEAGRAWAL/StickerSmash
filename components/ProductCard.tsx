import { StyleSheet, View, Text, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";


const ProductCard = ({ product }) => {
  return (
    // Use Link for navigation
    <Link href={`/product/${product._id}`} style={styles.container}>
      <Image source={{ uri: product.images[0] }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
        {product.description && (
          <Text style={styles.description}>{product.description}</Text>
        )}
      </View>
    </Link>
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
    alignItems: "center", // Center content in the card
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "cover",
    borderRadius: 10,
  },
  infoContainer: {
    marginTop: 10,
    alignItems: "center", // Center text content
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

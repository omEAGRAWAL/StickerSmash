import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, Button, FlatList, Image, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { Link } from "expo-router";// Replace with your store ID
import { fetchProducts } from "@/components/context/getProduct";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState("");

  // Fetch products from the API
  useEffect(() => {
    const fetchProductsFromAPI = async () => {
      try {
        const products = await fetchProducts();
        setProducts(products);
        setLoadingProducts(false);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProductsFromAPI();
  }, []);

  useEffect(() => {
    const loadCartFromAsyncStorage = async () => {
      const savedCart = await AsyncStorage.getItem("cart");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    };

    // Poll every 1 second to check for changes
    const intervalId = setInterval(() => {
      loadCartFromAsyncStorage();
    }, 2000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Load cart items on initial load
  useEffect(() => {
    const loadCart = async () => {
      if (Platform.OS === "web") {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } else {
        const savedCart = await AsyncStorage.getItem("cart");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      }
    };
    loadCart();
  }, []);

  // Remove item from cart
  const removeFromCart = (id) => {
    // const newCart = cartItems.filter((item) => item._id !== id);
    const newCart = cartItems.filter((item) => {
      if (item._id == id) {
        item.quantity = item.quantity - 1;
        if (item.quantity == 0) {
          return false;
        }
      }
      return true;
    });

    setCartItems(newCart);
    if (Platform.OS === "web") {
      localStorage.setItem("cart", JSON.stringify(newCart));
    } else {
      AsyncStorage.setItem("cart", JSON.stringify(newCart));
    }
  };

  // Match cart items with products to display correct data
  const cartProducts = cartItems.map((cartItem) => {
    const product = products.find((prod) => prod._id === cartItem._id);
    return {
      ...cartItem,
      ...product,
    };
  });

  return (
    <View style={styles.container}>
      {loadingProducts ? (
        <Text>Loading products...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : cartProducts.length === 0 ? (
        <Text>Your cart is empty!</Text>
      ) : (
        <FlatList
          data={cartProducts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Link href={`/product/${item._id}`}>
              <View style={styles.item}>
                <Image source={{ uri: item.images[0] }} style={styles.image} />
                <View style={styles.itemInfo}>
                  <Text>{item.name}</Text>
                  <Text>{item.description}</Text>
                  <Text>Price: ₹{item.price}</Text>
                  <Text>Quantity: {item.quantity}</Text>
                  <Button
                    title="Remove"
                    onPress={() => removeFromCart(item._id)} // Ensure you're passing the correct product id
                  />
                </View>
              </View>
            </Link>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
});

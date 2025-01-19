import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { useProductContext } from "@/components/context/ProductContext";
import { useCart } from "@/components/context/CartContext";
import { useState, useEffect, useCallback } from "react";
import { Link } from "expo-router";
import { fetchProducts } from "@/components/context/getProduct";
import { Placeorder } from "@/components/context/Cart";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  // const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  // const [error, setError] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  // const

  const [address, setAddress] = useState({
    name: "",
    mobile: "",
    pincode: "",
    city: "",
    area: "",
  });

  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  // Sync cart from context to local state
  useEffect(() => {
    setCartItems(cart);
  }, [cart]);

  // Fetch products
  const { products, categories, loading, error } = useProductContext();

  const validateAddress = () => {
    if (
      !address.name ||
      !address.mobile ||
      !address.pincode ||
      !address.city ||
      !address.area
    ) {
      alert("Please fill in all required address fields.");
      return false;
    }
    if (!/^\d{10}$/.test(address.mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return false;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      alert("Please enter a valid 6-digit pincode.");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (validateAddress()) {
      try {
        if (Platform.OS === "web") {
          localStorage.setItem("address", JSON.stringify(address));
        } else {
          await AsyncStorage.setItem("address", JSON.stringify(address));
        }
        const result = await Placeorder(address);
        if (result) {
          clearCart(); // Clear cart globally after successful order
          setCartItems([]); // Clear local cart items
        }
        return result;
      } catch (err) {
        console.error("Error placing order:", err);
        alert("Failed to place order. Please try again.");
      }
    }
  };

  const cartProducts = cartItems.map((cartItem) => {
    const product = products.find((prod) => prod._id === cartItem._id);
    return { ...cartItem, ...product };
  });

  const renderProduct = ({ item }) => (
    <View style={styles.card}>
      <Link href={`/product/${item._id}`} style={styles.productLink}>
        <View style={styles.item}>
          <Image source={{ uri: item.images[0] }} style={styles.image} />
          <View style={styles.itemInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.price}>₹{item.price}</Text>
            <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
          </View>
        </View>
      </Link>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCart(item._id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>
      {loadingProducts ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : cartItems.length == 0 ? (
        <Text>Your cart is empty!</Text>
      ) : (
        <>
          <FlatList
            data={cartProducts}
            keyExtractor={(item) => item._id}
            renderItem={renderProduct}
          />
          <TouchableOpacity
            style={styles.toggleAddress}
            onPress={() => setShowAddressForm(!showAddressForm)}
          >
            <Text style={styles.buttonText}>
              {showAddressForm ? "Hide Address Form" : "Enter Delivery Address"}
            </Text>
          </TouchableOpacity>
          {showAddressForm && (
            <View>
              {["name", "mobile", "pincode", "city", "area"].map((field) => (
                <TextInput
                  key={field}
                  style={styles.input}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={address[field]}
                  onChangeText={(text) =>
                    setAddress((prev) => ({ ...prev, [field]: text }))
                  }
                />
              ))}
            </View>
          )}
          <TouchableOpacity
            style={styles.orderButton}
            onPress={handlePlaceOrder}
          >
            <Text style={styles.buttonText}>Place Order</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  error: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  productLink: {
    textDecorationLine: "none",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  quantity: {
    fontSize: 14,
    color: "#333",
    marginVertical: 5,
  },
  removeButton: {
    backgroundColor: "#e63946",
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  removeButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
  toggleAddress: {
    backgroundColor: "#189",
    padding: 10,
    borderRadius: 5,
    marginVertical: 15,
    alignItems: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  orderButton: {
    backgroundColor: "#457b1d",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
});

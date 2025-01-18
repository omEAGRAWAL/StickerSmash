import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  Button,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { Link } from "expo-router";
import { fetchProducts } from "@/components/context/getProduct";
import { Placeorder } from "@/components/context/Cart";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState("");
  const [address, setAddress] = useState({
    name: "",
    mobile: "",
    pincode: "",
    city: "",
    area: "",
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Fetch products
  useEffect(() => {
    const fetchProductsFromAPI = async () => {
      try {
        const products = await fetchProducts();
        setProducts(products);
        setLoadingProducts(false);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again.");
      }
    };
    fetchProductsFromAPI();
  }, []);

  // Load cart and address from storage
  useEffect(() => {
    const loadCartAndAddress = async () => {
      try {
        const savedCart =
          Platform.OS === "web"
            ? JSON.parse(localStorage.getItem("cart") || "[]")
            : JSON.parse((await AsyncStorage.getItem("cart")) || "[]");
        const savedAddress =
          Platform.OS === "web"
            ? JSON.parse(localStorage.getItem("address") || "{}")
            : JSON.parse((await AsyncStorage.getItem("address")) || "{}");

        setCartItems(savedCart);
        setAddress(savedAddress);
      } catch (err) {
        console.error("Error loading cart or address:", err);
      }
    };
    loadCartAndAddress();
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cartItems.reduce((result, item) => {
      if (item._id === id) {
        item.quantity--;
        if (item.quantity > 0) result.push(item);
      } else {
        result.push(item);
      }
      return result;
    }, []);

    setCartItems(updatedCart);

    if (Platform.OS === "web") {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const validateAddress = () => {
    if (
      !address.name ||
      !address.mobile ||
      !address.pincode ||
      !address.city ||
      !address.area
    ) {
      setError("Please fill in all required address fields.");
      return false;
    }
    if (!/^\d{10}$/.test(address.mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return false;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return false;
    }
    setError("");
    return true;
  };

  const handlePlaceOrder = () => {
    if (validateAddress()) {
      if (Platform.OS === "web") {
        localStorage.setItem("address", JSON.stringify(address));
      } else {
        AsyncStorage.setItem("address", JSON.stringify(address));
      }
      Placeorder(address);
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
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeFromCart(item._id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Link>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>
      {loadingProducts ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : cartProducts.length === 0 ? (
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
            <Text>
              {showAddressForm ? "Hide Address Form" : "Enter Delivery Address"}
            </Text>
          </TouchableOpacity>
          {showAddressForm && (
            <View>
              {["name", "mobile", "pincode", "city", "area"].map((field) => (
                <TextInput
                  key={field}
                  style={styles.input}
                  placeholder={field}
                  value={address[field]}
                  onChangeText={(text) =>
                    setAddress({ ...address, [field]: text })
                  }
                />
              ))}
            </View>
          )}
          <TouchableOpacity
            style={styles.orderButton}
            onPress={handlePlaceOrder}
          >
            <Text>Place Order</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
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
  message: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
  },
  errorMessage: {
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
  toggleButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  formContainer: {
    marginVertical: 20,
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  input: {
    backgroundColor: "#aaa",
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
  placeOrderButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

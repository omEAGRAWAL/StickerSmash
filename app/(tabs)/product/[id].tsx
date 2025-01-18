import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import ProductPage from "@/components/ProductPage";  // Importing ProductPage component

const ProductDetails = () => {
  const { id } = useLocalSearchParams(); // Destructure 'id' from params

  

  if (!id) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Product ID not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProductPage productId={id} />

      
       {/* Pass the ID to ProductPage */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  error: {
    color: "red",
    fontSize: 18,
  },
});

export default ProductDetails;

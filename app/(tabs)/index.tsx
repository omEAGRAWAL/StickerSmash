// import React, { useState, useEffect } from "react";
// import {
//   View,
//   StyleSheet,
//   FlatList,
//   Text,
//   ActivityIndicator,
// } from "react-native";
// import ProductCard from "@/components/ProductCard";
// import CategoryList from "@/components/CategoryList";
// import WhatsAppChatWidget from "@/components/Whatsapp";
// import { useProductContext } from "@/components/context/ProductContext";

// export default function Index() {
//   const { products, categories, loadingCategories, loadingProducts } =
//     useProductContext();

//   const renderProductCard = ({ item }) => <ProductCard product={item} />;

//   return (
//     <View style={styles.container}>
//       <WhatsAppChatWidget
//         phoneNumber="917609098787"
//         backgroundColor="#00e785"
//         brandName="Om Fancy"
//         welcomeText="Hi there"
//         position="right"
//       />
//       {/* <Text style={styles.header}>Om Fancy</Text> */}

//       {loadingCategories ? (
//         <ActivityIndicator size="large" color="#700" />
//       ) : categories.length > 0 ? (
//         <CategoryList categories={categories} />
//       ) : (
//         <Text style={styles.emptyText}>No categories available</Text>
//       )}

//       {loadingProducts ? (
//         <ActivityIndicator
//           size="large"
//           color="#700"
//           style={{ marginTop: 20 }}
//         />
//       ) : products.length > 0 ? (
//         <FlatList
//           data={products}
//           renderItem={({ item }) => <ProductCard product={item} />}
//           keyExtractor={(item) => item._id}
//           numColumns={2} // Two columns
//           contentContainerStyle={{ paddingHorizontal: 10 }}
//           columnWrapperStyle={{
//             justifyContent: "space-between",
//             marginBottom: 15,
//           }}
//         />
//       ) : (
//         <Text style={styles.emptyText}>No products available</Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 20,
//     backgroundColor: "#fff",
//     width: "100%",
//   },
//   header: {
//     color: "#700",
//     textAlign: "left",
//     padding: 20,
//     fontSize: 25,
//   },
//   list: {
//     paddingHorizontal: 10,
//   },
//   emptyText: {
//     color: "#700",
//     textAlign: "center",
//     marginTop: 20,
//     fontSize: 16,
//   },
// });

// //can we export the product

// export const product: any = {};

import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import ProductCard from "@/components/ProductCard";
import CategoryList from "@/components/CategoryList";
import WhatsAppChatWidget from "@/components/Whatsapp";
import { useProductContext } from "@/components/context/ProductContext";

const { width } = Dimensions.get("window");

export default function Index() {
  const { products, categories, loadingCategories, loadingProducts } =
    useProductContext();

  const renderProductCard = ({ item }: { item: any }) => <ProductCard product={item} />;

  return (
    <View style={styles.container}>
      <WhatsAppChatWidget
        phoneNumber="917609098787"
        backgroundColor="#00e785"
        brandName="Om Fancy"
        welcomeText="Hi there"
        position="right"
      />

      {loadingCategories ? (
        <ActivityIndicator size="large" color="#700" />
      ) : categories.length > 0 ? (
        <CategoryList categories={categories} />
      ) : (
        <Text style={styles.emptyText}>No categories available</Text>
      )}

      {loadingProducts ? (
        <ActivityIndicator
          size="large"
          color="#700"
          style={{ marginTop: 20 }}
        />
      ) : products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={renderProductCard}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.flatListContent}
          columnWrapperStyle={styles.columnWrapper}
        />
      ) : (
        <Text style={styles.emptyText}>No products available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  emptyText: {
    color: "#700",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

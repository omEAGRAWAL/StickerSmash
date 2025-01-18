import React from "react";
import { Tabs } from "expo-router";
import SearchHeader from "@/components/SearchHeader";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarStyle: {
          backgroundColor: "#ddd",
          justifyContent: "space-around", // Ensures spacing
        },
        tabBarItemStyle: {
          flex: 1, // Ensures each item takes up equal space
        },
        headerTitle: () => <SearchHeader />, // Use the SearchHeader component
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      {/* Cart */}
      <Tabs.Screen
        name="Cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "cart-sharp" : "cart-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />

      {/* Wishlist */}
      <Tabs.Screen
        name="Wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "heart-sharp" : "heart-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />

      {/* Hide search/[id] */}
      <Tabs.Screen
        name="search/[id]"
        options={{
          href: null, // Hide tab button
        }}
      />

      <Tabs.Screen
        name="product/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

{
  /* <Stack screenOptions={{
  headerTitle: () => <SearchHeader />,
  
  headerStyle: {
    backgroundColor: '#eee',
    
  },
  headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
}}>
</Stack> */
}

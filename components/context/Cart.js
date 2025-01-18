import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function setItem(key, value) {
  if (Platform.OS === "web") {
    // For web: Use localStorage
    let cart = localStorage.getItem(key);
    if (cart) {
      cart = JSON.parse(cart);

      // Check if the item already exists
      const itemIndex = cart.findIndex((item) => item._id === value._id);
      if (itemIndex > -1) {
        cart[itemIndex].quantity += 1; // Update quantity
      } else {
        cart.push({ ...value, quantity: 1 }); // Add new item with quantity 1
      }

      localStorage.setItem(key, JSON.stringify(cart));
    } else {
      // Initialize cart with the new item
      localStorage.setItem(key, JSON.stringify([{ ...value, quantity: 1 }]));
    }
  } else {
    // For mobile: Use AsyncStorage
    let cart = await AsyncStorage.getItem(key);
    if (cart) {
      cart = JSON.parse(cart);

      // Check if the item already exists
      const itemIndex = cart.findIndex((item) => item._id === value._id);
      if (itemIndex > -1) {
        cart[itemIndex].quantity += 1; // Update quantity
      } else {
        cart.push({ ...value, quantity: 1 }); // Add new item with quantity 1
      }

      await AsyncStorage.setItem(key, JSON.stringify(cart));
    } else {
      // Initialize cart with the new item
      await AsyncStorage.setItem(
        key,
        JSON.stringify([{ ...value, quantity: 1 }])
      );
    }
  }
}

//check product is there in cart or not

export async function checkCart(key, id) {
  if (Platform.OS === "web") {
    // For web: Use localStorage
    let cart = localStorage.getItem(key);
    if (cart) {
      cart = JSON.parse(cart);

      // Check if the item already exists
      const exists = cart.some((item) => item._id === id);
      return exists;
    }
  } else {
    // For mobile: Use AsyncStorage
    let cart = await AsyncStorage.getItem(key);
    if (cart) {
      cart = JSON.parse(cart);

      // Check if the item already exists
      const exists = cart.some((item) => item._id === id);
      return exists;
    }
  }

  return false;
}

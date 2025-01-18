import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Set address in localStorage (web) or AsyncStorage (mobile)
export async function setAddress(key, value) {
  try {
    if (Platform.OS === "web") {
      // For web: use localStorage
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      // For mobile: use AsyncStorage
      await AsyncStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error("Failed to set address:", error);
    throw new Error("Failed to set address.");
  }
}

// Get address from localStorage (web) or AsyncStorage (mobile)
export async function getAddress(key) {
  try {
    if (Platform.OS === "web") {
      // For web: use localStorage
      const address = localStorage.getItem(key);
      return JSON.parse(address);
    } else {
      // For mobile: use AsyncStorage
      const address = await AsyncStorage.getItem(key);
      return JSON.parse(address);
    }
  } catch (error) {
    console.error("Failed to get address:", error);
    throw new Error("Failed to get address.");
  }
}

// Delete address from localStorage (web) or AsyncStorage (mobile)
export async function deleteAddress(key) {
  try {
    if (Platform.OS === "web") {
      // For web: use localStorage
      localStorage.removeItem(key);
    } else {
      // For mobile: use AsyncStorage
      await AsyncStorage.removeItem(key);
    }
  } catch (error) {
    console.error("Failed to delete address:", error);
    throw new Error("Failed to delete address.");
  }
}

// Update address in localStorage (web) or AsyncStorage (mobile)
export async function updateAddress(key, value) {
  try {
    if (Platform.OS === "web") {
      // For web: use localStorage
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      // For mobile: use AsyncStorage
      await AsyncStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error("Failed to update address:", error);
    throw new Error("Failed to update address.");
  }
}

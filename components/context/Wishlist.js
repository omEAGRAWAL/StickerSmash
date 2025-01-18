import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Adds an item to the wishlist.
 * If the item already exists in the wishlist, it will not add it again.
 * @param {string} key - The key for storing the wishlist ("wishlist").
 * @param {object} value - The item to be added.
 */
export async function addToWishlist(key, value) {
  if (Platform.OS === "web") {
    // For web: Use localStorage
    let wishlist = localStorage.getItem(key);
    if (wishlist) {
      wishlist = JSON.parse(wishlist);

      // Check if the item already exists
      const exists = wishlist.some((item) => item._id === value._id);
      if (!exists) {
        wishlist.push(value); // Add new item
        localStorage.setItem(key, JSON.stringify(wishlist));
      }
    } else {
      // Initialize wishlist with the new item
      localStorage.setItem(key, JSON.stringify([value]));
    }
  } else {
    // For mobile: Use AsyncStorage
    let wishlist = await AsyncStorage.getItem(key);
    if (wishlist) {
      wishlist = JSON.parse(wishlist);

      // Check if the item already exists
      const exists = wishlist.some((item) => item._id === value._id);
      if (!exists) {
        wishlist.push(value); // Add new item
        await AsyncStorage.setItem(key, JSON.stringify(wishlist));
      }
    } else {
      // Initialize wishlist with the new item
      await AsyncStorage.setItem(key, JSON.stringify([value]));
    }
  }
}

/**
 * Removes an item from the wishlist.
 * @param {string} key - The key for the wishlist ("wishlist").
 * @param {string} id - The ID of the item to be removed.
 */
export async function removeFromWishlist(key, id) {
  if (Platform.OS === "web") {
    // For web: Use localStorage
    let wishlist = localStorage.getItem(key);
    if (wishlist) {
      wishlist = JSON.parse(wishlist);

      // Filter out the item with the specified ID
      wishlist = wishlist.filter((item) => item._id !== id);

      localStorage.setItem(key, JSON.stringify(wishlist));
    }
  } else {
    // For mobile: Use AsyncStorage
    let wishlist = await AsyncStorage.getItem(key);
    if (wishlist) {
      wishlist = JSON.parse(wishlist);

      // Filter out the item with the specified ID
      wishlist = wishlist.filter((item) => item._id !== id);

      await AsyncStorage.setItem(key, JSON.stringify(wishlist));
    }
  }
}

/**
 * Retrieves the wishlist items.
 * @param {string} key - The key for the wishlist ("wishlist").
 * @returns {Promise<Array>} - The list of wishlist items.
 */
export async function getWishlist(key) {
  if (Platform.OS === "web") {
    // For web: Use localStorage
    const wishlist = localStorage.getItem(key);
    return wishlist ? JSON.parse(wishlist) : [];
  } else {
    // For mobile: Use AsyncStorage
    const wishlist = await AsyncStorage.getItem(key);
    return wishlist ? JSON.parse(wishlist) : [];
  }
}

//check id is there in wishlist or not
export async function checkWishlist(key, id) {
  if (Platform.OS === "web") {
    // For web: Use localStorage
    const wishlist = localStorage.getItem(key);
    if (wishlist) {
      const data = JSON.parse(wishlist);
      return data.some((item) => item._id === id);//return true if id is there in wishlist else false
    }
  } else {
    // For mobile: Use AsyncStorage
    const wishlist = await AsyncStorage.getItem(key);
    if (wishlist) {
      const data = JSON.parse(wishlist);
      return data.some((item) => item._id === id);
    }
  }
  return false;
}

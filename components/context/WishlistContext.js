import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create Context
const WishlistContext = createContext();

// Initial State
const initialState = {
  wishlist: [],
};

// Reducer
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case "SET_WISHLIST":
      return { ...state, wishlist: action.payload };
    case "ADD_TO_WISHLIST":
      // Check if the item already exists
      const exists = state.wishlist.some(
        (item) => item._id === action.payload._id
      );
      if (exists) return state; // No duplicate additions
      return { ...state, wishlist: [...state.wishlist, action.payload] };
    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        wishlist: state.wishlist.filter((item) => item._id !== action.payload),
      };
    case "CLEAR_WISHLIST":
      return { ...state, wishlist: [] };
    default:
      return state;
  }
};

// Provider Component
export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from AsyncStorage on app load
  useEffect(() => {
    const loadWishlist = async () => {
      const storedWishlist = await AsyncStorage.getItem("wishlist");
      if (storedWishlist) {
        dispatch({ type: "SET_WISHLIST", payload: JSON.parse(storedWishlist) });
      }
    };
    loadWishlist();
  }, []);

  // Save wishlist to AsyncStorage whenever it changes
  useEffect(() => {
    AsyncStorage.setItem("wishlist", JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  // Context Functions
  const addToWishlist = (item) =>
    dispatch({ type: "ADD_TO_WISHLIST", payload: item });
  const removeFromWishlist = (id) =>
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: id });
  const clearWishlist = () => dispatch({ type: "CLEAR_WISHLIST" });
  const checkInWishlist = (id) =>
    state.wishlist.some((item) => item._id === id);

  return (
    <WishlistContext.Provider
      value={{
        wishlist: state.wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        checkInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// Custom Hook
export const useWishlist = () => useContext(WishlistContext);

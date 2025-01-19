import React, { createContext, useContext, useEffect, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext();

const initialState = {
  cart: [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return { ...state, cart: action.payload };
    case "ADD_TO_CART":
      const existingItem = state.cart.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item._id !== action.payload),
      };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const loadCart = async () => {
      const storedCart = await AsyncStorage.getItem("cart");
      if (storedCart) {
        dispatch({ type: "SET_CART", payload: JSON.parse(storedCart) });
      }
    };
    loadCart();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  const addToCart = (item) => dispatch({ type: "ADD_TO_CART", payload: item });
  const removeFromCart = (id) =>
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const existsInCart = (id) => state.cart.some((item) => item._id === id);

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        addToCart,
        removeFromCart,
        clearCart,
        existsInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

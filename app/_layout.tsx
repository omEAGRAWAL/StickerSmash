import { Stack } from "expo-router";
import { CartProvider } from "@/components/context/CartContext";
import { ProductProvider } from "@/components/context/ProductContext";
import { WishlistProvider } from "@/components/context/WishlistContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <ProductProvider>
        <WishlistProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </WishlistProvider>
      </ProductProvider>
    </CartProvider>
  );
}

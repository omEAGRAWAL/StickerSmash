import { Platform, Linking } from "react-native";
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

export async function Placeorder(address) {
  console.log("Placeorder called");
  console.log("Address:", address);
  //{name: 'om agrawal', mobile: '7609098787', pincode: '609609', city: 'karaikal', area: 'dwq', …}
  try {
    if (Platform.OS === "web") {
      let cart = localStorage.getItem("cart");
      if (cart) {
        cart = JSON.parse(cart);

        // Create message without URL encoding first
        let message = "New Order\n"; // Plain text first
        message += "-------------------------\n\n";

        cart.forEach((item, index) => {
          message += `Item ${index + 1}\n`;
          message += `Product Link: https://www.omagr.me/product/${item._id}\n`;
          message += `Quantity: ${item.quantity}\n`;
          message += "-------------------------\n";
        });

        message += "\nPlease confirm my order";

        message += "-------------------------------\n\n";
        //{name: 'om agrawal', mobile: '7609098787', pincode: '609609', city: 'karaikal', area: 'dwq', …}
        message += "Address\n\n";
        message += "Name:  " + address.name + "\n";
        message += "Mobile" + address.mobile + "\n";
        message += "City: " + address.city + "\n";
        message += "Area: " + address.area + "\n";
        message += "Pincode: " + address.pincode + "\n";

        // message += address.stringify();
        // Encode the entire message at once
        const encodedMessage = encodeURIComponent(message);

        // Open WhatsApp with the properly encoded message
        window.open(`https://wa.me/917609098787?text=${encodedMessage}`);
      }
    } else {
      // Mobile implementation
      let cart = await AsyncStorage.getItem("cart");
      if (cart) {
        cart = JSON.parse(cart);

        let message = "New Order\n";
        message += "-------------------------\n\n";

        cart.forEach((item, index) => {
          message += `Item ${index + 1}\n`;
          message += `Product Link: https://www.omagr.me/product/${item._id}\n`;
          message += `Quantity: ${item.quantity}\n`;
          message += "-------------------------\n";
        });

        message += "\nPlease confirm my order";
        // message += { address };
        message += "Address\n\n";
        message += "Name:  " + address.name + "\n";
        message += "Mobile" + address.mobile + "\n";
        message += "City: " + address.city + "\n";
        message += "Area: " + address.area + "\n";
        message += "Pincode: " + address.pincode + "\n";

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `whatsapp://send?phone=917609098787&text=${encodedMessage}`;

        Linking.canOpenURL(whatsappUrl)
          .then((supported) => {
            if (supported) {
              return Linking.openURL(whatsappUrl);
            } else {
              // Fallback to web WhatsApp if app is not installed
              return Linking.openURL(whatsappUrl);
            }
          })
          .catch((err) => console.error("An error occurred", err));

        // const supported = await Linking.canOpenURL(whatsappUrl);
        // if (supported) {
        //   await Linking.openURL(whatsappUrl);
        // } else {
        //   await Linking.openURL(
        //     `https://wa.me/917609098787?text=${encodedMessage}`
        //   );
        // }

        await AsyncStorage.removeItem("cart");
      }
    }
    return true;
  } catch (error) {
    console.error("Error in Placeorder:", error);
    return false;
  }
}

import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Linking,
  Image,
  StyleSheet,
} from "react-native";
import { WebView } from "react-native-webview";

const WhatsAppChatWidget = ({
  backgroundColor = "#00e785",
  brandName = "Om Fancy",
  welcomeText = "Hi there!\nHow can I help you?",
  phoneNumber = "917609098787",
  position = "right",
}) => {
  const handlePress = () => {
    // Format the welcome text for WhatsApp URL
    const message = encodeURIComponent(welcomeText);
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${message}`;

    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          // Fallback to web WhatsApp if app is not installed
          return Linking.openURL(
            `https://wa.me/${phoneNumber}?text=${message}`
          );
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  return (
    <View
      style={[
        styles.container,
        position === "right" ? styles.rightPosition : styles.leftPosition,
      ]}
    >
      <TouchableOpacity
        style={[styles.button, { backgroundColor }]}
        onPress={handlePress}
      >
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
          }}
          style={styles.icon}
        />
        <Text style={styles.text}>Chat with us</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    zIndex: 1000,
  },
  rightPosition: {
    right: 20,
  },
  leftPosition: {
    left: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default WhatsAppChatWidget;

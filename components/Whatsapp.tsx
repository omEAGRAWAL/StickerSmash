import React, { memo } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Linking,
  Image,
  StyleSheet,
  Platform,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useState, useCallback } from "react";

const WHATSAPP_LOGO = require("./whatsapp-logo.jpg"); // It's better to include the image locally

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IS_SMALL_DEVICE = SCREEN_WIDTH < 375;

const WhatsAppButton = memo(({ onPress, backgroundColor, isLoading }) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor }]}
    onPress={onPress}
    activeOpacity={0.7}
    disabled={isLoading}
  >
    {isLoading ? (
      <ActivityIndicator color="#FFFFFF" size="small" />
    ) : (
      <>
        <Image
          source={WHATSAPP_LOGO}
          style={styles.icon}
          defaultSource={WHATSAPP_LOGO}
        />
        <Text style={styles.text}>Chat with us</Text>
      </>
    )}
  </TouchableOpacity>
));

const WhatsAppChatWidget = ({
  backgroundColor = "#25D366", // Updated to official WhatsApp color
  brandName = "Om Fancy",
  welcomeText = "Hi there!\nHow can I help you?",
  phoneNumber = "917609098787",
  position = "right",
  bottomOffset = 20,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = useCallback(async () => {
    try {
      setIsLoading(true);
      const message = encodeURIComponent(welcomeText);
      const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${message}`;

      const canOpen = await Linking.canOpenURL(whatsappUrl);

      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        // Fallback to web WhatsApp
        await Linking.openURL(`https://wa.me/${phoneNumber}?text=${message}`);
      }
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
      // You could show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  }, [phoneNumber, welcomeText]);

  return (
    <View
      style={[
        styles.container,
        position === "right" ? styles.rightPosition : styles.leftPosition,
        { bottom: bottomOffset },
      ]}
    >
      <WhatsAppButton
        onPress={handlePress}
        backgroundColor={backgroundColor}
        isLoading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1000,
    ...Platform.select({
      ios: {
        // iOS-specific shadow
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        // Android-specific elevation
        elevation: 5,
      },
    }),
  },
  rightPosition: {
    right: IS_SMALL_DEVICE ? 12 : 20,
  },
  leftPosition: {
    left: IS_SMALL_DEVICE ? 12 : 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: IS_SMALL_DEVICE ? 12 : 16,
    paddingVertical: IS_SMALL_DEVICE ? 8 : 12,
    borderRadius: 25,
    minWidth: IS_SMALL_DEVICE ? 120 : 140,
    height: IS_SMALL_DEVICE ? 40 : 48,
  },
  icon: {
    width: IS_SMALL_DEVICE ? 20 : 24,
    height: IS_SMALL_DEVICE ? 20 : 24,
    marginRight: 8,
    resizeMode: "contain",
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: IS_SMALL_DEVICE ? 13 : 15,
    textAlign: "center",
  },
});

export default memo(WhatsAppChatWidget);

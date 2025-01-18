import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Link } from "expo-router";
import { useDebouncedCallback } from "use-debounce";

const SearchHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Debounced function to reduce API calls while typing
  const debouncedSearch = useDebouncedCallback((query) => {
    if (query.trim()) {
      router.push(`/search/${query.trim()}`);
    }
  }, 500);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/search/${searchQuery.trim()}`);
    }
  };

  return (
    <View style={styles.headerContainer}>
      {/* Title */}
      <Link href={"/"}>
        <Text style={styles.title}>Om Fancy</Text>
      </Link>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            debouncedSearch(text);
          }}
          onSubmitEditing={handleSearchSubmit} // Trigger search on Enter
          returnKeyType="search" // Show 'search' button on keyboard
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle-outline" size={20} color="#888" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleSearchSubmit}>
          <Ionicons name="search" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#fff", // Optional header background
    width: "100%",
    //should not exceed frame
    // maxWidth:Window.innerWidth,
    // width: Dimensions.get("window").width,
    height: 60, // Adjust as per design requirements
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007AFF",
    textTransform: "uppercase",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 10,
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
    height: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // For Android
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
});

export default SearchHeader;

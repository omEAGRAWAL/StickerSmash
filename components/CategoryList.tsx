// import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
// import { useNavigation } from '@react-navigation/native';
// import { router } from 'expo-router/build/Route';
import { router } from "expo-router";

type Category = {
  _id: string;
  Image: string;
  name: string;
  description: string;
};

type Props = {
  categories: Category[];
};

export default function CategoryList({ categories }: Props) {
  // const navigation = useNavigation();

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => router.push(`/search/${item.name}`)}
    >
      <Image source={{ uri: item.Image }} style={styles.categoryImage} />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        horizontal
        keyExtractor={(item) => item._id}
        renderItem={renderCategoryItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
  },
  categoryItem: {
    width: 80,
    marginHorizontal: 6,
    alignItems: "center",
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
});

import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';


const Header = () => {
  return (
    <View style={styles.header}>
        <View>
          <Text style={styles.brandName}>FABCURATE</Text>
          <Text style={styles.tagline}>CURATE YOUR OWN FABRIC</Text>
        </View>

      <View style={styles.iconContainer}>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.cartContainer}>
          <Ionicons name="bag-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  brandName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7a7d50",
  },
  tagline: {
    fontSize: 12,
    color: "#777",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartContainer: {
    marginLeft: 20,
  },
  
});

export default Header;

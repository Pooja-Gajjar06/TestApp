import { Text, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import BackHeader from "./components/BackHeader";
import { useEffect, useState } from "react";
import { getApi } from "../src/services/apiServices";
import Ionicons from 'react-native-vector-icons/Ionicons';

const CategoryScreen = () => {

  const [categoriesData, setCategoriesData] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchCategories()
  }, []);


  const fetchCategories = async () => {
    try {
      const data = await getApi("category_repository.json");
      setCategoriesData(data?.categories)
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (categoryId) => {
    setExpandedCategories((prevExpanded) =>
      prevExpanded.includes(categoryId)
        ? prevExpanded.filter((id) => id !== categoryId)
        : [...prevExpanded, categoryId]
    );
  };

  const renderCategory = ({ item }) => {
    const isExpanded = expandedCategories.includes(item.category_id);

    return (
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={styles.categoryHeader}
          onPress={() => toggleExpand(item.category_id)}
        >
          <Text style={styles.categoryName}>{item.category_name}</Text>
          {isExpanded ?
            <Ionicons name="arrow-up" size={24} color="#333" />
            :
            <Ionicons name="arrow-down" size={24} color="#333" />

          }
        </TouchableOpacity>
        {isExpanded && item.child && (
          <View style={styles.childList}>
            {item.child.map((childItem) => (
              <Text key={childItem.category_id} style={styles.childName}>
                {childItem.category_name}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (


    <View style={styles.screen}>
      <BackHeader />

      <FlatList
        data={categoriesData}
        keyExtractor={(item) => item.category_id}
        style={{marginTop:10}}
        renderItem={renderCategory}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff'
  },
  text: {
    fontSize: 18,
  },
  categoryContainer: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 12,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  childList: {
    paddingLeft: 16,
    marginTop: 8,
  },
  childName: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
});

export default CategoryScreen;
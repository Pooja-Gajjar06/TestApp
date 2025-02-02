import { Text, View, StyleSheet, FlatList, TouchableOpacity,ActivityIndicator } from "react-native";
import BackHeader from "../components/BackHeader";
import { useEffect, useState } from "react";
import { getApi } from "../services/apiServices";
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from "../constants/colors";

const CategoryScreen = () => {

  const [categoriesData, setCategoriesData] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
  }, []);


  const fetchCategories = async () => {
    try {
      const data = await getApi("category_repository.json");
      setCategoriesData(data?.categories)
    } catch (err) {
      console.log("error", err.message)
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
      {loading ?
        <ActivityIndicator size="large" color={colors.indicator} />
        :
        <>
          <BackHeader />

          <FlatList
            data={categoriesData}
            keyExtractor={(item) => item.category_id}
            style={{ marginTop: 10 }}
            renderItem={renderCategory}
          />
        </>
      }
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white
  },
  text: {
    fontSize: 18,
  },
  categoryContainer: {
    marginBottom: 16,
    backgroundColor: colors.background,
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
    color: colors.sectionText,
  },
  childList: {
    paddingLeft: 16,
    marginTop: 8,
  },
  childName: {
    fontSize: 16,
    color: colors.childName,
    marginBottom: 6,
  },
});

export default CategoryScreen;
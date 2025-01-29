import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, Dimensions, Animated, ActivityIndicator } from "react-native";
import Header from "./components/Header";
import { useEffect, useRef, useState } from "react";
import { getApi } from "../src/services/apiServices";

const { width } = Dimensions.get("window");

const ITEM_WIDTH = width * 0.6;
const ITEM_SPACING = (width - ITEM_WIDTH) / 3.5;

const HomeScreen = () => {
  const [data, setData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [fabricData, setFabricData] = useState([]);
  const [unStichedData, setUnStichedData] = useState([]);
  const [boutiqueCollectionData, setBoutiqueCollectionData] = useState([]);
  const [rangePattern, setRangePattern] = useState([]);
  const [designOccasion, setDesignOccasion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollXY = useRef(new Animated.Value(0)).current; 

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollXY } } }],
    { useNativeDriver: false }
  );

  useEffect(() => {
    fetchRepositories();
    fetchCategories()
    fetchRangePattern()
  }, []);

  const fetchRepositories = async () => {

    try {
      const data = await getApi("top_repository.json");
      console.log("data of fetch-----", data?.main_sticky_menu);

      setData(data?.main_sticky_menu);
      if (data?.main_sticky_menu?.length > 0) {
        setSelectedMenu(data?.main_sticky_menu[0]);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getApi("middle_repository.json");
      console.log("middle of fetch-----", data?.shop_by_category);
      setCategoriesData(data?.shop_by_category)
      setFabricData(data?.shop_by_fabric)
      setUnStichedData(data?.Unstitched)
      setBoutiqueCollectionData(data?.boutique_collection)
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchRangePattern = async () => {
    try {
      const data = await getApi("bottom_repository.json");
      console.log("bottom of fetch-----", data?.range_of_pattern);
      setRangePattern(data?.range_of_pattern)
      setDesignOccasion(data?.design_occasion)

    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };


  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {loading ?
        <ActivityIndicator size="large" color="#0000ff" />
        :
        <>
          <Header />

          <FlatList
            data={data}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.title}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.menuItem, selectedMenu?.title === item.title && styles.selectedMenuItem]}
                onPress={() => setSelectedMenu(item)}
              >
                <Image source={{ uri: item.image }} style={styles.menuImage} />
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
          {selectedMenu && (
            <FlatList
              data={selectedMenu.slider_images}
              keyExtractor={(item) => item.title}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.sliderContainer}>
                  <Image source={{ uri: item.image }} style={styles.sliderImage} />
                  <View style={styles.sliderTextContainer}>
                    <Text style={styles.sliderTitle}>{item.title}</Text>
                    <TouchableOpacity>
                      <Text style={styles.sliderCTA}>{item.cta}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}



          <Text style={{ padding: 10, fontSize: 18, color: '#7a7d50' }}>Shop By Category</Text>
          {categoriesData.length > 0 && (
            <FlatList
              data={categoriesData}
              numColumns={3}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.menuItemCat, { backgroundColor: item.tint_color }]}
                >
                  <Image source={{ uri: item.image }} style={styles.menuImageCat} />
                  <Text style={styles.menuText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />)}




          <Text style={{ padding: 10, fontSize: 18, color: '#7a7d50' }}>Shop By Fabric Material</Text>
          {fabricData.length > 0 && (
            <FlatList
              data={fabricData}
              numColumns={3}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.menuItemFab}
                >
                  <Image source={{ uri: item.image }} style={styles.menuImageFab} />
                  <Text style={styles.menuTextFab}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />)}





          <Text style={{ padding: 10, fontSize: 18, color: '#7a7d50' }}>Unstitched</Text>

          <Animated.FlatList
            data={unStichedData}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            snapToAlignment="center"
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            renderItem={({ item, index }) => {
              const inputRange = [
                (index - 1) * ITEM_WIDTH,
                index * ITEM_WIDTH,
                (index + 1) * ITEM_WIDTH,
              ];

              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.8, 1, 0.8], // Scale effect
                extrapolate: "clamp",
              });

              return (
                <View style={{ width: ITEM_WIDTH, alignItems: "center" }}>
                  <Animated.View
                    style={{
                      transform: [{ scale }],
                      borderRadius: 10,
                      overflow: "hidden",
                      elevation: 5,
                      backgroundColor: "#fff"
                    }}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={{
                        width: ITEM_WIDTH - 20,
                        height: 300,
                        borderRadius: 10
                      }}
                    />
                    <Text
                      style={{
                        position: "absolute",
                        bottom: 20,
                        left: 20,
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#fff",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        padding: 5,
                        borderRadius: 5
                      }}
                    >
                      {item.name}
                    </Text>
                  </Animated.View>
                </View>
              );
            }}
          />





          <Text style={{ padding: 10, fontSize: 18, color: '#7a7d50' }}>Boutique Collection</Text>


          <FlatList
            data={boutiqueCollectionData}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <View style={styles.slide}>
                <Image source={{ uri: item.banner_image }} style={styles.image} />
                <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.titlecta} >{item.cta}</Text>
              </View>
            )}
          />

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {boutiqueCollectionData.map((_, index) => {
              const dotOpacity = scrollXY.interpolate({
                inputRange: [
                  (index - 1) * width,
                  index * width,
                  (index + 1) * width,
                ],
                outputRange: [0.3, 1, 0.3],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  key={index}
                  style={[styles.dot, { opacity: dotOpacity }]}
                />
              );
            })}
          </View>

          <Text style={{ padding: 10, fontSize: 18, color: '#7a7d50' }}>Range Of Pattern</Text>
          {rangePattern.length > 0 && (
            <FlatList
              data={chunkArray(rangePattern, 2)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `row-${index}`}
              renderItem={({ item }) => (
                <View >
                  {chunkArray(item, 5).map((row, index) => (
                    <View key={`sub-row-${index}`} >
                      {row.map((subItem) => (
                        <TouchableOpacity key={subItem.product_id} style={styles.menuItemPat}>
                          <Image source={{ uri: subItem.image }} style={styles.menuImagePat} />
                          <Text style={styles.menuTextPat} numberOfLines={2}>{subItem.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            />
          )}


          <Text style={{ padding: 10, fontSize: 18, color: '#7a7d50' }}>Design As Per Occasion</Text>

          {designOccasion.length > 0 && (
            <FlatList
              data={designOccasion}
              numColumns={3}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.menuItemCat, { backgroundColor: item.tint_color }]}
                >
                  <Image source={{ uri: item.image }} style={styles.menuImageCat} />

                  <View style={styles.rowContainer}>
                    <View style={styles.leftTextContainer}>
                      <Text style={styles.menuText} >{item.name}</Text>
                      <Text style={styles.subText}>{item.sub_name}</Text>
                    </View>

                  </View>
                </TouchableOpacity>

              )}
            />)}
        </>}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#fff',
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 8,
    overflow: 'hidden',
    alignItems: 'center',
    width: 120,
    elevation: 2,
    marginTop: 10,
  },
  menuItemPat: {
    backgroundColor: '#FFFFFF',
    borderRadius: 60,
    marginHorizontal: 8,
    overflow: 'hidden',
    alignItems: 'center',
    width: 120,
    marginTop: 10,
  },
  menuImagePat: {
    height: 120,
    width: '100%',
    resizeMode: 'cover',
  },
  menuItemCat: {
    marginHorizontal: 6,
    overflow: 'hidden',
    alignItems: 'center',
    width: 120,
    elevation: 2,
    marginTop: 10,
  },
  menuItemFab: {
    marginHorizontal: 6,
    overflow: 'hidden',
    alignItems: 'center',
    width: 120,
    borderRadius: 60,
    marginTop: 10,
  },
  selectedMenuItem: {
    borderColor: '#7a7d50',
    borderWidth: 2,
  },
  menuImage: {
    height: 80,
    width: '100%',
    resizeMode: 'cover',
  },
  menuImageCat: {
    height: 100,
    width: '100%',
    resizeMode: 'cover',
  },
  menuImageFab: {
    height: 130,
    width: '100%',
    resizeMode: 'cover',
  },
  menuText: {
    padding: 8,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: 'grey'
  },
  menuTextPat: {
    padding: 8,
    fontSize: 10,
    textAlign: 'center',
    color: '#fff',
    position:'absolute',
    top:70,
    textTransform: 'uppercase',

  },
  menuTextFab: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    bottom: 20,
    position: 'absolute',
    textTransform: 'uppercase',
    left: 10
  },
  sliderContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    margin: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  sliderImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
  },
  sliderTextContainer: {
    padding: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    borderRadius: 5,
  },
  sliderTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'uppercase',
    color: 'grey'
  },
  sliderCTA: {
    fontSize: 12,
    color: '#ff9800',
    marginTop: 5,
    textTransform: 'uppercase'
  },
  slide: {
    width: width,

  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    bottom: 25,
    position: 'absolute',
    textTransform: 'uppercase',
    color: '#fff',
    marginLeft: 20
  },
  titlecta: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    bottom: 3,
    position: 'absolute',
    textTransform: 'uppercase',
    color: '#fff',
    marginLeft: 20
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "grey",
    marginHorizontal: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftTextContainer: {
    flex: 1,
  },
  menuText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  subText: {
    fontSize: 12,
    color: '#666',
  },
  ctaText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ff9800',
  },

});

export default HomeScreen;
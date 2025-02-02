import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, Dimensions, Animated, ActivityIndicator } from "react-native";
import Header from "../components/Header";
import { useEffect, useRef, useState, memo, useCallback } from "react";
import { getApi } from "../services/apiServices";
import ImageSlider from "react-native-image-slider";
import FastImage from "react-native-fast-image";
import colors from "../constants/colors";
import { SCREEN_TEXTS } from "../constants/texts";

const { width } = Dimensions.get("window");

const ITEM_WIDTH = width * 0.6;

const OptimizedImage = memo(({ uri, style }) => (
  <FastImage source={{ uri, priority: FastImage.priority.high }} style={style} resizeMode={FastImage.resizeMode.cover} />
));

const HomeScreen = () => {
  const [data, setData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [fabricData, setFabricData] = useState([]);
  const [unStichedData, setUnStichedData] = useState([]);
  const [boutiqueCollectionData, setBoutiqueCollectionData] = useState([]);
  const [rangePattern, setRangePattern] = useState([]);
  const [designOccasion, setDesignOccasion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollXY = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollXY } } }],
    { useNativeDriver: false }
  );

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [repoData, categoryData, rangeData] = await Promise.all([
          getApi("top_repository.json"),
          getApi("middle_repository.json"),
          getApi("bottom_repository.json")
        ]);

        setData(repoData?.main_sticky_menu || []);
        if (repoData?.main_sticky_menu?.length > 0) {
          setSelectedMenu(repoData.main_sticky_menu[0]);
        }

        setCategoriesData(categoryData?.shop_by_category || []);
        setFabricData(categoryData?.shop_by_fabric || []);
        setUnStichedData(categoryData?.Unstitched || []);
        setBoutiqueCollectionData(categoryData?.boutique_collection || []);

        setRangePattern(rangeData?.range_of_pattern || []);
        setDesignOccasion(rangeData?.design_occasion || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);


  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const renderMenuItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={[
          styles.menuItem,
          selectedMenu?.title === item.title && styles.selectedMenuItem,
        ]}
        onPress={() => setSelectedMenu(item)}
      >
        <OptimizedImage uri={item.image} style={styles.menuImage} />
        <Text style={styles.menuText}>{item.title}</Text>
      </TouchableOpacity>
    ),
    [selectedMenu]
  );


  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {loading ?
        <ActivityIndicator size="large" color={colors.indicator} />
        :
        <>
          <Header />

          <FlatList
            data={data}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.title}
            renderItem={renderMenuItem}
          />

          {selectedMenu && (
            <FlatList
              data={selectedMenu.slider_images}
              keyExtractor={(item) => item.title}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.sliderContainer}>
                  <OptimizedImage uri={item.image} style={styles.sliderImage} />
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


          <Text style={{ padding: 10, fontSize: 18, color: colors.text }}>{SCREEN_TEXTS.shopByCategory}</Text>
          {categoriesData.length > 0 && (
            <FlatList
              data={categoriesData}
              numColumns={3}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.menuItemCat, ]}
                >
                  <OptimizedImage uri={item.image} style={styles.menuImageCat} />
                  <Text style={styles.menuText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />)}


          <Text style={{ padding: 10, fontSize: 18, color: colors.text }}>{SCREEN_TEXTS.shopByFabric}</Text>
          {fabricData.length > 0 && (
            <FlatList
              data={fabricData}
              numColumns={3}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.menuItemFab}
                >
                  <OptimizedImage uri={item.image} style={styles.menuImageFab} />
                  <Text style={styles.menuTextFab}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />)}


          <Text style={{ padding: 10, fontSize: 18, color: colors.text }}>{SCREEN_TEXTS.unstitched}</Text>
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
                outputRange: [0.8, 1, 0.8],
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
                      backgroundColor: colors.white
                    }}
                  >
                    <OptimizedImage uri={item.image} style={{ width: ITEM_WIDTH - 20, height: 300, borderRadius: 10 }} />
                    <Text
                      style={{
                        position: "absolute",
                        bottom: 20,
                        left: 20,
                        fontSize: 18,
                        fontWeight: "bold",
                        color: colors.white,
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


          <Text style={{ padding: 10, fontSize: 18, color: colors.text }}>{SCREEN_TEXTS.boutiqueCollection}</Text>

          <ImageSlider
            images={boutiqueCollectionData.map((item) => item.banner_image)}
            customSlide={({ index, item }) => (
              <View key={index} style={styles.slide}>
                <View style={styles.imageContainer}>
                <OptimizedImage uri={item} style={styles.image} />
                </View>
                <Text style={styles.title} numberOfLines={2}>{boutiqueCollectionData[index]?.name}</Text>
                <Text style={styles.titlecta}>{boutiqueCollectionData[index]?.cta}</Text>
              </View>
            )}
          />


          <Text style={{ padding: 10, fontSize: 18, color: colors.text }}>{SCREEN_TEXTS.rangePattern}</Text>
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


          <Text style={{ padding: 10, fontSize: 18, color: colors.text }}>{SCREEN_TEXTS.designOccasion}</Text>
          {designOccasion.length > 0 && (
            <FlatList
              data={designOccasion}
              numColumns={3}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.menuItemCat, { }]}
                >
                  <OptimizedImage uri={item.image} style={styles.menuImageCat} />
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
    backgroundColor: colors.white,
  },
  menuItem: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginHorizontal: 8,
    overflow: 'hidden',
    alignItems: 'center',
    width: 120,
    elevation: 2,
    marginTop: 10,
  },
  menuItemPat: {
    backgroundColor:colors.white,
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
    borderColor: colors.text,
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
    color: colors.textGrey
  },
  menuTextPat: {
    padding: 8,
    fontSize: 10,
    textAlign: 'center',
    color: colors.white,
    position: 'absolute',
    top: 70,
    textTransform: 'uppercase',

  },
  menuTextFab: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
    bottom: 20,
    position: 'absolute',
    textTransform: 'uppercase',
    left: 10
  },
  sliderContainer: {
    borderRadius: 10,
    margin: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  sliderImage: {
    width: 380,
    height: 200,
    borderRadius: 10,
  },
  sliderTextContainer: {
    padding: 10,
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    borderRadius: 5,
  },
  sliderTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.sectionText,
    textTransform: 'uppercase',
    color: 'grey'
  },
  sliderCTA: {
    fontSize: 12,
    color: colors.sliderCta,
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
    color:colors.white,
    marginLeft: 20
  },
  titlecta: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    bottom: 3,
    position: 'absolute',
    textTransform: 'uppercase',
    color: colors.white,
    marginLeft: 20
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
    color: colors.sectionText,
  },
  subText: {
    fontSize: 12,
    color: colors.subText,
  },
  ctaText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.sliderCta,
  },

});

export default HomeScreen;
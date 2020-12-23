import React, { useCallback, useContext, useRef, useState } from "react";
import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
  Image,
  TouchableOpacity,
  Keyboard,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../values/colors";
import { strings } from "../../values/strings";
import { textStyles } from "../../values/textStyles";
import { PlaceRating } from "./PlaceScreen";
import Highlighter from 'react-native-highlight-words';
import { fonts } from "../../values/fonts";
import { UserContext } from "../../context/context";
import { statusBarHeight } from "../../values/consts";
import _ from "lodash";
import { useServer } from "../../hooks/useServer";
import { useIsFocused } from '@react-navigation/native';
import { placeLocked } from "../../hooks/helpers";
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

const AwareFlatList = Animated.createAnimatedComponent(KeyboardAwareFlatList);

export const BORDER_RADIUS = 15;
const CARD_PADDING = 2;
const CARD_ASPECT_RATIO = 1.31;
const INNER_BORDER_RADIUS = BORDER_RADIUS - CARD_PADDING;
export const EXIT_SIZE = 26;

export const ExploreScreen = ({ navigation, route }) => {

  const {location} = route.params;
  const currentPage = useRef(0);

  const isFocused = useIsFocused();

  const {state} = useContext(UserContext);
  const {serverPlaces, user, settings} = state;

  const [searchTerm, setSearchTerm] = useState("");
  const [searchOn, setSearchOn] = useState(false);

  const {searchPlaces, loadingSearch, getExplorePlaces, loadingMorePlaces} = useServer();

  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  const cardListAlpha = useRef(new Animated.Value(1)).current;
  const leftMargin = useRef(new Animated.Value(EXIT_SIZE)).current;
  const topLeftRadius = useRef(new Animated.Value(30)).current;

  useEffect(()=> {
    Animated.timing(cardListAlpha, {
      useNativeDriver: true,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      toValue: searchOn ? 0 : 1
    }).start();
    Animated.parallel([
      Animated.timing(leftMargin, {
        duration: 100,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.ease),
        toValue: searchOn ? 0 : EXIT_SIZE
      }),
      Animated.timing(topLeftRadius, {
        duration: 100,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.ease),
        toValue: searchOn ? 0 : 30
      })
    ]).start();
  }, [searchOn])

  useEffect(() => {
    loadMorePlaces();
    setFilteredPlaces(serverPlaces);
    return () => {
      debounce.cancel();
    };
  }, []);

  const loadMorePlaces = async () => {
    if (currentPage.current === -1) {
      return;
    }
    if (location != null) {
      const p = await getExplorePlaces(location, currentPage.current);
      if (p) {
        if (p.length > 0) {
          currentPage.current = currentPage.current + 1;
          setPlaces([...places, ...p]);
        } else {
          currentPage.current = -1;
        }
      }
    }
  }

  const closeSearch = () => {
    debounce.cancel();
    setSearchTerm("");
    setSearchOn(false);
    Keyboard.dismiss();
  };

  const goBack = () => {
    navigation.goBack();
  };

  const textChanged = (value) => {
    setSearchTerm(value);
    debounce.cancel()
    if (value.length === 0) {
      setFilteredPlaces(places);
    } else {
      debounce(value);
    }
  };

  const debounce = useCallback(_.debounce(async(searchVal) => {
    const p = await searchPlaces(searchVal, location);
    if (isFocused) {
      setFilteredPlaces(p);
    }
  }, 500), [location]);

  const showItem = (item) => {
    navigation.navigate("Home", { searchItem: item });
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={goBack} style={styles.tap}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      <Animated.View style={styles.searchScreenContainer(leftMargin, topLeftRadius)}>
        <SearchBar
          loadingSearch={loadingSearch}
          searchTerm={searchTerm}
          searchOn={searchOn}
          setSearchOn={setSearchOn}
          closeSearch={closeSearch}
          textChanged={textChanged}
        />

        <View style={styles.listsContainer}>
          <AwareFlatList
            onEndReached={loadMorePlaces}
            onEndReachedThreshold={2}
            scrollIndicatorInsets={styles.scrollInsets}
            style={styles.cardsList(searchOn, cardListAlpha)}
            contentContainerStyle={styles.flatListContainer}
            data={places}
            keyExtractor={(item) => item.key}
            ListFooterComponent={()=>{
              return (
                <View style={styles.paginationIndicatorContainer} key='indicator'>
                  <ActivityIndicator animating={loadingMorePlaces} color={colors.treeBlues} />
                </View>                
              )
            }}
            renderItem={({ item, index }) => <SearchCard settings={settings} user={user} showItem={showItem} item={item} index={index} />}
          />
          <AwareFlatList
            scrollIndicatorInsets={styles.scrollInsets}
            style={{...StyleSheet.absoluteFill, opacity: cardListAlpha.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0]
            })}}
            contentContainerStyle={styles.flatListContainer}
            data={filteredPlaces}
            keyExtractor={(item) => item.key}
            renderItem={({ item, index }) => <TextCard item={item} showItem={showItem} index={index} searchTerm={searchTerm} />}
          />
        </View>
      </Animated.View>
    </View>
  );
};

export const TextCard = ({ item, showItem, index, searchTerm }) => {
  return (
    <TouchableOpacity onPress={()=>showItem(item)} style={styles.smallCardContainer}>
      <Highlighter
        adjustsFontSizeToFit={true} 
        numberOfLines={2}
        style={styles.smallCardTitle}
        highlightStyle={{fontFamily: fonts.bold}}
        searchWords={searchTerm.length === 0 ? [] : [searchTerm]}
        textToHighlight={item.title}
      />
      <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.smallCardDetail}>{strings.distanceFromYou(item.distance)}</Text>
    </TouchableOpacity>
  )
}

export const SearchBar = ({
  searchTerm,
  searchOn,
  setSearchOn,
  closeSearch,
  textChanged,
  modal = false,
  loadingSearch = false
}) => {

  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(()=>{
    Animated.timing(opacity, {
      useNativeDriver: true,
      toValue: loadingSearch ? 1 : 0,
      easing: Easing.inOut(Easing.ease)
    }).start();
  }, [loadingSearch])

  const onFocus = () => {
    if (modal) {
      return;
    }
    setSearchOn(true)
  };

  return (
    <View style={styles.searchContainer(searchOn)}>

      <Animated.View style={styles.searchIndicatorContainer(opacity)}>
        <ActivityIndicator style={styles.indicator} animating={loadingSearch} color={colors.treeBlues} />
      </Animated.View>

      {searchOn ? (
        <TouchableOpacity onPress={closeSearch}>
          <Image
            source={require("../../assets/images/search_close_icon.png")}
          />
        </TouchableOpacity>
      ) : null}

      <TextInput
        onFocus={onFocus}
        onChangeText={textChanged}
        value={searchTerm}
        selectionColor={colors.desertRock}
        placeholderTextColor={colors.treeBlues}
        placeholder={searchOn ? strings.exploreScreen.searchPlaceholder : ""}
        style={styles.searchInput}
      />     

      <Image
        source={
          searchOn
            ? require("../../assets/images/search_icon.png")
            : require("../../assets/images/search_off_icon.png")
        }
      />
    </View>
  );
};

const SearchCard = ({ settings, user, item, showItem, index }) => {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={() => showItem(item)}>
      <Image style={styles.cardImage} source={{ uri: item.image }} />
      <View style={styles.cardDetailsContainer}>
        <View style={styles.cardLocationContainer}>
          {item.distance && (
            <Text style={textStyles.normalOfSize(14)}>
              {strings.distanceFromYou(item.distance)}
            </Text>  
          )}
          <View style={{flexGrow: 1, minWidth: 4}} />
          <View style={styles.titleContainer}>
            <Text numberOfLines={2} adjustsFontSizeToFit={true} style={textStyles.boldOfSize(16)}>{item.title}</Text>

            <Image
              style={styles.translateY(-2)}
              source={require("../../assets/images/marker_small.png")}
            />
          </View>
        </View>

        <View style={styles.ratingContainer}>
          <PlaceRating
            pointsToUnlock={settings.pointsForUnlock}
            small
            locked={placeLocked(user, item)}
            title={strings.placeScreen.crowdnessTitle(true)}
            image={require("../../assets/images/HowBusy.png")}
            color={item.crowdnessColor}
            rating={item.crowdness}
          />

          <PlaceRating
            small
            leftMargin={40}
            title={strings.placeScreen.cleannessTitle(placeLocked(user, item))}
            image={require("../../assets/images/Heart.png")}
            color={item.cleannessColor}
            rating={item.cleanness}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({

  paginationIndicatorContainer: {
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },

  cardsList: (searchOn, opacity) => ({
    ...StyleSheet.absoluteFill, 
    zIndex: searchOn ? -1 : 1, 
    opacity
  }),

  indicator: {
    transform: [{translateX: 24}]
  },

  searchIndicatorContainer: (opacity) => ({
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    alignItems: 'center',
    opacity
  }),

  scrollInsets: {
    right: 1
  },

  smallCardTitle: {
    width: '50%',
    ...textStyles.normalOfSize(18),
    color: colors.treeBlues
  },

  smallCardDetail: {
    width: '50%',
    ...textStyles.normalOfSize(18),
    color: colors.treeBlues,
    textAlign: 'center',
  },

  smallCardContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: colors.treeBlues,
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  listsContainer: {
    flex: 1,
    width: '100%'
  },

  translateY: (translateY) => ({
    transform: [{ translateY }],
  }),

  titleContainer: { 
    flexShrink: 1, 
    flexDirection: "row", 
    alignItems: "center" 
  },

  cardLocationContainer: {
    flexShrink: 1,
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 16,
    justifyContent: 'flex-end',
  },
  ratingContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
  },
  flatListContainer: {
    paddingVertical: 34,
    paddingHorizontal: 40,
  },

  card: {
    borderWidth: 1,
    borderColor: colors.treeBlues,
    padding: CARD_PADDING,
    overflow: "hidden",
    borderRadius: BORDER_RADIUS,
    width: "100%",
    aspectRatio: CARD_ASPECT_RATIO,
    marginBottom: 24,
  },

  cardImage: {
    borderTopLeftRadius: INNER_BORDER_RADIUS,
    borderTopRightRadius: INNER_BORDER_RADIUS,
    flexGrow: 1,
  },

  cardDetailsContainer: {
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
    height: 80,
    borderBottomLeftRadius: INNER_BORDER_RADIUS,
    borderBottomRightRadius: INNER_BORDER_RADIUS,
  },

  searchInput: {
    marginLeft: 24,
    paddingHorizontal: 8,
    flexGrow: 1,
    flexShrink: 1,
    textAlign: "right",
    ...textStyles.normalOfSize(24),
    color: colors.treeBlues,
  },

  searchContainer: (searchOn) => ({
    borderBottomColor: colors.treeBlues,
    borderBottomWidth: searchOn ? 2 : 1,
    marginVertical: 4,
    marginHorizontal: 40,
    padding: 4,
    // height: 36,
    alignItems: "center",
    flexDirection: "row",
  }),
  container: {
    flex: 1,
    backgroundColor: colors.clear,
  },

  searchScreenContainer: (marginLeft, topLeftRadius) => ({
    paddingTop: 30,
    borderTopLeftRadius: topLeftRadius,
    flex: 1,
    backgroundColor: "white",
    marginLeft,
    marginTop: statusBarHeight,
    alignItems: "center",
  }),

  tap: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: EXIT_SIZE,
  },
});

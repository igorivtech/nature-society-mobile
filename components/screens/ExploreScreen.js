import React, { useCallback, useContext, useRef, useState } from "react";
import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
  Keyboard,
  FlatList,
  Animated,
  Easing,
} from "react-native";
import { useKeyboard } from "../../hooks/useKeyboard";
import { colors } from "../../values/colors";
import { strings } from "../../values/strings";
import { textStyles } from "../../values/textStyles";
import { PlaceRating } from "./PlaceScreen";
import Highlighter from 'react-native-highlight-words';
import { fonts } from "../../values/fonts";
import { UserContext } from "../../context/context";
import { statusBarHeight } from "../../values/consts";
import _ from "lodash";

export const BORDER_RADIUS = 15;
const CARD_PADDING = 2;
const CARD_ASPECT_RATIO = 1.31;
const INNER_BORDER_RADIUS = BORDER_RADIUS - CARD_PADDING;
export const EXIT_SIZE = 26;

export const ExploreScreen = ({ navigation }) => {

  const {state} = useContext(UserContext);
  const {serverPlaces} = state;

  const [searchTerm, setSearchTerm] = useState("");
  const [searchOn, setSearchOn] = useState(false);

  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [keyboardHeight] = useKeyboard();
  const [keyboardBottomPadding, setKeyboardBottomPadding] = useState(40);

  const cardListAlpha = useRef(new Animated.Value(1)).current;

  useEffect(()=> {
    Animated.timing(cardListAlpha, {
      useNativeDriver: true,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      toValue: searchOn ? 0 : 1
    }).start();
  }, [searchOn])

  useEffect(() => {
    setPlaces(serverPlaces);
    setFilteredPlaces(serverPlaces);
    return () => {
      debounce.cancel();
    };
  }, []);

  useEffect(() => {
    setKeyboardBottomPadding(40 + keyboardHeight);
  }, [keyboardHeight]);

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

  const debounce = useCallback(_.debounce((searchVal) => {
    const filtered = places.filter((place) => {
      const s1 = place.title.toLowerCase();
      const s2 = searchVal.toLowerCase();
      return s1.indexOf(s2) > -1;
    })
    setFilteredPlaces(filtered);
  }, 500), [places]);

  const showItem = (item) => {
    navigation.navigate("Home", { searchItem: item });
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={goBack} style={styles.tap}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      <View style={styles.searchScreenContainer}>
        <SearchBar
          searchTerm={searchTerm}
          searchOn={searchOn}
          setSearchOn={setSearchOn}
          closeSearch={closeSearch}
          textChanged={textChanged}
        />

        <View style={styles.listsContainer}>
          <Animated.FlatList
            scrollIndicatorInsets={styles.scrollInsets}
            style={{...StyleSheet.absoluteFill, zIndex: searchOn ? -1 : 1, opacity: cardListAlpha.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1]
            })}}
            contentContainerStyle={styles.flatListContainer(keyboardBottomPadding)}
            data={places}
            keyExtractor={(item) => item.key}
            renderItem={({ item, index }) => <SearchCard showItem={showItem} item={item} index={index} />}
          />
          <Animated.FlatList
            scrollIndicatorInsets={styles.scrollInsets}
            style={{...StyleSheet.absoluteFill, opacity: cardListAlpha.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0]
            })}}
            contentContainerStyle={styles.flatListContainer(keyboardBottomPadding)}
            data={filteredPlaces}
            keyExtractor={(item) => item.key}
            renderItem={({ item, index }) => <TextCard item={item} showItem={showItem} index={index} searchTerm={searchTerm} />}
          />
        </View>
      </View>
    </View>
  );
};

export const TextCard = ({ item, showItem, index, searchTerm }) => {
  return (
    <TouchableOpacity onPress={()=>showItem(item)} style={styles.smallCardContainer}>
      <Highlighter
        adjustsFontSizeToFit={true} 
        numberOfLines={1}
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
  modal = false
}) => {

  const onFocus = () => {
    if (modal) {
      return;
    }
    setSearchOn(true)
  };

  return (
    <View style={styles.searchContainer(searchOn)}>
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

const SearchCard = ({ item, showItem, index }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => showItem(item)}>
      <Image style={styles.cardImage} source={{ uri: item.image }} />
      <View style={styles.cardDetailsContainer}>
        <View style={styles.cardLocationContainer}>
          <Text style={textStyles.normalOfSize(14)}>
            {strings.distanceFromYou(item.distance)}
          </Text>

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
            pointsToUnlock={item.pointsToUnlock}
            small
            locked={item.locked}
            title={strings.placeScreen.crowdnessTitle(true)}
            image={require("../../assets/images/HowBusy.png")}
            color={colors.desertRock}
            rating={item.crowdness}
          />

          <PlaceRating
            small
            leftMargin={40}
            title={strings.placeScreen.cleannessTitle(item.locked)}
            image={require("../../assets/images/Heart.png")}
            color={colors.grass}
            rating={item.cleanness}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({

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
    justifyContent: "space-between",
  },
  ratingContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
  },
  flatListContainer: (keyboardBottomPadding) => ({
    paddingVertical: 34,
    paddingHorizontal: 40,
    paddingBottom: keyboardBottomPadding,
  }),

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

  searchScreenContainer: {
    paddingTop: 30,
    borderTopLeftRadius: 30,
    flex: 1,
    backgroundColor: "white",
    marginLeft: EXIT_SIZE,
    marginTop: statusBarHeight,
    alignItems: "center",
  },

  tap: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: EXIT_SIZE,
  },
});

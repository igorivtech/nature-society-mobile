import React, { useCallback, useRef, useState } from "react";
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
} from "react-native";
import { useKeyboard } from "../../hooks/useKeyboard";
import { colors } from "../../values/colors";
import { DATA, NAV_CLOSE_TAP_SIZE } from "../../values/consts";
import { strings } from "../../values/strings";
import { textStyles } from "../../values/textStyles";
import { PlaceRating } from "./PlaceScreen";

const BORDER_RADIUS = 15;
const CARD_PADDING = 2;
const CARD_ASPECT_RATIO = 1.31;
const INNER_BORDER_RADIUS = BORDER_RADIUS - CARD_PADDING;
const EXIT_SIZE = 26;

export const ExploreScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOn, setSearchOn] = useState(false);

  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [keyboardHeight] = useKeyboard();

  useEffect(() => {
    setPlaces(DATA);
  }, []);

  useEffect(()=>{
    console.log(keyboardHeight);
  }, [keyboardHeight])

  const closeSearch = () => {
    setSearchTerm("");
    setSearchOn(false);
    Keyboard.dismiss();
  };

  const goBack = () => {
    navigation.goBack();
  };

  const textChanged = useCallback( (value) => {
    setSearchTerm(value);
  }, [setSearchTerm]);

  const showItem = (item) => {
    navigation.navigate("Home", { searchItem: item });
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={goBack} style={styles.tap}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      <SafeAreaView />

      <View style={styles.searchScreenContainer}>
        <SearchBar
          searchTerm={searchTerm}
          searchOn={searchOn}
          setSearchOn={setSearchOn}
          closeSearch={closeSearch}
          textChanged={textChanged}
        />

        <FlatList
          contentContainerStyle={styles.flatListContainer}
          data={places}
          keyExtractor={(item) => item.key}
          renderItem={({ item, index }) => {
            return <SearchCard showItem={showItem} item={item} index={index} />;
          }}
        />
      </View>
    </View>
  );
};

const SearchBar = ({
  searchTerm,
  searchOn,
  setSearchOn,
  closeSearch,
  textChanged,
}) => {
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
        onFocus={() => setSearchOn(true)}
        onBlur={() => setSearchOn(false)}
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

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={textStyles.boldOfSize(16)}>{item.title}</Text>

            <Image
              style={styles.translateY(-2)}
              source={require("../../assets/images/marker_small.png")}
            />
          </View>
        </View>

        <View style={styles.ratingContainer}>
          <PlaceRating
            small
            locked={item.locked}
            title={strings.placeScreen.crowdnessTitle}
            image={require("../../assets/images/HowBusy.png")}
            color={colors.desertRock}
            rating={item.crowdness}
          />

          <PlaceRating
            small
            locked={item.locked}
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
  translateY: (translateY) => ({
    transform: [{ translateY }],
  }),

  cardLocationContainer: {
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
    paddingHorizontal: 8,
    flexGrow: 1,
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
    paddingVertical: 30,
    borderTopLeftRadius: 30,
    flex: 1,
    backgroundColor: "white",
    marginLeft: EXIT_SIZE,
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

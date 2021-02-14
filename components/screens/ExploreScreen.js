import React, { useCallback, useContext, useRef, useState, memo } from "react";
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
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { colors } from "../../values/colors";
import { strings } from "../../values/strings";
import { textStyles } from "../../values/textStyles";
import { PlaceRating } from "./PlaceScreen";
import Highlighter from 'react-native-highlight-words';
import { fonts } from "../../values/fonts";
import { UserContext } from "../../context/context";
import { keyboardAwareBehaviour, smallScreen, statusBarHeight } from "../../values/consts";
import { globalStyles } from "../../values/styles";
import _ from "lodash";
import { useServer } from "../../hooks/useServer";
import { useIsFocused } from '@react-navigation/native';
import { placeLocked } from "../../hooks/helpers";
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { Directions, FlingGestureHandler, State } from "react-native-gesture-handler";
import * as Animatable from "react-native-animatable";
import * as WebBrowser from 'expo-web-browser';
import { appWebsite } from "../../hooks/useShare";
import LottieView from 'lottie-react-native';
import { ClosePanelArrow } from "../views/ClosePanelArrow";

const AwareFlatList = Animated.createAnimatedComponent(KeyboardAwareFlatList);

export const BORDER_RADIUS = 15;
const CARD_PADDING = 2;
const CARD_ASPECT_RATIO = 1.31;
const INNER_BORDER_RADIUS = BORDER_RADIUS - CARD_PADDING;
export const EXIT_SIZE = 26;

export const ExploreScreen = ({ navigation, route }) => {

  const {location, hasLocation} = route.params;
  const currentPage = useRef(0);

  const isFocused = useIsFocused();

  const {state} = useContext(UserContext);
  const {serverPlaces, user, settings, token} = state;

  const [searchTerm, setSearchTerm] = useState("");
  const [searchOn, setSearchOn] = useState(false);

  const {searchPlaces, loadingSearch, getExplorePlaces, loadingMorePlaces, suggestNewPlace, loadingSuggestion} = useServer();

  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  const [showSuggestion, setShowSuggestion] = useState(false);

  const leftMargin = useRef(new Animated.Value(EXIT_SIZE)).current;
  const listTranslateX = leftMargin.interpolate({
    inputRange: [0, EXIT_SIZE],
    outputRange: [0, -EXIT_SIZE/2],
    extrapolate: 'clamp',
  });
  const cardListAlpha = leftMargin.interpolate({
    inputRange: [0, EXIT_SIZE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const textListOpacity = cardListAlpha.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
  })

  useEffect(()=> {
    if (searchOn) {
      setFilteredPlaces(serverPlaces);
    }
    Animated.timing(leftMargin, {
      duration: 320,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
      toValue: searchOn ? 0 : EXIT_SIZE
    }).start();
  }, [searchOn, serverPlaces])

  useEffect(() => {
    currentPage.current = 0;
    loadMorePlaces();
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

  const closeSearch = useCallback(() => {
    setShowSuggestion(false);
    debounce.cancel();
    setSearchTerm("");
    setSearchOn(false);
    Keyboard.dismiss();
  }, []);

  const safeCloseSearch = useCallback(() => {
    if (searchTerm.length > 0) {
      setShowSuggestion(false);
      debounce.cancel();
      setSearchTerm("");
      setFilteredPlaces(serverPlaces);
    } else {
      closeSearch();
    }
  }, [searchTerm, serverPlaces])

  const goBack = () => {
    navigation.goBack();
  };

  const textChanged = useCallback((value) => {
    setShowSuggestion(false);
    setSearchTerm(value);
    debounce.cancel()
    if (value.length === 0) {
      setFilteredPlaces(serverPlaces);
    } else {
      debounce(value);
    }
  }, [serverPlaces]);

  const debounce = useCallback(_.debounce(async(searchVal) => {
    const p = await searchPlaces(searchVal, location);
    if (isFocused) {
      setFilteredPlaces(p);
      if (p.length === 0) {
        setShowSuggestion(true);
      }
    }
  }, 500), [location]);

  const showItem = (item) => {
    navigation.navigate("Home", { searchItem: item });
  };

  const handleSwipeRight = (event) => {
    if (event.nativeEvent.state === State.END) {
      if (searchOn) {
        closeSearch();
      } else {
        goBack();
      }
    }
  };

  const showGlobalSites = useCallback(() => {
    WebBrowser.openBrowserAsync(appWebsite);
  }, []);

  const suggestPlace = useCallback(() => {
    suggestNewPlace(searchTerm.trim(), token);
  }, [searchTerm])

  return (
    <View style={styles.container}>
      <FlingGestureHandler
        direction={Directions.RIGHT}
        onHandlerStateChange={handleSwipeRight}
      >
        <Animated.View style={styles.searchScreenContainer(leftMargin)}>

          <ClosePanelArrow direction='right' />

          <Animated.View style={{width: '100%', transform: [{translateX: listTranslateX}]}}>
            <SearchBar
              leftMargin={leftMargin}
              loadingSearch={loadingSearch}
              searchTerm={searchTerm}
              searchOn={searchOn}
              setSearchOn={setSearchOn}
              safeCloseSearch={safeCloseSearch}
              closeSearch={closeSearch}
              textChanged={textChanged}
            />
          </Animated.View>

          <Animated.View style={styles.listsContainer(listTranslateX)}>
            <AwareFlatList
              onEndReached={loadMorePlaces}
              onEndReachedThreshold={2}
              scrollIndicatorInsets={styles.scrollInsets}
              style={styles.cardsList(searchOn, cardListAlpha)}
              contentContainerStyle={styles.flatListContainer}
              data={places}
              keyExtractor={(item) => item.key}
              ListHeaderComponentStyle={styles.headerContainer}
              ListHeaderComponent={()=><SitesHeader key='sitesHeader' onPress={showGlobalSites} />}
              ListFooterComponentStyle={styles.paginationIndicatorContainer}
              ListFooterComponent={()=><ActivityIndicator key='indicator' animating={places.length > 0 && loadingMorePlaces} color={colors.treeBlues} />}
              renderItem={({ item, index }) => <SearchCard hasLocation settings={settings} user={user} showItem={showItem} item={item} index={index} />}
            />
            <AwareFlatList
              scrollIndicatorInsets={styles.scrollInsets}
              style={{...StyleSheet.absoluteFill, opacity: textListOpacity}}
              contentContainerStyle={styles.flatListContainer}
              data={filteredPlaces}
              keyExtractor={(item) => item.key}
              renderItem={({ item, index }) => <TextCard item={item} showItem={showItem} index={index} searchTerm={searchTerm} />}
            />
            <KeyboardAvoidingView behavior={keyboardAwareBehaviour} style={suggestionStyles.suggestionContainer(showSuggestion)}>
              <SuggestPlaceView loadingSuggestion={loadingSuggestion} searchTerm={searchTerm} showSuggestion={showSuggestion} suggestPlace={suggestPlace} />
            </KeyboardAvoidingView>
          </Animated.View>
          <TouchableWithoutFeedback onPress={goBack}>
            <View style={styles.tapClose} />
          </TouchableWithoutFeedback>
        </Animated.View>
      </FlingGestureHandler>
    </View>
  );
};

export const SuggestPlaceView = memo(({showSuggestion, suggestPlace, searchTerm, loadingSuggestion}) => {
  const [sent, setSent] = useState(false);
  const scale = useRef(new Animated.Value(loadingSuggestion ? 0.9 : 1)).current;
  const opacity = scale.interpolate({
    inputRange: [0.9, 1],
    outputRange: [0.8, 1],
    extrapolate: 'clamp'
  });
  useEffect(()=>{
    if (showSuggestion === false) {
      setSent(false);
    }
  }, [showSuggestion])
  useEffect(()=>{
    setSent(false);
  }, [searchTerm])
  useEffect(()=>{
    if (loadingSuggestion !== null) {
      Animated.timing(scale, {
        toValue: loadingSuggestion ? 0.9 : 1,
        useNativeDriver: true,
        duration: loadingSuggestion ? 400 : 300,
        easing: loadingSuggestion ? Easing.inOut(Easing.ease) : Easing.out(Easing.ease)
      }).start(()=>{
        if (loadingSuggestion === false) {
          setSent(true);
        }
      });
    }
  }, [loadingSuggestion])
  if (showSuggestion) {
    return (
      <View style={suggestionStyles.container}>
        <Text style={textStyles.normalOfSize(18, colors.treeBlues, 'center')}>{strings.exploreScreen.didntFindTitle}</Text>
        <View style={globalStyles.spacer(12)} />
        <TouchableOpacity disabled={loadingSuggestion} onPress={suggestPlace}>
          <Animated.View style={suggestionStyles.newSuggestionButtonContainer(opacity, scale)}>
            <Text numberOfLines={2} style={suggestionStyles.suggestButton}>{strings.exploreScreen.newPlaceSuggestion(searchTerm.trim())}</Text>
          </Animated.View>
        </TouchableOpacity>
        {sent && (<View style={suggestionStyles.sentContainer}>
          <Text style={textStyles.normalOfSize(18, colors.treeBlues, 'center')}>{strings.exploreScreen.suggestionSent}</Text>
          <View style={globalStyles.spacer(8)} />
          <Image source={require("../../assets/images/suggestion_sent_icon.png")} style={globalStyles.imageJustContain} />
        </View>)}
      </View>
    )
  } else {
    return <View />
  }
})

export const suggestionStyles = StyleSheet.create({
  sentContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  suggestionContainer: (showSuggestion) => ({
    transform: [{translateY: -34}],
    ...StyleSheet.absoluteFill,
    zIndex: showSuggestion ? 4 : -4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 40
  }),

  suggestButton: {
    ...textStyles.boldOfSize(18, colors.treeBlues, 'center'),
    flexShrink: 1,
  },

  newSuggestionButtonContainer: (opacity, scale) => ({
    opacity,
    transform: [{scale}],
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.treeBlues,
    borderRadius: 15,
    minHeight: 54
  }),
})

export const SitesHeader = memo(({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.headerInnerContainer}>
      <Image style={globalStyles.imageJustContain} source={require("../../assets/images/left_arrow.png")} />
      <Text numberOfLines={1} adjustsFontSizeToFit={true} minimumFontScale={0.8} style={styles.headerTitle}>{strings.exploreScreen.globalSites}</Text>
      <Image style={globalStyles.imageJustContain} source={require("../../assets/images/trophy.png")} />
    </TouchableOpacity>
  )
})

export const TextCard = ({ item, showItem, index, searchTerm }) => {
  return (
    <TouchableOpacity onPress={()=>showItem(item)} style={styles.smallCardContainer}>
      <Highlighter
        minimumFontScale={0.8}
        adjustsFontSizeToFit={true} 
        numberOfLines={2}
        style={styles.smallCardTitle}
        highlightStyle={{fontFamily: fonts.bold}}
        searchWords={searchTerm.length === 0 ? [] : [searchTerm]}
        textToHighlight={item.title}
      />
      <Text minimumFontScale={0.8} adjustsFontSizeToFit={true} numberOfLines={1} style={styles.smallCardDetail}>{strings.distanceFromYou(item.distance)}</Text>
    </TouchableOpacity>
  )
}

export const SearchBar = memo(({
  leftMargin = null,
  searchTerm,
  searchOn,
  setSearchOn,
  closeSearch,
  safeCloseSearch,
  textChanged,
  modal = false,
  loadingSearch = false
}) => {

  const indicatorOpacity = useRef(new Animated.Value(1)).current;

  const progress = leftMargin !== null ? leftMargin.interpolate({
    inputRange: [0, EXIT_SIZE],
    outputRange: [1, 0]
  }) : 0

  const bottomLineWidth = leftMargin !== null ? leftMargin.interpolate({
    inputRange: [0, EXIT_SIZE],
    outputRange: [2, 1],
    extrapolate: 'clamp'
  }) : 2

  useEffect(()=>{
    Animated.timing(indicatorOpacity, {
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
    <View style={styles.searchContainer}>

      <Animated.View style={styles.searchIndicatorContainer(indicatorOpacity)}>
        <ActivityIndicator style={styles.indicator} animating={loadingSearch} color={colors.treeBlues} />
      </Animated.View>

      {searchOn ? (
        <TouchableOpacity onPress={safeCloseSearch ?? closeSearch}>
          <Image
            source={require("../../assets/images/search_close_icon.png")}
          />
        </TouchableOpacity>
      ) : null}

      <TextInput
        autoFocus={modal}
        onFocus={onFocus}
        onChangeText={textChanged}
        value={searchTerm}
        selectionColor={colors.desertRock}
        // placeholderTextColor={colors.treeBlues}
        // placeholder={modal ? '' : (searchOn ? strings.exploreScreen.searchPlaceholder : "")}
        style={styles.searchInput}
      />     

      <TouchableWithoutFeedback disabled={!searchOn} onPress={closeSearch}>
        {modal ? (
          <Image style={globalStyles.imageJustContain} source={require("../../assets/images/search_icon.png")} />
        ) : (
          <LottieView style={styles.lottie} 
            resizeMode='contain'
            source={require("../../assets/animations/search.json")} 
            autoPlay={false} 
            progress={progress}
          />
        )}
      </TouchableWithoutFeedback>

      <Animated.View style={styles.bottomBorder(bottomLineWidth)} />
    </View>
  );
});

const SearchCard = ({ hasLocation, settings, user, item, showItem, index }) => {
  const [loadingImage, setLoadingImage] = useState(false);
  return (
    <Animatable.View animation='fadeIn'>
      <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={() => showItem(item)}>
        {item.image == null && (
          <Image style={styles.cardImage('contain')} source={require("../../assets/images/default_place_bg.png")} />
        )}
        {item.image != null && (
          <View style={styles.placeImageContainer}>
            <Image onLoad={()=>setLoadingImage(false)} onLoadStart={()=>setLoadingImage(true)} style={styles.cardImage('cover')} source={{ 
              uri: item.image,
              cache: 'force-cache'
            }} />
            <ActivityIndicator style={globalStyles.absolute} animating={loadingImage} />
          </View>
        )}
        <View style={styles.cardDetailsContainer}>
          <View style={styles.cardLocationContainer}>
            {item.distance && (
              <Text style={textStyles.normalOfSize(14)}>
                {strings.distanceFromYou(hasLocation ? item.distance : null)}
              </Text>  
            )}
            
            <View style={styles.titleContainer}>
              <Text numberOfLines={1} minimumFontScale={0.9} adjustsFontSizeToFit={true} style={styles.title}>{item.title}</Text>

              <Image
                style={styles.translateY(-1)}
                source={item.cleanness >= 3 ? require("../../assets/images/marker_explore_green.png") : require("../../assets/images/marker_explore_orange.png")}
              />
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <PlaceRating
              isCleanness={false}
              pointsToUnlock={settings.pointsForUnlock}
              small
              locked={placeLocked(user, item)}
              title={strings.placeScreen.crowdnessTitle(true)}
              image={require("../../assets/images/HowBusy.png")}
              color={item.crowdnessColor}
              rating={item.crowdness}
            />

            <PlaceRating
              isCleanness={true}
              small
              leftMargin={smallScreen ? 20 : 40}
              title={strings.placeScreen.cleannessTitle(placeLocked(user, item))}
              image={require("../../assets/images/Heart.png")}
              color={item.cleannessColor}
              rating={item.cleanness}
            />
          </View>
        </View>
      </TouchableOpacity>      
    </Animatable.View>

  );
};

const styles = StyleSheet.create({
 
  titleSpacer: {
    flexGrow: 1, minWidth: 4
  },

  title: {
    ...textStyles.boldOfSize(16),
    flexGrow: 1, flexShrink: 1
  },

  placeImageContainer: {
    flexGrow: 1,
    flexShrink: 1,
    width: '100%',
    ...globalStyles.centerChildren
  },

  lottie: {
    width: 28,
    height: 28
  },

  headerTitle: {
    ...textStyles.normalOfSize(16),
    flexGrow: 1,
    flexShrink: 1,
    paddingRight: 8,
    paddingLeft: 4,
  },

  headerInnerContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.treeBlues,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  headerContainer: {
    paddingTop: 4,
    paddingBottom: 23,
    backgroundColor: 'white'
  },

  bottomBorder: (height) => ({ 
    transform: [{scaleY: height}, {translateY: 1}],
    height: 1,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: colors.treeBlues
  }),

  searchOnImage: (opacity) => ({
    position: 'absolute',
    resizeMode: 'contain',
    opacity
  }),

  searchOffImage: (opacity) => ({
    resizeMode: 'contain',
    opacity
  }),

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

  listsContainer: (translateX) => ({
    marginTop: 34, // this is new - remove if needed
    flex: 1,
    width: '100%',
    transform: [{translateX}]
  }),

  translateY: (translateY) => ({
    transform: [{ translateY }],
  }),

  titleContainer: {
    paddingRight: 4,
    flexGrow: 1,
    flexShrink: 1, 
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: 'flex-end'
  },

  cardLocationContainer: {
    flexGrow: 1,
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
    // paddingVertical: 34,
    paddingBottom: 34,
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

  cardImage: (resizeMode) => ({
    resizeMode,
    borderTopLeftRadius: INNER_BORDER_RADIUS,
    borderTopRightRadius: INNER_BORDER_RADIUS,
    flexGrow: 1,
    flexShrink: 1,
    width: '100%',
    backgroundColor: colors.imageBg,
  }),

  cardDetailsContainer: {
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: smallScreen ? 8 : 16,
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

  searchContainer: {
    marginVertical: 4,
    marginHorizontal: 40,
    padding: 4,
    // height: 36,
    alignItems: "center",
    flexDirection: "row",
  },
  container: {
    flex: 1,
    backgroundColor: colors.clear,
  },

  searchScreenContainer: (marginLeft) => ({
    paddingTop: 30,
    borderTopLeftRadius: 30,
    flex: 1,
    backgroundColor: "white",
    transform: [{translateX: marginLeft}],
    marginTop: statusBarHeight,
    alignItems: "center",
  }),

  tapClose: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: -EXIT_SIZE,
    width: EXIT_SIZE,
  }
  
});

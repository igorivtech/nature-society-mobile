import React, { useContext, useEffect, useState, useCallback } from "react";
import { StyleSheet, Animated, SafeAreaView, View, Text, KeyboardAvoidingView } from "react-native";
import Modal from 'react-native-modal';
import { globalStyles } from "../../../values/styles";
import { SearchBar, SuggestPlaceView, TextCard, suggestionStyles } from "../../screens/ExploreScreen";
import { useKeyboard } from "../../../hooks/useKeyboard";
import { UserContext } from "../../../context/context";
import { useServer } from "../../../hooks/useServer";
import _ from "lodash";
import { NewReportLabel } from "./Slider";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { strings } from "../../../values/strings";
import { textStyles } from "../../../values/textStyles";
import { keyboardAwareBehaviour, NAV_DURATION, NAV_DURATION_CLOSE } from "../../../values/consts";

export const ModalSearch = ({ visible, setSearchVisible, selectItem, location }) => {

  const {searchPlaces, loadingSearch, suggestNewPlace, loadingSuggestion} = useServer();

  const [showSuggestion, setShowSuggestion] = useState(false);

  const {state} = useContext(UserContext);
  const {serverPlaces, token} = state;

  const [searchTerm, setSearchTerm] = useState("");

  const [places, setPlaces] = useState([]);

  const {top: topSafeAreaHeight} = useSafeAreaInsets();

  const [showLabel, setShowLabel] = useState(true);

  // useEffect(()=>{
  //   if (places.length === 0 && serverPlaces.length > 0 && searchTerm.length === 0) {
  //     setPlaces(serverPlaces);
  //   }
  // }, [serverPlaces])

  const [keyboardHeight] = useKeyboard();
  const [keyboardBottomPadding, setKeyboardBottomPadding] = useState(40);

  useEffect(() => {
    setKeyboardBottomPadding(40 + keyboardHeight);
  }, [keyboardHeight]);

  const closeSearch = useCallback(() => {
    setShowSuggestion(false);
    if (searchTerm.length > 0) {
      debounce.cancel();
      setSearchTerm("");
      setPlaces(serverPlaces);
    } else {
      setSearchVisible(false);
    }
  }, [searchTerm, serverPlaces]);

  const textChanged = useCallback((value) => {
    setShowSuggestion(false);
    setSearchTerm(value);
    debounce.cancel()
    if (value.length === 0) {
      setPlaces(serverPlaces);
    } else {
      debounce(value);
    }
  }, [serverPlaces]);

  const debounce = useCallback(_.debounce(async(searchVal) => {
    const p = await searchPlaces(searchVal, location);
    setShowLabel(false);
    setPlaces(p);
    if (p.length === 0) {
      setShowSuggestion(true);
    }
  }, 500), [location]);

  const hide = () => {
    setSearchVisible(false);
  };

  const suggestPlace = useCallback(() => {
    suggestNewPlace(searchTerm.trim(), token);
  }, [searchTerm])

  return (
    <Modal 
      hideModalContentWhileAnimating={true}
      style={styles.container}
      onBackButtonPress={hide} 
      isVisible={visible} 
      animationIn='fadeIn' 
      animationInTiming={NAV_DURATION}
      animationOut='fadeOut' 
      animationOutTiming={NAV_DURATION_CLOSE}
      useNativeDriver={true}
      backdropTransitionOutTiming={0}
    >
      <View style={styles.newReportLabelContainer(topSafeAreaHeight)}>
          <NewReportLabel />
        </View>
      <SafeAreaView style={globalStyles.baseContainer}>
        <View style={globalStyles.spacer(16)} />
        <SearchBar
          loadingSearch={loadingSearch}
          modal={true}
          searchTerm={searchTerm}
          searchOn={true}
          closeSearch={closeSearch}
          textChanged={textChanged}
        />
        <Animated.FlatList
          // scrollIndicatorInsets={styles.scrollInsets}
          style={styles.searchList}
          contentContainerStyle={styles.flatListContainer(
            keyboardBottomPadding
          )}
          keyboardDismissMode='interactive'
          data={places}
          ListEmptyComponent={()=>{
            if (showLabel) {
              return <Text style={textStyles.normalOfSize(30)}>{strings.reportScreen.searchNewPlace}</Text>
            } else {
              return <View />;
            }
          }}
          keyExtractor={(item) => item.key}
          renderItem={({ item, index }) => (
            <TextCard
              showItem={selectItem}
              item={item}
              index={index}
              searchTerm={searchTerm}
            />
          )}
        />
        <KeyboardAvoidingView behavior={keyboardAwareBehaviour} style={suggestionStyles.suggestionContainer(showSuggestion)}>
          <SuggestPlaceView loadingSuggestion={loadingSuggestion} searchTerm={searchTerm} showSuggestion={showSuggestion} suggestPlace={suggestPlace} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
    backgroundColor: 'white'
  },
  newReportLabelContainer: (topSafeAreaHeight) => ({
    position: 'absolute',
    top: topSafeAreaHeight,
    left: 0,
    right: 0,
    alignItems: 'center',
  }),
  flatListContainer: (keyboardBottomPadding) => ({
    paddingVertical: 34,
    paddingHorizontal: 40,
    paddingBottom: keyboardBottomPadding,
  }),
});

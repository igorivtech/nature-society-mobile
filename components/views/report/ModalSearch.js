import React, { useContext, useEffect, useState, useCallback } from "react";
import { StyleSheet, Animated, SafeAreaView, Modal } from "react-native";
import { globalStyles } from "../../../values/styles";
import { SearchBar, TextCard } from "../../screens/ExploreScreen";
import { useKeyboard } from "../../../hooks/useKeyboard";
import { UserContext } from "../../../context/context";
import { useServer } from "../../../hooks/useServer";
import _ from "lodash";

export const ModalSearch = ({ visible, setSearchVisible, selectItem, location }) => {

  const {searchPlaces, loadingSearch} = useServer();

  const {state} = useContext(UserContext);
  const {serverPlaces} = state;

  const [searchTerm, setSearchTerm] = useState("");

  const [places, setPlaces] = useState([]);

  useEffect(()=>{
    if (places.length === 0 && serverPlaces.length > 0 && searchTerm.length === 0) {
      setPlaces(serverPlaces);
    }
  }, [serverPlaces])

  const [keyboardHeight] = useKeyboard();
  const [keyboardBottomPadding, setKeyboardBottomPadding] = useState(40);

  useEffect(() => {
    setKeyboardBottomPadding(40 + keyboardHeight);
  }, [keyboardHeight]);

  const closeSearch = () => {
    if (searchTerm.length > 0) {
      setSearchTerm("");
      setPlaces(serverPlaces);
    } else {
      setSearchVisible(false);
    }
  };

  const textChanged = (value) => {
    setSearchTerm(value);
    debounce.cancel()
    if (value.length === 0) {
      setPlaces(serverPlaces);
    } else {
      debounce(value);
    }
  };

  const debounce = useCallback(_.debounce(async(searchVal) => {
    const p = await searchPlaces(searchVal, location);
    setPlaces(p);
  }, 500), [location]);

  return (
    <Modal visible={visible} animationType="fade">
      <SafeAreaView style={globalStyles.baseContainer}>
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
          data={places}
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
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flatListContainer: (keyboardBottomPadding) => ({
    paddingVertical: 34,
    paddingHorizontal: 40,
    paddingBottom: keyboardBottomPadding,
  }),
});

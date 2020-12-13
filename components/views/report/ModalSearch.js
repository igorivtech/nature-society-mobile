import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Animated, SafeAreaView, Modal } from "react-native";
import { globalStyles } from "../../../values/styles";
import { SearchBar, TextCard } from "../../screens/ExploreScreen";
import { useKeyboard } from "../../../hooks/useKeyboard";
import { UserContext } from "../../../context/context";

export const ModalSearch = ({ visible, setSearchVisible, selectItem }) => {

  const {state} = useContext(UserContext);
  const {serverPlaces} = state;

  const [searchTerm, setSearchTerm] = useState("");

  const [places, setPlaces] = useState([]);

  useEffect(() => {
    setPlaces(serverPlaces);
  }, []);

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
    if (value.length === 0) {
      setPlaces(serverPlaces);
    } else {
      const filtered = serverPlaces.filter((place) => {
        const s1 = place.title.toLowerCase();
        const s2 = value.toLowerCase();
        return s1.indexOf(s2) > -1;
      });
      setPlaces(filtered);
    }
  };

  return (
    <Modal visible={visible} animationType="fade">
      <SafeAreaView style={globalStyles.baseContainer}>
        <SearchBar
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

import React, { useRef, useState } from "react";
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
import { colors } from "../../values/colors";
import { DATA, NAV_CLOSE_TAP_SIZE } from "../../values/consts";
import { strings } from "../../values/strings";
import { textStyles } from "../../values/textStyles";

const EXIT_SIZE = 26;

export const ExploreScreen = ({ navigation }) => {
  const textInputRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOn, setSearchOn] = useState(false);

  const [places, setPlaces] = useState([]);

  useEffect(()=>{
    setPlaces(DATA);
  }, [])

  const closeSearch = () => {
    setSearchTerm("");
    setSearchOn(false);
    Keyboard.dismiss();
    // textInputRef.current.blur();
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={goBack} style={styles.tap}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      <SafeAreaView />

      <View style={styles.searchScreenContainer} onLayout={(a, b, c) => {

      }} >
        <View style={styles.searchContainer(searchOn)}>
          {searchOn ? (
            <TouchableOpacity onPress={closeSearch}>
              <Image
                source={require("../../assets/images/search_close_icon.png")}
              />
            </TouchableOpacity>
          ) : null}

          <TextInput
            ref={textInputRef}
            onFocus={() => setSearchOn(true)}
            onBlur={() => setSearchOn(false)}
            onChangeText={(value) => setSearchTerm(value)}
            value={searchTerm}
            selectionColor={colors.desertRock}
            placeholderTextColor={colors.treeBlues}
            placeholder={
              searchOn ? strings.exploreScreen.searchPlaceholder : ""
            }
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

        <FlatList
          contentContainerStyle={{
            paddingVertical: 34,
            paddingHorizontal: 40
          }}
          data={places}
          keyExtractor={(item)=>item.key}
          renderItem={({item, index})=>{
            console.log({item});
            return (
              <View style={{
                overflow: 'hidden',
                borderRadius: 15,
                width: '100%',
                aspectRatio: 1.7,
                backgroundColor: 'yellow',
                marginBottom: 24
              }}>
                
                <Image style={{
                  flexGrow: 1
                }} source={{uri: item.image}} />

                <View style={{
                  height: 80,
                  backgroundColor: 'cyan'
                }}>

                </View>

              </View>
            )
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

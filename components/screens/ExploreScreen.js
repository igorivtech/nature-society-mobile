import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { colors } from "../../values/colors";
import { NAV_CLOSE_TAP_SIZE } from "../../values/consts";
import { strings } from "../../values/strings";
import { textStyles } from "../../values/textStyles";

const EXIT_SIZE = 26;

export const ExploreScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => navigation.goBack()}
        style={styles.tap}
      >
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      <SafeAreaView />

      <View style={styles.searchContainer}>
        <View
          style={{
            borderBottomColor: colors.treeBlues,
            borderBottomWidth: 2,
            marginVertical: 4,
            marginHorizontal: 8,
            padding: 4,
            alignItems: "center",
            // backgroundColor: "cyan",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity onPress={() => { console.log("close text search"); }} >
            <Image source={require("../../assets/images/search_close_icon.png")} />
          </TouchableOpacity>

          <TextInput
            selectionColor={colors.desertRock}
            placeholderTextColor={colors.treeBlues}
            placeholder={strings.exploreScreen.searchPlaceholder}
            style={{
              paddingHorizontal: 8,
              flexGrow: 1,
              textAlign: "right",
              ...textStyles.normalOfSize(24),
              color: colors.treeBlues,
            }}
          />

          <Image source={require("../../assets/images/search_icon.png")} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.clear,
  },

  searchContainer: {
    paddingHorizontal: 40,
    paddingVertical: 30,
    borderTopLeftRadius: 30,
    flex: 1,
    backgroundColor: "white",
    marginLeft: EXIT_SIZE,
  },

  tap: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: EXIT_SIZE,
  },
});

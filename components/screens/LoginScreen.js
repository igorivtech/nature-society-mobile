import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { colors } from "../../values/colors";
import { CARD_RADIUS, width } from "../../values/consts";
import { strings } from "../../values/strings";
import { textStyles } from "../../values/textStyles";

export const LoginScreen = ({ navigation }) => {
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardContainer}>
        <Text style={styles.loginTitle}>{strings.loginScreen.title}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loginTitle: {
      ...textStyles.boldOfSize(24),
      color: colors.treeBlues,
      textAlign: 'right',
      width: '100%'
  },

  cardContainer: {
    alignItems: "center",
    justifyContent: 'space-between',
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 40,
    width: width - 2 * 30,
    alignSelf: "center",
    aspectRatio: 1 / 1.1,
    backgroundColor: "white",
    borderRadius: CARD_RADIUS,
    shadowOffset: {
      height: -4,
      width: 0,
    },
    shadowColor: "rgba(0, 0, 0, 0.035)",
    shadowRadius: 12,
    shadowOpacity: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.grass,
    alignItems: "center",
    justifyContent: "center",
  },
});

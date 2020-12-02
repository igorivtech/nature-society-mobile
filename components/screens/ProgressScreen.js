import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, SafeAreaView, TouchableOpacity } from "react-native";
import { colors } from "../../values/colors";
import { strings } from "../../values/strings";
import { textStyles } from "../../values/textStyles";
import {EXIT_SIZE} from "../screens/ExploreScreen";

export const ProgressScreen = ({navigation}) => {

  const [user, setUser] = useState(null);

  const goBack = () => {
    navigation.goBack();
  };

  const loginLogout = () => {
    if (user === null) {
      navigation.navigate('Login');
    } else {
      // logout
    }
  }

  return (
    <View style={styles.container}>

      <TouchableWithoutFeedback onPress={goBack} style={styles.tap}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      <SafeAreaView />

      <View style={styles.progressScreenContainer}>
        <TouchableOpacity onPress={loginLogout} style={styles.bottomButtonContainer}>
          <Text style={styles.bottomText}>{user ? strings.progressScreen.logout : strings.progressScreen.signup}</Text>
        </TouchableOpacity>
      </View>

      <SafeAreaView style={styles.bottomSafeAreaStyle}/>
    </View>
  );
};

const styles = StyleSheet.create({

  bottomButtonContainer: {
    bottom: 16,
    right: 32,          
    position: 'absolute',
    // borderBottomWidth: 1,
    // borderBottomColor: colors.treeBlues
  },

  bottomText: {
    ...textStyles.normalOfSize(18),
    textAlign: 'center',
    color: colors.treeBlues,
    textDecorationLine: 'underline'
  },

  bottomSafeAreaStyle: {
    backgroundColor: 'white',
    marginRight: EXIT_SIZE
  },

  progressScreenContainer: {
    paddingVertical: 30,
    borderTopRightRadius: 30,
    flex: 1,
    backgroundColor: "white",
    marginRight: EXIT_SIZE,
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.clear
  },
  tap: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: EXIT_SIZE,
  },
})
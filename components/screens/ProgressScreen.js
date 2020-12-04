import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, SafeAreaView, TouchableOpacity, Image } from "react-native";
import { colors } from "../../values/colors";
import { strings } from "../../values/strings";
import { textStyles } from "../../values/textStyles";
import {EXIT_SIZE} from "../screens/ExploreScreen";
import {Svg} from "expo";

export const ProgressScreen = ({navigation, route}) => {

  const [user, setUser] = useState(null);

  useEffect(()=>{
    if (route.params) {
      if (route.params.user !== null) {
        setUser(route.params.user);
      } else if (route.params.logout) {
        setUser(null);
      }
    }
  }, [route])

  const goBack = () => {
    navigation.goBack();
  };

  const loginLogout = () => {
    if (user === null) {
      navigation.navigate('Login');
    } else {
      navigation.navigate('Profile', { user });
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
          {user ? (
            <Image source={require("../../assets/images/settings_icon.png")} />
          ) : (
            <Text style={styles.bottomText}>{strings.progressScreen.signup}</Text>
          )}
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
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, SafeAreaView, TouchableOpacity, Image } from "react-native";
import { colors } from "../../values/colors";
import { strings } from "../../values/strings";
import { textStyles } from "../../values/textStyles";
import {EXIT_SIZE} from "../screens/ExploreScreen";
import { height, width } from "../../values/consts";
import Svg, {Path} from "react-native-svg";

const pathPadding = 0;

export const ProgressScreen = ({navigation, route}) => {

  const [user, setUser] = useState(null);
  const [pathWidth, setPathWidth] = useState(0);
  const [pathHeight, setPathHeight] = useState(0);

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

        <View onLayout={(e)=>{
          const {height, width} = e.nativeEvent.layout;
          setPathHeight(height);
          setPathWidth(width)
        }} style={{
          flex: 1,
          width: '100%',
          margin: 32,
          
          // padding
          backgroundColor: 'cyan'
        }}>
          <Svg style={{
            ...StyleSheet.absoluteFill,
            backgroundColor: 'red',
          }}>
            {pathHeight > 0 ? (
              <Path 
              d={`M${pathWidth/2},0 C${pathWidth-pathPadding},${pathHeight*0.25} ${pathPadding},${pathHeight*0.75} ${pathWidth/2},${pathHeight}`}
              fill="none"
              stroke="black"
              strokeWidth={2}
             />
            ) : null}
            
          </Svg>
        </View>

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
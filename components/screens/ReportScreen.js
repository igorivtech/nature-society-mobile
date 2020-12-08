import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated, Easing, SafeAreaView } from "react-native";
import { globalStyles } from "../../values/styles";
import LottieView from 'lottie-react-native';
import { colors } from "../../values/colors";
import { State, TapGestureHandler } from "react-native-gesture-handler";

export const ReportScreen = ({navigation}) => {

  const progress = useRef(new Animated.Value(0)).current;

  const animate = () => {
    const v = progress._value;
    if (v < 1 && v > 0) {
      return
    }
    Animated.timing(progress, {
      toValue: v === 0 ? 1 : 0,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease),
      duration: 1000
    }).start();
  }

  const tapClose = (event) => {
    if (event.nativeEvent.state === State.END) {
      navigation.goBack();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TapGestureHandler style={StyleSheet.absoluteFill} onHandlerStateChange={tapClose}>
        <View style={StyleSheet.absoluteFill} />
      </TapGestureHandler>
      <View style={styles.cardContainer}>
        <LottieView source={require('../../assets/animations/rainbow.json')} progress={progress} resizeMode='contain' />
        <TouchableWithoutFeedback onPress={animate}>
          <Text style={styles.dummyText}>ReportScreen</Text>
        </TouchableWithoutFeedback>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    backgroundColor: colors.grass,
  },
  dummyText: {
    transform: [{translateY: -100}],
    color: colors.darkWithTone,
  },
  cardContainer: {
    ...globalStyles.shadow,
    borderRadius: 22.5,
    marginHorizontal: 30,
    marginVertical: 45,
    backgroundColor: 'white',
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
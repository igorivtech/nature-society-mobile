import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated, Easing } from "react-native";
import { styles } from "../../values/styles";
import LottieView from 'lottie-react-native';

export const ReportScreen = ({navigation}) => {

  const progress = useRef(new Animated.Value(0)).current;

  const animate = () => {
    const toValue = progress._value == 0 ? 1 : 0
    console.log({toValue, v: progress._value});
    Animated.timing(progress, {
      toValue,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease),
      duration: 1000
    }).start();
  }

  return (
    <View style={styles.container}>
      <LottieView source={require('../../assets/animations/rainbow.json')} progress={progress} />
      <TouchableWithoutFeedback style={StyleSheet.absoluteFill} onPress={animate}>
        <Text style={{
          transform: [{translateY: -100}]
        }}>ReportScreen</Text>
      </TouchableWithoutFeedback>
    </View>
  );
};

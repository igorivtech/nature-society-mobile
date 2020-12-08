import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated, Easing, SafeAreaView } from "react-native";
import { globalStyles } from "../../values/styles";
import LottieView from 'lottie-react-native';
import { colors } from "../../values/colors";
import { TapView } from "../views/general";
import { height } from "../../values/consts";
import { PanGestureHandler, State } from "react-native-gesture-handler";

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

  const tapClose = () => {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <TapView onPress={tapClose} />
      <View style={styles.cardContainer}>
        <LottieView source={require('../../assets/animations/rainbow.json')} progress={progress} resizeMode='contain' />
        <TouchableWithoutFeedback onPress={animate}>
          <Text style={styles.dummyText}>ReportScreen</Text>
        </TouchableWithoutFeedback>

        <Slider />

      </View>
    </SafeAreaView>
  );
};

const THUMB_RADIUS = 22.5 / 2;
const SLIDER_HEIGHT = 347;
const SLIDER_CONTAINER_HEIGHT = SLIDER_HEIGHT + 2*THUMB_RADIUS;
const THUMB_COLORS = ['#F5B345', '#E8D13F', '#C4E055', '#80E268', '#3EDF7E']

const Slider = ({}) => {

  const progress = useRef(new Animated.Value(0)).current;
  const thumbColor = progress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: THUMB_COLORS,
    extrapolate: 'clamp',
  })

  const thumbTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SLIDER_HEIGHT],
    extrapolate: 'clamp',
    useNativeDriver: true
  })

  const currentOffset = useRef(0);

  const panHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      const v = progress._value;
      if (v < 0) {
        progress.setValue(0);
        currentOffset.current = 0;
      } else if (v > 1) {
        progress.setValue(1);
        currentOffset.current = 1;
      } else {
        currentOffset.current = v;
      } 
    }
  }

  const panHandlerEvent = (event) => {
    progress.setValue(currentOffset.current + (-event.nativeEvent.translationY/SLIDER_HEIGHT));
  }

  return (
    <View style={{
      position: 'absolute',
      right: 16,
      bottom: 147,
      
    }}>
      <View style={{
        height: SLIDER_CONTAINER_HEIGHT,
        width: THUMB_RADIUS*2,
        backgroundColor: '#EEE',
        alignItems: 'center',
        justifyContent: 'center'
      }}>

        <View style={{
          opacity: 0.15,
          height: SLIDER_HEIGHT,
          backgroundColor: '#202224',
          width: 1,
        }} />

        <PanGestureHandler onHandlerStateChange={panHandlerStateChange} onGestureEvent={panHandlerEvent}>
          <Animated.View style={{
            height: 2*THUMB_RADIUS,
            width: 2*THUMB_RADIUS,
            borderRadius: THUMB_RADIUS,
            backgroundColor: thumbColor,
            position: 'absolute',
            bottom: 0,
            transform: [
              {translateY: thumbTranslateY}
            ]
          }} />
        </PanGestureHandler>

      </View>
    </View>
    
  )
}

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
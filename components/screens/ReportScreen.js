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

  const tapClose = () => {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <TapView onPress={tapClose} />
      <View style={styles.cardContainer}>
        <LottieView source={require('../../assets/animations/rainbow.json')} progress={progress} resizeMode='contain' />
        <Text style={styles.dummyText}>ReportScreen</Text>
        <Slider initialValue={0.5} animationProgress={progress} />

      </View>
    </SafeAreaView>
  );
};

const THUMB_RADIUS = 22.5 / 2;
const SLIDER_HEIGHT = 347;
const SLIDER_CONTAINER_HEIGHT = SLIDER_HEIGHT + 2*THUMB_RADIUS;
const THUMB_COLORS = ['#F5B345', '#E8D13F', '#C4E055', '#80E268', '#3EDF7E']

const Slider = ({initialValue, animationProgress}) => {

  useEffect(()=>{
    animationProgress.setValue(initialValue);
  }, [])

  const currentOffset = useRef(initialValue);
  const progress = useRef(new Animated.Value(initialValue)).current;

  const thumbColor = progress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: THUMB_COLORS,
    extrapolate: 'clamp',
    useNativeDriver: true
  })

  const thumbTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SLIDER_HEIGHT],
    extrapolate: 'clamp',
    useNativeDriver: true
  })

  const panHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      currentOffset.current = progress._value;
    }
  }

  const panHandlerEvent = (event) => {
    let p = currentOffset.current + (-event.nativeEvent.translationY/SLIDER_HEIGHT);
    if (p < 0) {
      p = 0;
    } else if (p > 1) {
      p = 1
    }
    progress.setValue(p);
    animationProgress.setValue(p);
  }

  return (
    <View style={sliderStyles.container}>
      <View style={sliderStyles.sliderContainer}>
        <View style={sliderStyles.middleLine} />
        <PanGestureHandler onHandlerStateChange={panHandlerStateChange} onGestureEvent={panHandlerEvent}>
          <Animated.View style={sliderStyles.thumb(thumbColor, thumbTranslateY)} />
        </PanGestureHandler>
      </View>
    </View>
  )
}

const sliderStyles = StyleSheet.create({

  container: {
    position: 'absolute',
    right: 16,
    bottom: 147,
  },

  sliderContainer: {
    height: SLIDER_CONTAINER_HEIGHT,
    width: THUMB_RADIUS*2,
    alignItems: 'center',
    justifyContent: 'center'
  },

  middleLine: {
    opacity: 0.15,
    height: SLIDER_HEIGHT,
    backgroundColor: '#202224',
    width: 1,
  },
  thumb: (thumbColor, thumbTranslateY) => ({
    height: 2*THUMB_RADIUS,
    width: 2*THUMB_RADIUS,
    borderRadius: THUMB_RADIUS,
    backgroundColor: thumbColor,
    position: 'absolute',
    bottom: 0,
    transform: [
      {translateY: thumbTranslateY}
    ]
  })
})

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
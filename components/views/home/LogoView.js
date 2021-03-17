import React, { memo } from "react";
import { Animated, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
// import { SPACER_ITEM_SIZE } from "./PlaceCard";
// import * as WebBrowser from 'expo-web-browser';

export const LogoView = memo(({listYTranslate, bottomHeight, bottomSafeAreaHeight, logoOpacity}) => {

  const opacity = listYTranslate.interpolate({
    inputRange: [0, bottomHeight],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  })
  const scale = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
    extrapolate: 'clamp'
  })

  // const [popupVisible, setPopupVisible] = useState(false);

  // const onPress = () => {
  //   WebBrowser.openBrowserAsync('https://www.teva.org.il');
  // }

  // const actionRef = useRef(onPress);

  // const localOnPress = () => {
  //   setPopupVisible(true);
  // }
  return (
    <Animatable.View delay={700} animation='fadeIn' pointerEvents='none' style={styles.logo(bottomSafeAreaHeight, bottomHeight, logoOpacity)}>
      <Animated.Image style={styles.image(opacity, scale)} source={require("../../../assets/images/hala_logo.png")} />
    </Animatable.View>
  );
});

const styles = StyleSheet.create({
  image: (opacity, scale) => ({
    resizeMode: 'contain',
    opacity, 
    transform: [{scale}]
  }),
  logo: (bottomSafeAreaHeight, bottomHeight, opacity) => ({
    opacity,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    right: 0,
    bottom: bottomSafeAreaHeight + bottomHeight/2 - 67/2
  })
})
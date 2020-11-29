import { TransitionPresets } from "@react-navigation/stack";
import { Easing } from "react-native";
import { NAV_DURATION } from "./consts";

const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

export const options = {
  navigation: {
    ...TransitionPresets.SlideFromRightIOS,
    // gestureEnabled: isAndroid ? false : true,
    headerTransparent: true,
    headerTintColor: "white",
    title: "",
    headerBackTitleVisible: false,
  },
  headerOff: { headerShown: false, cardStyleInterpolator: forFade },
  headerOffWithAnimation: (isSignout) => ({
    headerShown: false,
    animationTypeForReplace: isSignout ? "pop" : "push",
  }),
};


export const fadeOptions = () => ({
  gestureEnabled: false,
  transitionSpec: {
    open: {
      animation: "timing",
      config: { duration: NAV_DURATION, easing: Easing.inOut(Easing.ease) },
    },
    close: {
      animation: "timing",
      config: { duration: NAV_DURATION, easing: Easing.inOut(Easing.ease) },
    },
  },
  cardStyleInterpolator: ({ current: { progress } }) => {
    return {
      cardStyle: {
        opacity: progress,
      },
    };
  },
});
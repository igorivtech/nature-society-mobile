import { TransitionPresets } from "@react-navigation/stack";
import { Easing } from "react-native";
import { height, NAV_DURATION, NAV_DURATION_CLOSE, width } from "./consts";

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
      config: { duration: NAV_DURATION_CLOSE, easing: Easing.inOut(Easing.ease) },
    },
  },
  cardStyleInterpolator: ({ current: { progress } }) => {
    return {
      cardStyle: {
        opacity: progress,
      },
    };
  },
  cardStyle: {
    backgroundColor: 'transparent',
  }
});

export const slideFromRightOptions = () => ({
  gestureEnabled: false,
  transitionSpec: {
    open: {
      animation: "timing",
      config: { duration: NAV_DURATION, easing: Easing.inOut(Easing.ease) },
    },
    close: {
      animation: "timing",
      config: { duration: NAV_DURATION_CLOSE, easing: Easing.inOut(Easing.ease) },
    },
  },
  cardStyleInterpolator: ({ current: { progress } }) => {
    return {
      cardStyle: {
        transform: [
          {translateX: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [width, 0]
          })}
        ]
      },
    };
  },
  cardStyle: {
    backgroundColor: 'transparent',
  }
});

export const slideFromLeftOptions = () => ({
  gestureEnabled: false,
  transitionSpec: {
    open: {
      animation: "timing",
      config: { duration: NAV_DURATION, easing: Easing.inOut(Easing.ease) },
    },
    close: {
      animation: "timing",
      config: { duration: NAV_DURATION_CLOSE, easing: Easing.inOut(Easing.ease) },
    },
  },
  cardStyleInterpolator: ({ current: { progress } }) => {
    return {
      cardStyle: {
        transform: [
          {translateX: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-width, 0]
          })}
        ]
      },
    };
  },
  cardStyle: {
    backgroundColor: 'transparent',
  }
});

export const slideFromBottomOptions = () => ({
  gestureEnabled: false,
  transitionSpec: {
    open: {
      animation: "timing",
      config: { duration: NAV_DURATION, easing: Easing.inOut(Easing.ease) },
    },
    close: {
      animation: "timing",
      config: { duration: NAV_DURATION_CLOSE, easing: Easing.inOut(Easing.ease) },
    },
  },
  cardStyleInterpolator: ({ current: { progress } }) => {
    return {
      cardStyle: {
        transform: [
          {translateY: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [height, 0]
          })}
        ],
        opacity: progress
      },
    };
  },
  cardStyle: {
    backgroundColor: 'transparent',
  }
});
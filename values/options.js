import { Easing } from "react-native";
import { height, NAV_DURATION, NAV_DURATION_CLOSE, width } from "./consts";

const transparent = {
  cardStyle: { backgroundColor: "transparent" },
  cardOverlayEnabled: false,
  gestureEnabled: false,
}

const transitionSpec = {
  open: {
    animation: "timing",
    config: { duration: NAV_DURATION, easing: Easing.inOut(Easing.ease) },
  },
  close: {
    animation: "timing",
    config: { duration: NAV_DURATION_CLOSE, easing: Easing.inOut(Easing.ease) },
  },
};

export const fadeOptions = () => ({
  ...transparent,
  transitionSpec,
  cardStyleInterpolator: ({ current: { progress } }) => {
    return {
      cardStyle: {
        opacity: progress,
      },
    };
  },
});

export const slideFromRightOptions = () => ({
  ...transparent,
  transitionSpec,
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
});

export const slideFromLeftOptions = () => ({
  ...transparent,
  transitionSpec,
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
});

export const slideFromBottomOptions = () => ({
  ...transparent,
  transitionSpec,
  cardStyleInterpolator: ({ current: { progress } }) => {
    return {
      cardStyle: {
        transform: [
          {translateY: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [height, 0]
          })}
        ],
      },
    };
  },
});
import { TransitionPresets } from "@react-navigation/stack";

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

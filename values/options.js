import { TransitionPresets } from "@react-navigation/stack";

export const options = {
  navigation: {
    ...TransitionPresets.SlideFromRightIOS,
    // gestureEnabled: isAndroid ? false : true,
    headerTransparent: true,
    headerTintColor: "white",
    title: "",
    headerBackTitleVisible: false,
  },
  headerOff: { headerShown: false },
  headerOffWithAnimation: (isSignout) => ({
    headerShown: false,
    animationTypeForReplace: isSignout ? "pop" : "push",
  }),
};

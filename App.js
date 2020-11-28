import { StatusBar } from "expo-status-bar";
import React from "react";
import { Easing } from "react-native";

import { AppLoading } from "expo";
import { fontsLoader } from "./values/fonts";

import { enableScreens } from "react-native-screens";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { NavigationContainer } from "@react-navigation/native";

import { options } from "./values/options";

import { OnboardingScreen } from "./components/screens/OnboardingScreen";
import { HomeScreen } from "./components/screens/HomeScreen";
import { NAV_DURATION } from "./values/consts";

enableScreens();

const HomeStack = createSharedElementStackNavigator();

export default function App() {
  const { fontsLoaded } = fontsLoader();

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <HomeStack.Navigator initialRouteName="Onboarding" headerMode="none">
        <HomeStack.Screen name="Onboarding" component={OnboardingScreen} />
        <HomeStack.Screen
          name="Home"
          component={HomeScreen}
          options={() => ({
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
          })}
        />
      </HomeStack.Navigator>
    </NavigationContainer>
  );
}

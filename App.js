import { StatusBar } from "expo-status-bar";
import React from "react";
import { options } from "./values/options";

import { AppLoading } from "expo";

import { OnboardingScreen } from "./components/screens/OnboardingScreen";
import { HomeScreen } from "./components/screens/HomeScreen";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { fontsLoader } from "./values/fonts";

const HomeStack = createStackNavigator();

export default function App() {
  const { fontsLoaded } = fontsLoader();

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <HomeStack.Navigator screenOptions={options.navigation}>
        <HomeStack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={options.headerOff}
        />
        <HomeStack.Screen
          name="Home"
          component={HomeScreen}
          options={options.headerOff}
        />
      </HomeStack.Navigator>
    </NavigationContainer>
  );
}

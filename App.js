import { StatusBar } from "expo-status-bar";
import React from "react";
//
import { AppLoading } from "expo";
import { fontsLoader } from "./values/fonts";
import { fadeOptions } from "./values/options";
//
import { enableScreens } from "react-native-screens";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { NavigationContainer } from "@react-navigation/native";
//
import { OnboardingScreen } from "./components/screens/OnboardingScreen";
import { HomeScreen } from "./components/screens/HomeScreen";
import PlaceScreen from "./components/screens/PlaceScreen";


enableScreens();
const HomeStack = createSharedElementStackNavigator();

export default function App() {
  const { fontsLoaded } = fontsLoader();

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <HomeStack.Navigator initialRouteName="Home" headerMode="none">
        <HomeStack.Screen name="Onboarding" component={OnboardingScreen} />
        <HomeStack.Screen
          name="Home"
          component={HomeScreen}
          options={fadeOptions}
        />
        <HomeStack.Screen
          name="Place"
          component={PlaceScreen}
          options={fadeOptions}
        />
      </HomeStack.Navigator>
    </NavigationContainer>
  );
}

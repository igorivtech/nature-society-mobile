import { StatusBar } from "expo-status-bar";
import React, { useReducer, useEffect, useRef } from "react";
import {Platform, UIManager, Text, TextInput, Image} from 'react-native';
//
import { AppLoading } from "expo";
import * as SplashScreen from 'expo-splash-screen';
import { fontsLoader } from "./values/fonts";
import {
  fadeOptions,
  slideFromBottomOptions,
  slideFromLeftOptions,
  slideFromRightOptions,
} from "./values/options";
//
import { enableScreens } from "react-native-screens";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { NavigationContainer } from "@react-navigation/native";
//
import { OnboardingScreen } from "./components/screens/OnboardingScreen";
import { HomeScreen } from "./components/screens/HomeScreen";
import { PlaceScreen } from "./components/screens/PlaceScreen";
import { ExploreScreen } from "./components/screens/ExploreScreen";
import { ProgressScreen } from "./components/screens/ProgressScreen";
import { ReportScreen } from "./components/screens/ReportScreen";
import { LoginScreen } from "./components/screens/LoginScreen";
import { ProfileScreen } from "./components/screens/ProfileScreen";
import { UserContext } from "./context/context"
import { initialState, reducer } from "./context/userReducer";
import { useOnboarding } from "./hooks/memory";
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import { useUser } from "./hooks/useUser";
import { useUserUsageTime } from "./hooks/useUserUsageTime";
import { useNotifications } from "./hooks/useNotifications";
import NetInfo from '@react-native-community/netinfo';
import { SPLASH_HIDE_DELAY } from "./values/consts";
import { useDeepLink } from "./hooks/useDeepLink";
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import Portal from '@burstware/react-native-portal';
import { useRTL } from "./hooks/useRTL";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

Amplify.configure(awsconfig);
enableScreens();
const HomeStack = createSharedElementStackNavigator();

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
// maxFontSizeMultiplier
Image.defaultProps = Image.defaultProps || {};
Image.defaultProps.accessible = false;

export default function App() {

  const { fontsLoaded } = fontsLoader();
  const { onboardingShown, loadingOnboarding } = useOnboarding();
  const [state, dispatch] = useReducer(reducer, initialState);
  const {loadingUser} = useUser(dispatch);
  const splashShown = useRef(false);
  const {loadingRTL} = useRTL();
  
  useNotifications(state, dispatch);
  useUserUsageTime(state);
  useDeepLink(dispatch);

  useEffect(()=>{
    SplashScreen.preventAutoHideAsync();
    //
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
    });
    return unsubscribe;
  },[])

  useEffect(()=>{
    if (fontsLoaded && !loadingOnboarding && !loadingUser && !loadingRTL) {
      if (!splashShown.current) {
        splashShown.current = true;
        setTimeout(SplashScreen.hideAsync, SPLASH_HIDE_DELAY);
      }
    }
  }, [fontsLoaded, loadingOnboarding, loadingUser, loadingRTL])

  const contextValue = React.useMemo(() => ({
    state,
    dispatch
  }), [state, dispatch]);

  if (!fontsLoaded || loadingOnboarding || loadingUser || loadingRTL) {
    return <AppLoading />;
  }

  return (
    <UserContext.Provider value={contextValue}>
      <StatusBar style='auto' />
      <Portal.Host>
        <ActionSheetProvider>
          <NavigationContainer>
            <HomeStack.Navigator initialRouteName={onboardingShown ? "Home" : "Onboarding"} headerMode="none">
              <HomeStack.Screen name="Onboarding" component={OnboardingScreen} />
              <HomeStack.Screen name="Home" component={HomeScreen} options={fadeOptions} />
              <HomeStack.Screen name="Place" component={PlaceScreen} options={slideFromBottomOptions} />
              <HomeStack.Screen name="Explore" component={ExploreScreen} options={slideFromRightOptions} />
              <HomeStack.Screen name="Progress" component={ProgressScreen} options={slideFromLeftOptions} />
              <HomeStack.Screen name="Report" component={ReportScreen} options={slideFromBottomOptions} />
              <HomeStack.Screen name="Login" component={LoginScreen} options={fadeOptions} />
              <HomeStack.Screen name="Profile" component={ProfileScreen} options={fadeOptions} />
            </HomeStack.Navigator>
          </NavigationContainer>    
        </ActionSheetProvider>
      </Portal.Host>
    </UserContext.Provider>
  );
}

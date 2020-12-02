import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Keyboard,
} from "react-native";
import { State, TapGestureHandler } from "react-native-gesture-handler";
import { colors } from "../../values/colors";
import {useKeyboard} from '../../hooks/useKeyboard'
import { LoginView, SignupView } from "../views/login/views";

export const LoginScreen = ({ navigation }) => {

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [scrollEnabled, setScrollEnabled] = useState(false);
  
  const [keyboardHeight] = useKeyboard();
  const [paddingBottom, setPaddingBottom] = useState(0);

  useEffect(() => {
    setPaddingBottom(keyboardHeight);
    setScrollEnabled(keyboardHeight > 0);
  }, [keyboardHeight]);

  const onNameChanged = (value) => {
    setName(value);
  };

  const onEmailChanged = (value) => {
    setEmail(value);
  };

  const onPasswordChanged = (value) => {
    setPassword(value);
  };

  const goBack = () => {
    navigation.goBack();
  };

  const login = () => {
    if (isLogin) {

    } else {
      setIsLogin(true);
    }
  }

  const signup = () => {
    if (isLogin) {
      setIsLogin(false);
    } else {
      
    }
  }

  const forgotPassword = () => {
    console.log("forgotPassword");
  }

  const tapClose = (event) => {
    if (event.nativeEvent.state === State.END) {
      if (keyboardHeight > 0) {
        Keyboard.dismiss();
      } else {
        goBack();
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView scrollEnabled={scrollEnabled} contentContainerStyle={styles.scrollView(paddingBottom)}>
        <TapGestureHandler onHandlerStateChange={tapClose}>
          <View style={StyleSheet.absoluteFill} />
        </TapGestureHandler>
        <View>

          {isLogin ? (<LoginView
            email={email}
            onEmailChanged={onEmailChanged}
            password={password}
            onPasswordChanged={onPasswordChanged}
            forgotPassword={forgotPassword}
            login={login}
            signup={signup}
          />) : (<SignupView
            name={name}
            onNameChanged={onNameChanged}
            email={email}
            onEmailChanged={onEmailChanged}
            password={password}
            onPasswordChanged={onPasswordChanged}
            forgotPassword={forgotPassword}
            login={login}
            signup={signup}
          />)}
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  scrollView: (paddingBottom) => ({
    justifyContent: "center",
    flexGrow: 1,
    paddingBottom,
    alignItems: 'center',
    paddingHorizontal: 30
  }),

  container: {
    flex: 1,
    backgroundColor: colors.grass,
    alignItems: "center",
    justifyContent: "center",
  },
});

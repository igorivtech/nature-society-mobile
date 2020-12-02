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
import * as ImagePicker from 'expo-image-picker';

export const LoginScreen = ({ navigation }) => {

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  
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

  const onLoginEmailChanged = (value) => {
    setLoginEmail(value);
  };

  const onLoginPasswordChanged = (value) => {
    setLoginPassword(value);
  };

  const onSignupEmailChanged = (value) => {
    setSignupEmail(value);
  };

  const onSignupPasswordChanged = (value) => {
    setSignupPassword(value);
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

  const selectImage = async () => {
    setLoadingImage(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //allowsEditing: true,
      //aspect: [4, 3],
      quality: 0.75,
    });
    console.log(result);
    if (!result.cancelled) {
      setImage(result);
    }
    setLoadingImage(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView scrollEnabled={scrollEnabled} contentContainerStyle={styles.scrollView(paddingBottom)}>
        <TapGestureHandler onHandlerStateChange={tapClose}>
          <View style={StyleSheet.absoluteFill} />
        </TapGestureHandler>
        <View style={styles.popupsContainer}>

          <LoginView
            visible={isLogin}
            email={loginEmail}
            onEmailChanged={onLoginEmailChanged}
            password={loginPassword}
            onPasswordChanged={onLoginPasswordChanged}
            forgotPassword={forgotPassword}
            login={login}
            signup={signup}
          />
          <SignupView
            image={image}
            loadingImage={loadingImage}
            selectImage={selectImage}
            visible={!isLogin}
            name={name}
            onNameChanged={onNameChanged}
            email={signupEmail}
            onEmailChanged={onSignupEmailChanged}
            password={signupPassword}
            onPasswordChanged={onSignupPasswordChanged}
            login={login}
            signup={signup}
          />
          
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

  popupsContainer: {
    justifyContent: 'center'
  }
});

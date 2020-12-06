import React, { useContext, useEffect, useRef, useState } from "react";
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
import { EmailSentView, ForgotPasswordView, LoginView, NewPasswordView, SignupView } from "../views/login/views";
import * as ImagePicker from 'expo-image-picker';
import { DEFAULT_USER, height, width } from "../../values/consts";
import { UserContext } from "../../context/context";
import { SAVE_USER } from "../../context/userReducer";

const scrollZero = {
  y: 0,
  animated: true,
}

const yael = {
  name: "יעל השכנה",
  email: "yael@nextdoor",
  image: "https://cdn.iconscout.com/icon/premium/png-256-thumb/woman-avatar-1543937-1371628.png"
}

export const LoginScreen = ({ navigation }) => {

  const {state, dispatch} = useContext(UserContext);

  const [loginVisible, setLoginVisible] = useState(true);
  const [signupVisible, setSignupVisible] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [emailSentVisible, setEmailSentVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);

  const [name, setName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [restoreEmail, setRestoreEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [keyboardHeight] = useKeyboard();
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [safeAreaHeight, setSafeAreaHeight] = useState(height);

  const scrollRef = useRef();

  useEffect(() => {
    setPaddingBottom(Math.max(keyboardHeight - 100, 0));
    setScrollEnabled(keyboardHeight > 0);
    if (keyboardHeight === 0) {
      scrollRef.current.scrollTo(scrollZero);
    } else {
      setTimeout(() => {
        scrollRef.current.scrollTo({
          y: height*0.15,
          animated: true,
        });  
      }, 100);
    }
  }, [keyboardHeight]);

  const selectImage = async () => {
    setLoadingImage(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      // aspect: [4, 3],
      quality: 0.75,
    });
    // console.log(result);
    if (!result.cancelled) {
      setImage(result);
    }
    setLoadingImage(false);
  };

  const onSafeAreaLayout = (event) => {
    setSafeAreaHeight(event.nativeEvent.layout.height);
  }

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

  const onNewPasswordChanged = (value) => {
    setNewPassword(value);
  };

  const goBack = () => {
    if (emailSentVisible || newPasswordVisible) {
      return;
    }
    if (forgotPasswordVisible || signupVisible) {
      login();
    } else {
      navigation.goBack();
    }
  };

  const login = () => {
    if (loginVisible) {
      if (loginEmail.trim() && loginPassword.length > 0) {
        saveUser({
          name: name.trim() !== "" ? name.trim() : yael.name,
          email: loginEmail.trim(),
          image: image ? image.uri : yael.image
        });
      }
    } else {
      setLoginVisible(true);
      setSignupVisible(false);
      setForgotPasswordVisible(false);
      setNewPasswordVisible(false);
    }
  }

  const signup = () => {
    if (signupVisible) {
      if (name.trim() !== "" && signupEmail.trim() && signupPassword.length > 0) {
        saveUser({
          name: name.trim(),
          email: signupEmail.trim(),
          image: image ? image.uri : yael.image
        });
      }
    } else {
      setSignupVisible(true);
      setLoginVisible(false);
      setForgotPasswordVisible(false);
      setNewPasswordVisible(false);
    }
  }

  const saveUser = (user) => {
    dispatch({
      type: SAVE_USER,
      payload: {
        ...DEFAULT_USER,
        ...user
      }
    })
    navigation.navigate("Progress");
  }

  const forgotPassword = () => {
    if (forgotPasswordVisible) {
      console.log("forgotPassword");
    } else {
      setRestoreEmail(loginEmail);
      setForgotPasswordVisible(true);
      setLoginVisible(false);
      setSignupVisible(false);
      setNewPasswordVisible(false);
    }
  }

  const tapClose = (event) => {
    if (event.nativeEvent.state === State.END) {
      if (keyboardHeight > 0 ) {
        Keyboard.dismiss();
      } else {
        goBack();
      }
    }
  }

  const restorePassword = () => {
    if (restoreEmail.length > 0) {
      setEmailSentVisible(true);
      setForgotPasswordVisible(false);
    }
  }

  const gotIt = () => {
    setNewPasswordVisible(true);
    setEmailSentVisible(false);
  }

  const changePassword = () => {
    if (newPassword.length > 0) {
      setLoginEmail(restoreEmail);
      setLoginPassword(newPassword);
      login();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView onLayout={onSafeAreaLayout} ref={scrollRef} scrollEnabled={scrollEnabled} contentContainerStyle={styles.scrollView(paddingBottom)}>

        <View style={styles.popupsContainer(safeAreaHeight)}>

          <TapGestureHandler onHandlerStateChange={tapClose}>
            <View style={StyleSheet.absoluteFill} />
          </TapGestureHandler>

          <LoginView
            visible={loginVisible}
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
            visible={signupVisible}
            name={name}
            onNameChanged={onNameChanged}
            email={signupEmail}
            onEmailChanged={onSignupEmailChanged}
            password={signupPassword}
            onPasswordChanged={onSignupPasswordChanged}
            login={login}
            signup={signup}
          />

          <ForgotPasswordView 
            visible={forgotPasswordVisible}
            email={restoreEmail}
            onEmailChanged={setRestoreEmail}
            restorePassword={restorePassword}
          />

          <EmailSentView visible={emailSentVisible} gotIt={gotIt} />
          
          <NewPasswordView 
            visible={newPasswordVisible}
            newPassword={newPassword}
            onNewPasswordChanged={onNewPasswordChanged}
            changePassword={changePassword}
          />

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    backgroundColor: colors.grass,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollView: (paddingBottom) => ({
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: "center",
    paddingBottom,
  }),

  popupsContainer: (height) => ({
    height,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  })
});

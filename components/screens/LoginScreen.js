import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Keyboard,
} from "react-native";
import { State, TapGestureHandler } from "react-native-gesture-handler";
import { colors } from "../../values/colors";
import {useKeyboard} from '../../hooks/useKeyboard'
import { EmailSentView, ForgotPasswordView, LoginView, NewPasswordView, SignupView } from "../views/login/views";
import { errors, height, isAndroid, smallScreen, width } from "../../values/consts";
import { UserContext } from "../../context/context";
import { SAVE_TOKEN, SAVE_USER } from "../../context/userReducer";
import { Popup } from "../views/Popup";
import { strings } from "../../values/strings";
import { askSettings } from "../../hooks/usePermissions";
import { Auth } from 'aws-amplify';
import { useUploadImage } from "../../hooks/aws";
import { validateEmail } from "../../hooks/helpers";
import { ATTRIBUTE_NUM_OF_REPORTS, ATTRIBUTE_POINTS, ATTRIBUTE_UNLOCKED_PLACES, cognitoToUser, getToken } from "../../hooks/useUser";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import _ from "lodash";
import { useImage } from "../../hooks/useImage";

const PASSWORD_MIN_LENGTH = 8;
const DEFAULT_UNLOCKED_PLACES = [];

export const LoginScreen = ({ navigation, route }) => {

  const {state, dispatch} = useContext(UserContext);
  const {offlineUser} = state;

  const [errorData, setErrorData] = useState(strings.popups.empty);

  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);
  const [loadingRestorePassword, setLoadingRestorePassword] = useState(false);
  const [loadingChangePassword, setLoadingChangePassword] = useState(false);

  const [loginVisible, setLoginVisible] = useState(true);
  const [signupVisible, setSignupVisible] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [emailSentVisible, setEmailSentVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);

  const [name, setName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // const [loginEmail, setLoginEmail] = useState("nimmmm@gmail.com");
  // const [loginPassword, setLoginPassword] = useState("123123123");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [restoreEmail, setRestoreEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [code, onCodeChanged] = useState('');

  const {image, loadingImage, selectImage, imagePopupvisible, setPopupVisible} = useImage();
  
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [keyboardHeight] = useKeyboard();
  const [safeAreaHeight, setSafeAreaHeight] = useState(height);

  const [errorPopupVisible, setErrorPopupVisible] = useState(false);

  const {uploadImage} = useUploadImage();

  const scrollRef = useRef();

  useEffect(() => {
    debounce.cancel();
    debounce(keyboardHeight);
  }, [keyboardHeight]);

  const debounce = useCallback(_.debounce((keyboardHeight) => {
    setScrollEnabled(smallScreen && keyboardHeight > 0);
    if (isAndroid) {
      setScrollEnabled(keyboardHeight > 0);
    }
    if (keyboardHeight === 0) {
      scrollRef?.current.scrollToPosition(0, 0);
    } else {
      scrollRef?.current.scrollToPosition(0, height*0.15);
    }
  }, 250), []);

  const onSafeAreaLayout = (event) => {
    setSafeAreaHeight(event.nativeEvent.layout.height);
  }

  const onNameChanged = useCallback((value) => {
    setName(value);
  }, []);

  const onLoginEmailChanged = useCallback((value) => {
    setLoginEmail(value.trim());
  }, []);

  const onLoginPasswordChanged = useCallback((value) => {
    setLoginPassword(value);
  }, []);

  const onSignupEmailChanged = useCallback((value) => {
    setSignupEmail(value.trim());
  }, []);

  const onSignupPasswordChanged = useCallback((value) => {
    setSignupPassword(value);
  }, []);

  const onNewPasswordChanged = useCallback((value) => {
    setNewPassword(value);
  }, []);

  const onRestoreEmailChanged = useCallback((value) => {
    setRestoreEmail(value.trim());
  }, []);

  useEffect(()=>{
    const params = route.params;
    if (params != null) {
      if (params.register) {
        navigation.setParams({register: null});
        signup();
      }
    }
  }, [route])

  const goBack = useCallback(() => {
    if (emailSentVisible) {
      return;
    }
    if (newPasswordVisible || forgotPasswordVisible || signupVisible) {
      login();
    } else {
      navigation.goBack();
    }
  }, [emailSentVisible, newPasswordVisible, forgotPasswordVisible, signupVisible, navigation, login]);

  const login = useCallback(() => {
    if (loginVisible) {
      if (validateEmail(loginEmail) && loginPassword.length >= PASSWORD_MIN_LENGTH) {
        setLoadingLogin(true);
        Auth.signIn(loginEmail.trim(), loginPassword)
          .then(()=>Auth.currentAuthenticatedUser({bypassCache: true}))
          .then((cognitoUser)=>{
            saveUser(cognitoToUser(cognitoUser));
            dispatch({
              type: SAVE_TOKEN,
              payload: getToken(cognitoUser),
            });
          })
          .catch((error)=>handleError(error))
          .finally(()=>setLoadingLogin(false));
      } else {
        if (!validateEmail(loginEmail)) {
          handleError(errors.invalidEmail);
        } else if (loginPassword.length < PASSWORD_MIN_LENGTH) {
          handleError(errors.shortPassword);
        }
      }
    } else {
      showLogin();
    }
  }, [loginVisible, loginEmail, loginPassword])

  // const res = await Auth.currentSession();
  // let accessToken = res.getAccessToken();
  // let jwt = accessToken.getJwtToken();

  const signup = useCallback(() => {
    if (signupVisible) {
      if (name.trim() !== "" && validateEmail(signupEmail) && signupPassword.length >= PASSWORD_MIN_LENGTH) {
        setLoadingSignup(true);
        uploadImage(image, async (fileName) => {
          let attributes = {
            name: name.trim(),
          }
          attributes[ATTRIBUTE_POINTS] = `${offlineUser.points}`;
          attributes[ATTRIBUTE_NUM_OF_REPORTS] = `${offlineUser.numOfReports}`;
          attributes[ATTRIBUTE_UNLOCKED_PLACES] = JSON.stringify(DEFAULT_UNLOCKED_PLACES);
          if (fileName) {
            attributes.picture = fileName;
          }
          try {
            await Auth.signUp({
              username: signupEmail.trim(),
              password: signupPassword,
              attributes
            });
            const authUser = await Auth.signIn(signupEmail.trim(), signupPassword);
            saveUser(cognitoToUser(authUser));
            dispatch({
              type: SAVE_TOKEN,
              payload: getToken(authUser),
            });
          } catch (error) {
            handleError(error);
          } finally {
            setLoadingSignup(false);
          }
        })
      } else {
        if (name.trim() === "") {
          handleError(errors.enterName);
        } else if (!validateEmail(signupEmail)) {
          handleError(errors.invalidEmail);
        } else if (signupPassword.length < PASSWORD_MIN_LENGTH) {
          handleError(errors.shortPassword);
        }
      }
    } else {
      showSignup();
    }
  }, [signupVisible, name, signupEmail, signupPassword, image])

  const showLogin = useCallback(() => {
    setLoginVisible(true);
    setSignupVisible(false);
    setForgotPasswordVisible(false);
    setNewPasswordVisible(false);
  }, [])

  const showSignup = useCallback(() => {
    setSignupVisible(true);
    setLoginVisible(false);
    setForgotPasswordVisible(false);
    setNewPasswordVisible(false);
  }, [])

  const saveUser = (user) => {
    dispatch({
      type: SAVE_USER,
      payload: user
    })
    navigation.navigate("Home");
  }

  const forgotPassword = useCallback(() => {
    if (forgotPasswordVisible) {
      console.log("forgotPassword");
    } else {
      setRestoreEmail(loginEmail);
      setForgotPasswordVisible(true);
      setLoginVisible(false);
      setSignupVisible(false);
      setNewPasswordVisible(false);
    }
  }, [forgotPasswordVisible, loginEmail])

  const tapClose = useCallback((event) => {
    if (event.nativeEvent.state === State.END) {
      if (keyboardHeight > 0 ) {
        Keyboard.dismiss();
      } else {
        goBack();
      }
    }
  }, [keyboardHeight, goBack])

  const restorePassword = useCallback(() => {
    if (restoreEmail.length > 0) {
      if (!validateEmail(restoreEmail)) {
        handleError(errors.invalidEmail);
      } else {
        setLoadingRestorePassword(true);
        Auth.forgotPassword(restoreEmail)
          .then(data => {
            setEmailSentVisible(true);
            setForgotPasswordVisible(false);
          })
          .catch(err => {
            handleError(err);
          })
          .finally(()=>setLoadingRestorePassword(false));
      }
    } else {
      console.log("no email");
    }
  }, [restoreEmail])

  const gotIt = useCallback(() => {
    setNewPasswordVisible(true);
    setEmailSentVisible(false);
  }, [])

  const changePassword = useCallback(() => {
    if (newPassword.length >= PASSWORD_MIN_LENGTH && code.length > 0) {
      setLoadingChangePassword(true);
      Auth.forgotPasswordSubmit(restoreEmail, code, newPassword)
        .then(() => {
          setLoginEmail(restoreEmail);
          setLoginPassword(newPassword);
          login();
        })
        .catch(err => {
          console.error(err)
          handleError(err);
        })
        .finally(()=>setLoadingChangePassword(false));
    } else {
      if (newPassword.length < PASSWORD_MIN_LENGTH) {
        handleError(errors.shortPassword);
      } else if (code.length === 0) {
        handleError(errors.enterCode);
      }
    }
  }, [newPassword, code, restoreEmail])

  const handleError = (error) => {
    if (error) {
      setErrorData(strings.popups.loginError(error.code));
      setErrorPopupVisible(true);
    }
    console.error(error);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView onLayout={onSafeAreaLayout} ref={scrollRef} scrollEnabled={scrollEnabled} contentContainerStyle={styles.scrollView}>

        <View style={styles.popupsContainer(safeAreaHeight)}>

          <TapGestureHandler onHandlerStateChange={tapClose}>
            <View style={StyleSheet.absoluteFill} />
          </TapGestureHandler>

          <LoginView
            loading={loadingLogin}
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
            loading={loadingSignup}
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
            loading={loadingRestorePassword}
            visible={forgotPasswordVisible}
            email={restoreEmail}
            onEmailChanged={onRestoreEmailChanged}
            restorePassword={restorePassword}
          />

          <EmailSentView visible={emailSentVisible} gotIt={gotIt} />
          
          <NewPasswordView
            loading={loadingChangePassword}
            code={code}
            onCodeChanged={onCodeChanged}
            visible={newPasswordVisible}
            newPassword={newPassword}
            onNewPasswordChanged={onNewPasswordChanged}
            changePassword={changePassword}
          />

        </View>
      </KeyboardAwareScrollView>
      <Popup textData={strings.popups.gallery} action={askSettings} popupVisible={imagePopupvisible} setPopupVisible={setPopupVisible} />
      <Popup textData={errorData} popupVisible={errorPopupVisible} setPopupVisible={setErrorPopupVisible} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    backgroundColor: colors.clear,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: "center",
  },

  popupsContainer: (height) => ({
    height,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  })
});
